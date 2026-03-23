// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA DE VALIDARE
// Zod validează și sanitizează input-ul înainte de orice operație.
// .email() verifică formatul, .toLowerCase() normalizează pentru deduplicare.
// ─────────────────────────────────────────────────────────────────────────────
const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(254, 'Email too long') // limita RFC 5321
    .transform((val) => val.toLowerCase().trim()),
});

// ─────────────────────────────────────────────────────────────────────────────
// RATE LIMITING SIMPLU (in-memory)
// Pentru producție serioasă înlocuiește cu Upstash Redis.
// Această implementare funcționează per-instanță de server —
// suficientă pentru un landing page cu trafic moderat.
// ─────────────────────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 3;        // maxim 3 încercări
const RATE_LIMIT_WINDOW = 60000; // per 60 de secunde

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
    });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: Hash IP pentru GDPR compliance
// Nu stocăm niciodată IP-ul brut — doar un hash one-way.
// Util pentru detectarea pattern-urilor de spam fără a viola confidențialitatea.
// ─────────────────────────────────────────────────────────────────────────────
function hashIP(ip: string): string {
  return createHash('sha256')
    .update(ip + process.env.SUPABASE_SERVICE_ROLE_KEY) // salt cu cheia secretă
    .digest('hex')
    .substring(0, 16); // păstrăm doar primele 16 caractere
}

// ─────────────────────────────────────────────────────────────────────────────
// POST HANDLER
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // 1. Extragem IP-ul pentru rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // 2. Verificăm rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 3. Parsăm și validăm body-ul requestului
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // 4. Inserăm în Supabase
    const { error: dbError } = await supabaseAdmin
      .from('email_subscribers')
      .insert({
        email,
        source: 'landing-page',
        ip_hash: hashIP(ip),
      });

    // 5. Gestionăm erorile din baza de date
    if (dbError) {
      // Codul 23505 = unique violation — email-ul există deja
      if (dbError.code === '23505') {
        // Returnăm success intenționat — nu vrem să confirmăm
        // dacă un email există deja în baza noastră (securitate).
        return NextResponse.json(
          { success: true, message: 'Check your inbox!' },
          { status: 200 }
        );
      }

      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

    // 6. Tracking event Plausible (opțional, server-side)
    // Dacă folosești Plausible cu Events API:
    // await fetch('https://plausible.io/api/event', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'User-Agent': request.headers.get('user-agent') || '',
    //     'X-Forwarded-For': ip,
    //   },
    //   body: JSON.stringify({
    //     name: 'EmailCapture',
    //     url: 'https://your-domain.com',
    //     domain: 'your-domain.com',
    //   }),
    // });

    return NextResponse.json(
      { success: true, message: 'Check your inbox!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error in /api/subscribe:', error);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}

// Blocăm explicit toate celelalte metode HTTP
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
