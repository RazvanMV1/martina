// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash, randomBytes } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { sendConfirmationEmail } from '@/lib/email';

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA DE VALIDARE — include UTM params
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
    .update(ip + process.env.SUPABASE_SERVICE_ROLE_KEY)
    .digest('hex')
    .substring(0, 16);
}

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

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

    // Verificăm dacă emailul există deja
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

      // Emailul există dar nu este confirmat — actualizăm tokenul și UTM-urile
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
      // Email nou — inserăm cu UTM params
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

    await sendConfirmationEmail(email, token);

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
