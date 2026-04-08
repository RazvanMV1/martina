// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const clickData = {
      source: body.source || 'direct',
      medium: body.medium || '',
      campaign: body.campaign || '',
      referrer: body.referrer || 'none',
      user_agent: req.headers.get('user-agent') || '',
      ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown',
      country: req.headers.get('x-vercel-ip-country') || '',
      clicked_at: body.timestamp || new Date().toISOString(),
    };

    await supabase.from('clicks').insert([clickData]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
