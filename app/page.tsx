// app/page.tsx
'use client';

import { useEffect } from 'react';

const FANVUE_URL = 'https://www.fanvue.com/martina.valenti';

export default function HomePage() {

  useEffect(() => {
    // Extrage UTM params din URL
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || 'direct';
    const medium = params.get('utm_medium') || '';
    const campaign = params.get('utm_campaign') || '';

    // Trimite click-ul la API pentru tracking
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source,
        medium,
        campaign,
        referrer: document.referrer || 'none',
        timestamp: new Date().toISOString(),
      }),
    })
      .catch(() => {}) // fail silent, nu blocăm redirect-ul
      .finally(() => {
        // Redirect imediat după tracking (sau dacă tracking eșuează)
        window.location.href = FANVUE_URL;
      });

    // Fallback: dacă fetch durează prea mult, redirect forțat după 1.5s
    const timeout = setTimeout(() => {
      window.location.href = FANVUE_URL;
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  // Ecran minimal cât se face redirect-ul (sub 1 secundă de obicei)
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Redirecting...</p>
      </div>
    </main>
  );
}
