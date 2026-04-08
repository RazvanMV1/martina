// app/api/admin/clicks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  // Auth check
  const auth = req.headers.get('authorization')?.replace('Bearer ', '');
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Total clicks
  const { count: totalClicks } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true });

  // Clicks azi
  const today = new Date().toISOString().split('T')[0];
  const { count: todayClicks } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .gte('clicked_at', `${today}T00:00:00`);

  // Clicks saptamana asta
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: weekClicks } = await supabase
    .from('clicks')
    .select('*', { count: 'exact', head: true })
    .gte('clicked_at', sevenDaysAgo);

  // Clicks pe ultimele 30 zile (pentru grafic)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: monthData } = await supabase
    .from('clicks')
    .select('clicked_at')
    .gte('clicked_at', thirtyDaysAgo);

  // Construim obiect cu fiecare zi din ultimele 30
  const dailyClicks: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    dailyClicks[d] = 0;
  }
  monthData?.forEach((row) => {
    const day = row.clicked_at.split('T')[0];
    if (dailyClicks[day] !== undefined) dailyClicks[day]++;
  });

  // Top surse
  const { data: sourceData } = await supabase
    .from('clicks')
    .select('source');

  const sourceCounts: Record<string, number> = {};
  sourceData?.forEach((row) => {
    const s = row.source || 'direct';
    sourceCounts[s] = (sourceCounts[s] || 0) + 1;
  });

  const topSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top tari
  const { data: countryData } = await supabase
    .from('clicks')
    .select('country');

  const countryCounts: Record<string, number> = {};
  countryData?.forEach((row) => {
    const c = row.country || 'unknown';
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  const topCountries = Object.entries(countryCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return NextResponse.json({
    totalClicks,
    todayClicks,
    weekClicks,
    topSources,
    dailyClicks,
    topCountries,
  });
}
