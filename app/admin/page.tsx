// app/admin/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

/* ─────────────────────── TYPES ─────────────────────── */

interface ClickStats {
  totalClicks: number;
  todayClicks: number;
  weekClicks: number;
  topSources: { source: string; count: number }[];
  dailyClicks: Record<string, number>;
  topCountries: { country: string; count: number }[];
}

/* ─────────────────────── PAGE ─────────────────────── */

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clickStats, setClickStats] = useState<ClickStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartRange, setChartRange] = useState<'7d' | '30d'>('7d');

  /* ── FETCH CLICKS ── */
  const fetchClicks = useCallback(async (pwd: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/clicks', {
        headers: { Authorization: `Bearer ${pwd}` },
      });

      if (response.status === 401) {
        setError('Wrong password.');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setClickStats(data);
      setIsAuthenticated(true);
    } catch {
      setError('Failed to fetch stats.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ── LOGIN ── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClicks(password);
  };

  /* ── AUTO REFRESH 30s ── */
  useEffect(() => {
    if (!isAuthenticated || !password) return;
    const interval = setInterval(() => fetchClicks(password), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, password, fetchClicks]);

  /* ════════════════════════════════════════════════════
     LOGIN SCREEN
     ════════════════════════════════════════════════════ */
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Click Tracker
          </h1>
          <p className="text-gray-500 text-sm text-center mb-8">
            martinavalenti.com → Fanvue
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                px-5 py-3.5 rounded-xl
                bg-white/5 border border-white/10
                text-white placeholder-gray-500
                outline-none focus:ring-2 focus:ring-rose-400/60
                transition-all duration-200
              "
            />
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="
                px-6 py-3.5 rounded-xl
                bg-rose-500 hover:bg-rose-400
                text-white font-bold text-sm tracking-wider uppercase
                transition-all duration-200
                disabled:opacity-50
              "
            >
              {isLoading ? 'Loading...' : 'Enter'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  /* ════════════════════════════════════════════════════
     HELPERS
     ════════════════════════════════════════════════════ */
  const dailyData = clickStats?.dailyClicks
    ? Object.entries(clickStats.dailyClicks)
    : [];

  // Filtrare pe 7 sau 30 zile
  const filteredDaily =
    chartRange === '7d' ? dailyData.slice(-7) : dailyData;

  const maxDaily = Math.max(
    ...filteredDaily.map(([, c]) => c),
    1,
  );

  const barHeight = (count: number) =>
    `${Math.max(Math.round((count / maxDaily) * 120), 4)}px`;

  const totalFiltered = filteredDaily.reduce((sum, [, c]) => sum + c, 0);
  const avgDaily =
    filteredDaily.length > 0
      ? Math.round(totalFiltered / filteredDaily.length)
      : 0;

  /* ════════════════════════════════════════════════════
     DASHBOARD
     ════════════════════════════════════════════════════ */
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Click Tracker</h1>
            <p className="text-gray-600 text-xs mt-1">
              martinavalenti.com → Fanvue · auto-refresh 30s
            </p>
          </div>
          <button
            onClick={() => fetchClicks(password)}
            disabled={isLoading}
            className="
              text-xs text-gray-400 hover:text-white
              bg-white/5 hover:bg-white/10
              border border-white/10
              px-4 py-2 rounded-lg
              transition-all duration-200
              disabled:opacity-50
            "
          >
            {isLoading ? '↻ Loading...' : '↻ Refresh'}
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Clicks"
            value={clickStats?.totalClicks ?? 0}
            color="text-white"
          />
          <StatCard
            label="Today"
            value={clickStats?.todayClicks ?? 0}
            color="text-emerald-400"
          />
          <StatCard
            label="This Week"
            value={clickStats?.weekClicks ?? 0}
            color="text-blue-400"
          />
          <StatCard
            label="Daily Avg"
            value={avgDaily}
            color="text-rose-400"
            subtitle={chartRange === '7d' ? 'last 7 days' : 'last 30 days'}
          />
        </div>

        {/* ── CHART: CLICKS PER DAY ── */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Clicks per Day</h2>
            <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setChartRange('7d')}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${chartRange === '7d'
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-400 hover:text-white'}
                `}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartRange('30d')}
                className={`
                  px-3 py-1.5 rounded-md text-xs font-medium transition-all
                  ${chartRange === '30d'
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-400 hover:text-white'}
                `}
              >
                30 Days
              </button>
            </div>
          </div>

          {filteredDaily.length === 0 ? (
            <Empty />
          ) : (
            <div className="flex items-end gap-[3px] sm:gap-1.5 h-40 overflow-x-auto pb-2">
              {filteredDaily.map(([date, count]) => (
                <div
                  key={date}
                  className="flex-1 min-w-[14px] flex flex-col items-center gap-1 group"
                >
                  {/* Count — show on hover or always if 7d */}
                  <span
                    className={`
                      text-white text-[10px] font-semibold transition-opacity
                      ${chartRange === '30d'
                        ? 'opacity-0 group-hover:opacity-100'
                        : 'opacity-100'}
                    `}
                  >
                    {count}
                  </span>
                  {/* Bar */}
                  <div
                    className="w-full bg-rose-500/80 hover:bg-rose-400 rounded-t transition-all duration-300 cursor-default"
                    style={{ height: barHeight(count) }}
                  />
                  {/* Date label */}
                  <span className="text-gray-600 text-[9px] sm:text-[10px] whitespace-nowrap">
                    {chartRange === '7d'
                      ? new Date(date).toLocaleDateString('en-US', {
                          weekday: 'short',
                        })
                      : new Date(date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                        })}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Summary under chart */}
          {filteredDaily.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
              <span className="text-gray-500 text-xs">
                Total ({chartRange === '7d' ? '7 days' : '30 days'}):{' '}
                <span className="text-white font-semibold">{totalFiltered}</span>
              </span>
              <span className="text-gray-500 text-xs">
                Peak:{' '}
                <span className="text-white font-semibold">{maxDaily}</span>{' '}
                clicks/day
              </span>
            </div>
          )}
        </div>

        {/* ── BOTTOM ROW: SOURCES + COUNTRIES ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* TOP SOURCES */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-5">Traffic Sources</h2>
            {!clickStats?.topSources || clickStats.topSources.length === 0 ? (
              <Empty />
            ) : (
              <div className="flex flex-col gap-3">
                {clickStats.topSources.map((item, i) => (
                  <BarRow
                    key={item.source}
                    rank={i + 1}
                    label={item.source}
                    count={item.count}
                    total={clickStats.totalClicks || 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* TOP COUNTRIES */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-5">Top Countries</h2>
            {!clickStats?.topCountries ||
            clickStats.topCountries.length === 0 ? (
              <Empty />
            ) : (
              <div className="flex flex-col gap-3">
                {clickStats.topCountries.map((item, i) => (
                  <BarRow
                    key={item.country}
                    rank={i + 1}
                    label={item.country}
                    count={item.count}
                    total={clickStats.totalClicks || 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════ */

function StatCard({
  label,
  value,
  color,
  subtitle,
}: {
  label: string;
  value: string | number;
  color: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
      <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className={`font-bold text-3xl ${color}`}>{value}</p>
      {subtitle && (
        <p className="text-gray-600 text-[10px] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function BarRow({
  rank,
  label,
  count,
  total,
}: {
  rank: number;
  label: string;
  count: number;
  total: number;
}) {
  const pct = Math.round((count / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-600 text-xs w-4 text-right">{rank}.</span>
      <span className="text-gray-300 text-sm capitalize w-24 truncate">
        {label || 'direct'}
      </span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-500/80 rounded-full transition-all duration-500"
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
      <span className="text-white font-semibold text-sm w-10 text-right">
        {count}
      </span>
      <span className="text-gray-600 text-xs w-10 text-right">{pct}%</span>
    </div>
  );
}

function Empty() {
  return <p className="text-gray-500 text-sm">No data yet.</p>;
}
