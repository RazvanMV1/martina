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
const RATE_LIMIT_MAX = 3;
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
  // 1. Încercăm să luăm refresh token-ul din baza de date
  const { data: setting } = await supabaseAdmin
    .from('app_settings')
    .select('value')
    .eq('key', 'aweber_refresh_token')
    .single();

  // Dacă nu există în DB, îl folosim pe cel inițial din .env
  const refreshToken = setting?.value || process.env.AWEBER_REFRESH_TOKEN;

  if (!refreshToken) {
    throw new Error('No AWeber refresh token found in DB or ENV');
  }

  const authHeader = Buffer.from(
    `${process.env.AWEBER_CLIENT_ID}:${process.env.AWEBER_CLIENT_SECRET}`
  ).toString('base64');

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
    throw new Error(`AWeber Token Refresh Failed: ${data.error_description || data.error}`);
  }

  // 2. SALVĂM noul refresh token în DB (pentru că cel vechi a expirat prin folosire)
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
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

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

    // 1. LOGICA SUPABASE — Verificăm/Actualizăm/Inserăm subscriber
    const { data: existing } = await supabaseAdmin
      .from('email_subscribers')
      .select('id, status')
      .eq('email', email)
      .single();

    if (existing) {
      if (existing.status === 'confirmed') {
        return NextResponse.json(
          { success: true, message: 'Check your inbox!' },
          { status: 200 }
        );
      }
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
      const { error: dbError } = await supabaseAdmin
        .from('email_subscribers')
        .insert({
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

      if (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { error: 'Something went wrong. Please try again.' },
          { status: 500 }
        );
      }
    }

    // 2. LOGICA AWEBER — Trimitem datele pentru a declanșa mail-ul custom
    try {
      const accessToken = await getAWeberAccessToken();
      const accountId = process.env.AWEBER_ACCOUNT_ID;
      const listId = process.env.AWEBER_LIST_ID;

      const aweberUrl = `https://api.aweber.com/1.0/accounts/${accountId}/lists/${listId}/subscribers`;

      const aweberResponse = await fetch(aweberUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          // Injectăm token-ul generat mai sus în câmpul personalizat din AWeber
          custom_fields: {
            'verification_token': token 
          },
          // Tag-ul care pornește Campania în AWeber
          tags: ['confirmare_pending', utm_source],
          ad_tracking: utm_campaign,
        }),
      });

      if (!aweberResponse.ok) {
        const errorData = await aweberResponse.json();
        console.error('AWeber API Error:', errorData);
      }
      
    } catch (aweberError) {
      // Logăm eroarea dar nu blocăm userul (datele sunt deja în Supabase)
      console.error('AWeber Integration Error:', aweberError);
    }

    return NextResponse.json(
      { success: true, message: 'Check your inbox!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}