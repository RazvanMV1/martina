// app/page.tsx
'use client';

// Notă: 'use client' este necesar DOAR pentru interactivitate (useState pentru form).
// Toate componentele statice rămân Server Components automat în Next.js App Router.

import Image from 'next/image';
import { useState, FormEvent } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// TIP: Plasează imaginea hero în /public/hero.jpg (sau .webp, .avif).
// Next.js <Image> va genera automat srcset și va servi AVIF/WebP browserelor
// compatibile. Dimensiunile de mai jos sunt orientative — ajustează conform
// imaginii tale reale.
// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
        }

        // Tracking event Plausible client-side
        // window.plausible?.('EmailCapture', { props: { source: 'hero-form' } });

        setSubmitted(true);

    } catch (error) {
        console.error('Subscription error:', error);
        alert(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
        setIsLoading(false);
    }
    };


  return (
    <main
      className="
        relative min-h-screen w-full
        flex items-center justify-center
        overflow-hidden
        bg-[#111827]
      "
    >
      {/* ── FUNDAL GRADIENT (Vignette effect) ───────────────────────────── */}
      <div
        className="
          absolute inset-0 z-0
          bg-gradient-to-b from-black/60 via-transparent to-black/80
        "
        aria-hidden="true"
      />

      {/* ── HERO BACKGROUND IMAGE ────────────────────────────────────────── */}
      {/* 
        Imaginea este în background (z-index 0), conținutul este deasupra (z-index 10).
        fill + object-cover = equivalent cu background-size: cover în CSS,
        dar cu toate optimizările Next.js (lazy load dezactivat prin priority,
        srcset automat, AVIF/WebP automat).
      */}
      <Image
        src="/hero.jpg"
        alt="Martina Valenti"
        fill
        priority={true}
        quality={85}
        className="object-cover object-top opacity-40 z-0"
        sizes="100vw"
      />

      {/* ── CONTENT CONTAINER ────────────────────────────────────────────── */}
      <div
        className="
          relative z-10
          flex flex-col items-center justify-center
          text-center
          px-6 py-12
          max-w-xl w-full
          mx-auto
        "
      >
        {/* ── AVATAR / PROFILE IMAGE (opțional, deasupra headline) ───────── */}
        <div className="mb-8 relative">
          <div
            className="
              w-24 h-24 rounded-full
              ring-2 ring-white/20
              overflow-hidden
              mx-auto
              shadow-2xl
            "
          >
            <Image
              src="/avatar.jpg"
              alt="Martina"
              width={96}
              height={96}
              priority={true}
              className="object-cover w-full h-full"
            />
          </div>
          {/* Status indicator — evocă exclusivitate */}
          <span
            className="
              absolute bottom-0 right-1/2 translate-x-10
              w-4 h-4 rounded-full
              bg-emerald-400
              ring-2 ring-[#111827]
              shadow-lg shadow-emerald-400/50
            "
            aria-label="Online"
          />
        </div>

        {/* ── EYEBROW TEXT ─────────────────────────────────────────────────
         * Microcopy discret deasupra headline-ului.
         * Rol psihologic: setează contextul de exclusivitate înainte de mesajul principal.
         */}
        <p
          className="
            text-xs font-medium tracking-[0.25em] uppercase
            text-rose-300/80
            mb-4
          "
        >
          Private Access · Members Only
        </p>

        {/* ── HEADLINE ─────────────────────────────────────────────────────
         * H1 este vital pentru SEO și accesibilitate.
         * Un singur H1 per pagină — regulă de bază.
         */}
        <h1
          className="
            text-3xl sm:text-4xl md:text-5xl
            font-bold tracking-tight
            text-white
            leading-tight
            mb-4
          "
        >
          You thought you knew me?{' '}
          <span className="text-rose-300 italic font-light">
            Discover my uncensored side.
          </span>
        </h1>

        {/* ── SUBHEADLINE ──────────────────────────────────────────────────  */}
        <p
          className="
            text-base sm:text-lg
            text-gray-300/90
            font-light
            leading-relaxed
            mb-10
            max-w-md
          "
        >
          Exclusive access to my private world.{' '}
          <strong className="text-white font-medium">100% free</strong>, only on Telegram.
        </p>

        {/* ── FORM ─────────────────────────────────────────────────────────
         * Starea `submitted` înlocuiește formularul cu un mesaj de confirmare.
         * Această abordare este superioară unui redirect deoarece:
         * 1. Menține utilizatorul pe pagină (reduce bounce rate post-conversie).
         * 2. Permite afișarea unui CTA secundar (ex: link Telegram direct).
         */}
        {submitted ? (
          <div
            className="
              flex flex-col items-center gap-4
              animate-fade-in
            "
            role="status"
            aria-live="polite"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
              {/* Checkmark SVG inline — zero dependențe externe */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="w-7 h-7 text-emerald-400"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-white font-semibold text-lg">You&apos;re in. Check your inbox.</p>
            <p className="text-gray-400 text-sm">
              Meanwhile,{' '}
              <a
                href="https://t.me/your-channel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-300 underline underline-offset-2 hover:text-rose-200 transition-colors"
              >
                join Telegram now →
              </a>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
            aria-label="Email capture form"
          >
            <label htmlFor="email-input" className="sr-only">
              Your email address
            </label>
            <input
              id="email-input"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="
                flex-1
                px-5 py-3.5
                rounded-xl
                bg-white/5 backdrop-blur-sm
                border border-white/10
                text-white placeholder-gray-500
                text-sm
                outline-none
                focus:ring-2 focus:ring-rose-400/60 focus:border-rose-400/60
                transition-all duration-200
              "
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !email}
              className="
                px-6 py-3.5
                rounded-xl
                bg-rose-500 hover:bg-rose-400
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-bold text-sm tracking-wider uppercase
                transition-all duration-200
                shadow-lg shadow-rose-500/30
                whitespace-nowrap
                cursor-pointer
              "
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  {/* Spinner SVG inline */}
                  <svg
                    className="animate-spin w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Unlock the Secrets'
              )}
            </button>
          </form>
        )}

        {/* ── MICROCOPY ────────────────────────────────────────────────────  */}
        {!submitted && (
          <p className="mt-4 text-xs text-gray-500 tracking-wide">
            🔒 Spam-free.{' '}
            <span className="text-gray-400">100% discreet.</span>{' '}
            Free to join.
          </p>
        )}

        {/* ── SOCIAL PROOF (opțional) ───────────────────────────────────── */}
        <div className="mt-10 flex items-center gap-2 opacity-60">
          <div className="flex -space-x-2">
            {/* Avatar stacks placeholder — înlocuiește cu imagini reale */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full bg-gray-600 ring-2 ring-[#111827]"
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="text-xs text-gray-400">
            <span className="text-white font-semibold">2,400+</span> members already inside
          </p>
        </div>
      </div>
    </main>
  );
}
