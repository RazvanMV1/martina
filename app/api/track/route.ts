// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Verifică dacă vizitatorul a mai dat click (cookie)
    const visited = req.cookies.get('mv_clicked')?.value;
    if (visited === '1') {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const body = await req.json();

    // Fingerprint simplu: IP + User Agent
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || req.headers.get('x-real-ip') 
      || 'unknown';
    const ua = req.headers.get('user-agent') || '';
    const fingerprint = `${ip}__${ua}`;

    // Verifică dacă acest fingerprint există deja în ultimele 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from('clicks')
      .select('id')
      .eq('fingerprint', fingerprint)
      .gte('clicked_at', oneDayAgo)
      .limit(1);

    if (existing && existing.length > 0) {
      // Deja contorizat, setăm cookie și ieșim
      const res = NextResponse.json({ ok: true, duplicate: true });
      res.cookies.set('mv_clicked', '1', {
        maxAge: 86400, // 24 ore
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
      return res;
    }

    // Click nou — salvează
    const clickData = {
      source: body.source || 'direct',
      medium: body.medium || '',
      campaign: body.campaign || '',
      referrer: body.referrer || 'none',
      user_agent: ua,
      ip,
      fingerprint,
      country: req.headers.get('x-vercel-ip-country') || '',
      clicked_at: body.timestamp || new Date().toISOString(),
    };

    await supabase.from('clicks').insert([clickData]);

    // Setează cookie ca să nu mai contorizeze la refresh
    const res = NextResponse.json({ ok: true, duplicate: false });
    res.cookies.set('mv_clicked', '1', {
      maxAge: 86400, // 24 ore
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
