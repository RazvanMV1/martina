// app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  return token === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Total subscribers
    const { count: total } = await supabaseAdmin
      .from('email_subscribers')
      .select('*', { count: 'exact', head: true });

    // Confirmed
    const { count: confirmed } = await supabaseAdmin
      .from('email_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed');

    // Pending
    const { count: pending } = await supabaseAdmin
      .from('email_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Ultimii 50 subscriberi
    const { data: recent } = await supabaseAdmin
      .from('email_subscribers')
      .select('email, status, utm_source, utm_medium, utm_campaign, created_at, confirmed_at')
      .order('created_at', { ascending: false })
      .limit(50);

    // Top surse UTM
    const { data: utmData } = await supabaseAdmin
      .from('email_subscribers')
      .select('utm_source')
      .eq('status', 'confirmed');

    const utmSources = utmData?.reduce((acc: Record<string, number>, row) => {
      const source = row.utm_source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});

    const topSources = Object.entries(utmSources || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));

    // Înscrieri pe ultimele 7 zile
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: dailyData } = await supabaseAdmin
      .from('email_subscribers')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    const dailyStats = dailyData?.reduce((acc: Record<string, number>, row) => {
      const date = new Date(row.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      total: total || 0,
      confirmed: confirmed || 0,
      pending: pending || 0,
      conversionRate: total ? Math.round(((confirmed || 0) / total) * 100) : 0,
      topSources,
      dailyStats,
      recent,
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
