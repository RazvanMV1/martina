// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

// ─────────────────────────────────────────────────────────────────────────────
// FONT OPTIMIZATION
// next/font elimină complet font flash (FOUT) și self-hostează fontul automat.
// Nicio cerere externă către Google Fonts în producție.
// ─────────────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// ─────────────────────────────────────────────────────────────────────────────
// SEO METADATA
// Centralizat aici — fiecare pagină poate override aceste valori prin
// propriul export `metadata`.
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Martina Valenti — Exclusive Private Access',
  description:
    'Discover my uncensored side. Exclusive access to my private world. 100% free, only on Telegram.',
  robots: {
    // IMPORTANT: Dezactivăm indexarea până la lansarea oficială.
    // Schimbă în `index: true, follow: true` când ești gata de launch.
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Martina Valenti — Exclusive Private Access',
    description: 'Discover the uncensored side.',
    type: 'website',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#111827] antialiased">

        {/* ── ANALYTICS PLACEHOLDER ─────────────────────────────────────────
         *
         * OPȚIUNEA A — Plausible Analytics (self-hosted sau cloud)
         *
         * Folosim componenta <Script> din Next.js cu strategy="afterInteractive".
         * Aceasta înseamnă că scriptul se încarcă DUPĂ ce pagina devine
         * interactivă — nu blochează niciodată render-ul inițial (FCP/LCP).
         *
         * Pentru a activa: înlocuiește "your-domain.com" cu domeniul tău
         * și decomentează blocul de mai jos.
         *
         * <Script
         *   defer
         *   data-domain="your-domain.com"
         *   src="https://plausible.io/js/script.js"
         *   strategy="afterInteractive"
         * />
         *
         * ── OPȚIUNEA B — Vercel Analytics (dacă deploy-ul este pe Vercel)
         *
         * 1. Instalează: npm install @vercel/analytics
         * 2. Importă componenta:
         *    import { Analytics } from '@vercel/analytics/react';
         * 3. Adaugă <Analytics /> direct în <body>, după {children}.
         *
         * Vercel Analytics folosește, de asemenea, strategy="afterInteractive"
         * intern și nu impactează Core Web Vitals.
         *
         * ── DE CE NU GOOGLE TAG MANAGER / GA4?
         *
         * - GA4 script: ~45KB, blocant, necesită consimțământ GDPR explicit.
         * - Plausible script: ~1KB, non-blocant, fără cookie-uri, GDPR compliant
         *   by default — rata de blocare de către ad-blocker-e este sub 5%
         *   față de ~35% pentru GA4.
         * - Măsurare mai precisă a vizitatorilor unici și a evenimentelor custom
         *   (ex: form submit) prin API-ul `plausible('FormSubmit', { props: ... })`.
         *
         ───────────────────────────────────────────────────────────────────── */}

        {children}

      </body>
    </html>
  );
}
