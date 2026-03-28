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

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTE RATE LIMITING
// ─────────────────────────────────────────────────────────────────────────────
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60000; // 60 secunde in ms

// ─────────────────────────────────────────────────────────────────────────────
// UTILITARE
// ─────────────────────────────────────────────────────────────────────────────
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
// RATE LIMITING PRIN SUPABASE
// ─────────────────────────────────────────────────────────────────────────────
async function isRateLimited(ip: string): Promise<boolean> {
  const ipHash = hashIP(ip);
  const now = new Date();

  const { data: record } = await supabaseAdmin
    .from('rate_limits')
    .select('count, reset_at')
    .eq('ip_hash', ipHash)
    .single();

  // Nu există record sau a expirat — resetăm
  if (!record || new Date(record.reset_at) < now) {
    await supabaseAdmin
      .from('rate_limits')
      .upsert({
        ip_hash: ipHash,
        count: 1,
        reset_at: new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString(),
      });
    return false;
  }

  // A depășit limita
  if (record.count >= RATE_LIMIT_MAX) return true;

  // Incrementăm contorul
  await supabaseAdmin
    .from('rate_limits')
    .update({ count: record.count + 1 })
    .eq('ip_hash', ipHash);

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGICA AWEBER (OAuth2 Refresh + Get Access Token)
// ─────────────────────────────────────────────────────────────────────────────
async function getAWeberAccessToken(): Promise<string> {
  console.log('--- AWEBER AUTH START ---');

  const { data: setting } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'aweber_refresh_token')
    .single();

  const refreshToken = setting?.value || process.env.AWEBER_REFRESH_TOKEN;

  if (!refreshToken) {
    throw new Error('MISSING_REFRESH_TOKEN');
  }

  const authHeader = Buffer.from(
    `${process.env.AWEBER_CLIENT_ID}:${process.env.AWEBER_CLIENT_SECRET}`
  ).toString('base64');

  const response = await fetch('https://auth.aweber.com/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${authHeader}`,
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

  if (data.refresh_token) {
    await supabaseAdmin
      .from('app_settings')
      .upsert({ key: 'aweber_refresh_token', value: data.refresh_token });
  }

  return data.access_token;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN POST ROUTE
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  console.log('--- NEW SUBSCRIBE REQUEST ---');

  try {
    // 1. DETECTARE IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // 2. RATE LIMITING
    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // 3. VALIDARE INPUT
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, utm_source, utm_medium, utm_campaign } = validation.data;
    const token = generateToken();
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 4. SUPABASE SYNC
    const { data: existing } = await supabaseAdmin
      .from('email_subscribers')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
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

    // 5. AWEBER SYNC
    const accessToken = await getAWeberAccessToken();
    const accountId = process.env.AWEBER_ACCOUNT_ID?.replace(/\D/g, '');
    const listId = process.env.AWEBER_LIST_ID?.replace(/\D/g, '');

    console.log(`Pushing to AWeber... Account: ${accountId}, List: ${listId}`);

    const aweberUrl = `https://api.aweber.com/1.0/accounts/${accountId}/lists/${listId}/subscribers`;

    const aweberResponse = await fetch(aweberUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        update_existing: 'true',
        custom_fields: {
          verification_token: token,
        },
        tags: ['confirmare_pending', utm_source],
        ad_tracking: utm_campaign.substring(0, 20),
        ...(ip !== 'unknown' && { ip_address: ip }),
      }),
    });

    if (!aweberResponse.ok) {
      const errorData = await aweberResponse.json();
      console.error('AWEBER API ERROR:', errorData);
      return NextResponse.json(
        { error: `AWeber Error: ${errorData.message || 'Unknown'}` },
        { status: 400 }
      );
    }

    console.log('✅ SUCCESS: Subscriber synced with AWeber.');
    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error: any) {
    console.error('GLOBAL ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET — NOT ALLOWED
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
