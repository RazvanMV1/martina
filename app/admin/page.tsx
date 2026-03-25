// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Subscriber {
  email: string;
  status: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  created_at: string;
  confirmed_at: string | null;
}

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  conversionRate: number;
  topSources: { source: string; count: number }[];
  dailyStats: Record<string, number>;
  recent: Subscriber[];
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async (pwd: string) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${pwd}` },
      });

      if (response.status === 401) {
        setError('Wrong password.');
        setIsAuthenticated(false);
        return;
      }

      const data = await response.json();
      setStats(data);
      setIsAuthenticated(true);
    } catch {
      setError('Failed to fetch stats.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(password);
  };

  // Auto-refresh la fiecare 30 secunde
  useEffect(() => {
    if (!isAuthenticated || !password) return;
    const interval = setInterval(() => fetchStats(password), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, password]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#111827] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-white text-center mb-8">
            Admin Dashboard
          </h1>
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
              "
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
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

  return (
    <main className="min-h-screen bg-[#111827] px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <button
            onClick={() => fetchStats(password)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            ↻ Refresh
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total', value: stats?.total, color: 'text-white' },
            { label: 'Confirmed', value: stats?.confirmed, color: 'text-emerald-400' },
            { label: 'Pending', value: stats?.pending, color: 'text-yellow-400' },
            { label: 'Conversion', value: `${stats?.conversionRate}%`, color: 'text-rose-400' },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white/5 border border-white/10 rounded-xl p-5 text-center"
            >
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          {/* TOP SURSE UTM */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Top Sources</h2>
            {stats?.topSources.length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {stats?.topSources.map((item) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm capitalize">{item.source}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{
                            width: `${Math.round((item.count / (stats?.confirmed || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-white font-semibold text-sm w-6 text-right">
                        {item.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ÎNSCRIERI PE ZILE */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">Last 7 Days</h2>
            {!stats?.dailyStats || Object.keys(stats.dailyStats).length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet.</p>
            ) : (
              <div className="flex items-end gap-2 h-24">
                {Object.entries(stats.dailyStats).map(([date, count]) => {
                  const max = Math.max(...Object.values(stats.dailyStats));
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-white text-xs font-semibold">{count}</span>
                      <div
                        className="w-full bg-rose-500/80 rounded-t"
                        style={{ height: `${Math.round((count / max) * 64)}px` }}
                      />
                      <span className="text-gray-500 text-xs">
                        {new Date(date).getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* LISTA SUBSCRIBERI */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Recent Subscribers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="text-left pb-3">Email</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-left pb-3">Source</th>
                  <th className="text-left pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recent.map((sub) => (
                  <tr key={sub.email} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 text-gray-300">{sub.email}</td>
                    <td className="py-3">
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${sub.status === 'confirmed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-yellow-500/20 text-yellow-400'}
                      `}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 capitalize">
                      {sub.utm_source || 'direct'}
                    </td>
                    <td className="py-3 text-gray-500">
                      {new Date(sub.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
