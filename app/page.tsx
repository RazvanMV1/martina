// app/page.tsx
'use client';

import Image from 'next/image';
import { useState, FormEvent, useEffect, useCallback } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState({
    utm_source: 'direct',
    utm_medium: 'none',
    utm_campaign: 'none',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') || 'direct',
      utm_medium: params.get('utm_medium') || 'none',
      utm_campaign: params.get('utm_campaign') || 'none',
    });
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), ...utmParams }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, utmParams]);

  return (
    <main className="relative h-screen w-full flex items-center overflow-hidden bg-black">

      {/* ── BACKGROUND — gradient animat, zero imagini ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">

        {/* Strat 1: gradient radial rose/purple din dreapta — atmosfera */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 80% at 85% 40%, rgba(136,19,55,0.18) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 75% 80%, rgba(88,28,135,0.12) 0%, transparent 65%),
              radial-gradient(ellipse 40% 40% at 20% 20%, rgba(136,19,55,0.06) 0%, transparent 60%),
              #000000
            `,
          }}
        />

        {/* Strat 2: noise texture — grain cinematic */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />

        {/* Strat 3: linie verticală subtilă separator dreapta */}
        <div
          className="absolute inset-y-0 hidden md:block"
          style={{
            right: '38%',
            width: '1px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(244,63,94,0.08) 30%, rgba(244,63,94,0.12) 50%, rgba(244,63,94,0.08) 70%, transparent 100%)',
          }}
        />

        {/* Strat 4: vignette pe margini */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)
            `,
          }}
        />
      </div>

      {/* ── CONTENT — centrat vertical, stânga pe desktop ── */}
      <div className="relative z-20 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 w-full max-w-lg">

        {/* AVATAR */}
        <div className="mb-5 relative">
          <div className="w-20 h-20 rounded-full ring-2 ring-rose-500/30 overflow-hidden shadow-2xl shadow-rose-900/20">
            <Image
              src="/hero-mobile.webp"
              alt="Martina"
              width={80}
              height={80}
              priority
              quality={85}
              className="object-cover w-full h-full"
            />
          </div>
          <span
            className="absolute bottom-0.5 left-14 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-black shadow-lg shadow-emerald-400/60"
            aria-label="Online"
          />
        </div>

        {/* EYEBROW */}
        <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-3">
          Private Access · Members Only
        </p>

        {/* HEADLINE */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight mb-3">
          You thought you knew me?{' '}
          <span className="text-rose-300 italic font-light block">
            Discover my uncensored side.
          </span>
        </h1>

        {/* SUBHEADLINE */}
        <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed mb-6 max-w-sm">
          Exclusive access to my private world.{' '}
          <strong className="text-white font-medium">100% free</strong>, only on Telegram.
        </p>

        {/* FORM / SUCCESS */}
        {submitted ? (
          <SuccessState />
        ) : (
          <>
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Your email address"
                className="
                  flex-1 px-4 py-3 rounded-xl
                  bg-white/5 backdrop-blur-md
                  border border-white/10
                  text-white placeholder-gray-600 text-sm
                  outline-none
                  focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/30
                  transition-all duration-200
                "
                disabled={isLoading}
                aria-invalid={!!error}
                aria-describedby={error ? 'form-error' : undefined}
              />
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="
                  px-5 py-3 rounded-xl
                  bg-rose-600 hover:bg-rose-500 active:scale-[0.97]
                  disabled:opacity-40 disabled:cursor-not-allowed
                  text-white font-bold text-sm tracking-wider uppercase
                  transition-all duration-200
                  shadow-lg shadow-rose-900/40
                  whitespace-nowrap cursor-pointer
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400
                "
              >
                {isLoading ? <Spinner /> : 'Unlock the Secrets'}
              </button>
            </form>

            {/* ERROR MESSAGE */}
            {error && (
              <p
                id="form-error"
                className="mt-2 text-sm text-rose-400 font-medium"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* MICROCOPY */}
            <p className="mt-3 text-xs text-gray-600 tracking-wide">
              🔒 Spam-free.{' '}
              <span className="text-gray-500">100% discreet.</span>{' '}
              Free to join.
            </p>
          </>
        )}

        {/* SOCIAL PROOF */}
        <div className="mt-6 flex items-center gap-2.5 opacity-50">
          <AvatarStack />
          <p className="text-xs text-gray-500">
            <span className="text-white font-semibold">2,400+</span> members already inside
          </p>
        </div>

      </div>

      {/* ── DECORATIVE — dreapta desktop, placeholder pana vine avatarul mare ── */}
      <div
        className="absolute right-0 top-0 bottom-0 hidden md:flex items-center justify-center w-[42%]"
        aria-hidden="true"
      >
        <div
          className="w-72 h-72 lg:w-96 lg:h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(136,19,55,0.08) 0%, transparent 70%)',
            boxShadow: '0 0 120px 40px rgba(136,19,55,0.06)',
          }}
        />
      </div>

    </main>
  );
}

/* ── SUB-COMPONENTS ─────────────────────────────────────────────────────── */

function SuccessState() {
  return (
    <div
      className="flex flex-col items-start gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="w-6 h-6 text-emerald-400"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <p className="text-white font-semibold text-base">You&apos;re in. Check your inbox.</p>
      <p className="text-gray-500 text-sm">
        Meanwhile,{' '}
        <a
          href="https://t.me/themartinavalenti"
          target="_blank"
          rel="noopener noreferrer"
          className="text-rose-400 underline underline-offset-2 hover:text-rose-300 transition-colors"
        >
          join Telegram now →
        </a>
      </p>
    </div>
  );
}

function Spinner() {
  return (
    <span className="flex items-center gap-2" aria-label="Loading">
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
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      Sending...
    </span>
  );
}

function AvatarStack() {
  return (
    <div className="flex -space-x-2" aria-hidden="true">
      {['bg-rose-400/50', 'bg-purple-400/50', 'bg-pink-400/50', 'bg-indigo-400/50'].map((color, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full ${color} ring-2 ring-black`}
        />
      ))}
    </div>
  );
}
