import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash, randomBytes } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA DE VALIDARE
// ─────────────────────────────────────────────────────────────────────────────
const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email too long')
    .transform((val) => val.toLowerCase().trim()),
  utm_source: z.string().max(100).optional().default('direct'),
  utm_medium: z.string().max(100).optional().default('none'),
  utm_campaign: z.string().max(100).optional().default('none'),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5; // Relaxat puțin pentru teste
const RATE_LIMIT_WINDOW = 60000;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX) return true;
  record.count++;
  return false;
}

function hashIP(ip: string): string {
  return createHash('sha256')
    .update(ip + (process.env.SUPABASE_SERVICE_ROLE_KEY || ''))
    .digest('hex')
    .substring(0, 16);
}

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGICA AWEBER (OAuth2 Refresh + Get Access Token)
// ─────────────────────────────────────────────────────────────────────────────
async function getAWeberAccessToken() {
  console.log('--- AWEBER AUTH START ---');
  
  // 1. Încercăm Supabase
  const { data: setting, error: dbErr } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'aweber_refresh_token')
    .single();

  let refreshToken = setting?.value;
  
  if (refreshToken) {
    console.log('Using Refresh Token from SUPABASE:', refreshToken.substring(0, 10) + '...');
  } else {
    console.log('No token in Supabase, trying .env...');
    refreshToken = process.env.AWEBER_REFRESH_TOKEN;
    if (refreshToken) console.log('Using Refresh Token from .ENV:', refreshToken.substring(0, 10) + '...');
  }

  if (!refreshToken) {
    console.error('CRITICAL: No refresh token found anywhere!');
    throw new Error('MISSING_REFRESH_TOKEN');
  }

  const authHeader = Buffer.from(
    `${process.env.AWEBER_CLIENT_ID}:${process.env.AWEBER_CLIENT_SECRET}`
  ).toString('base64');

  console.log('Requesting new Access Token from AWeber...');
  
  const response = await fetch('https://auth.aweber.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authHeader}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('AWEBER OAUTH ERROR:', data);
    throw new Error(`AUTH_FAILED: ${data.error_description || data.error}`);
  }

  console.log('New Access Token obtained successfully.');

  // 2. SALVĂM noul refresh token imediat
  if (data.refresh_token) {
    console.log('Saving NEW Refresh Token to Supabase...');
    const { error: upsertErr } = await supabaseAdmin
      .from('app_settings')
      .upsert({ key: 'aweber_refresh_token', value: data.refresh_token });
    
    if (upsertErr) console.error('Failed to save new token to DB:', upsertErr);
    else console.log('New Refresh Token saved.');
  }

  return data.access_token;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN POST ROUTE
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  console.log('--- NEW SUBSCRIBE REQUEST ---');
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      console.warn('Rate limit hit for IP:', ip);
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { email, utm_source, utm_medium, utm_campaign } = validation.data;
    console.log('Processing email:', email);
    
    const token = generateToken();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 1. SUPABASE
    const { data: existing } = await supabaseAdmin
      .from('email_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      console.log('Subscriber exists, updating...');
      await supabaseAdmin
        .from('email_subscribers')
        .update({
          token,
          token_expires_at: tokenExpiresAt.toISOString(),
          utm_source,
          utm_medium,
          utm_campaign,
        })
        .eq('email', email);
    } else {
      console.log('New subscriber, inserting to DB...');
      await supabaseAdmin.from('email_subscribers').insert({
        email,
        status: 'pending',
        token,
        token_expires_at: tokenExpiresAt.toISOString(),
        source: 'landing-page',
        ip_hash: hashIP(ip),
        utm_source,
        utm_medium,
        utm_campaign,
      });
    }

    // 2. AWEBER
    try {
      const accessToken = await getAWeberAccessToken();
      const accountId = process.env.AWEBER_ACCOUNT_ID?.replace(/\D/g, '');
      const listId = process.env.AWEBER_LIST_ID?.replace(/\D/g, '');

      console.log(`Sending to AWeber: Account ${accountId}, List ${listId}`);

      const aweberUrl = `https://api.aweber.com/1.0/accounts/${accountId}/lists/${listId}/subscribers`;

      const aweberResponse = await fetch(aweberUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          update_existing: "true",
          custom_fields: {
            "verification_token": token
          },
          tags: ["confirmare_pending", utm_source],
          ad_tracking: utm_campaign.substring(0, 20),
          ip_address: ip === 'unknown' ? '127.0.0.1' : ip
        }),
      });

      if (!aweberResponse.ok) {
        const rawErrorText = await aweberResponse.text();
        console.error('AWEBER API ERROR:', rawErrorText);
        return NextResponse.json(
          { error: `AWeber Error: ${rawErrorText}` },
          { status: 500 }
        );
      }
      
      console.log('SUCCESS: Subscriber added/updated in AWeber.');

    } catch (aweberError: any) {
      console.error('AWEBER INTEGRATION CRASHED:', aweberError.message);
      return NextResponse.json(
        { error: `AWeber: ${aweberError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Check your inbox!' }, { status: 201 });

  } catch (error) {
    console.error('GLOBAL ROUTE ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}