// app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import SubscribeForm from '@/components/SubscribeForm';

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black flex items-center">

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
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
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />
        <div
          className="absolute inset-y-0 hidden md:block"
          style={{
            right: '42%',
            width: '1px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(244,63,94,0.08) 30%, rgba(244,63,94,0.12) 50%, rgba(244,63,94,0.08) 70%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)',
          }}
        />
      </div>

      {/* ════════════════════════════════════════
          DESKTOP
          ════════════════════════════════════════ */}
      <div className="relative z-20 w-full h-full hidden md:flex items-center">

        {/* STÂNGA — content sau confirmare */}
        <div className="flex flex-col justify-center items-start text-left px-16 lg:px-24 w-[58%]">

          {!submitted ? (
            // ── STAREA INITIALA ──
            <>
              <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-3">
                Exclusive Circle · By Invitation Only
              </p>

              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
                She doesn&apos;t show this{' '}
                <span className="block">to everyone.</span>
                <span
                  className="italic font-normal text-rose-300 block"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  You just made the list.
                </span>
              </h1>

              <p
                className="text-sm lg:text-base text-gray-400 font-light leading-relaxed mb-3 max-w-sm"
                spellCheck={false}
              >
                Exclusive content, real moments, nothing held back —{' '}
                <strong className="text-white font-medium">free access, by invitation only.</strong>
              </p>

              <p className="text-xs text-rose-300/70 font-medium tracking-wide mb-6">
                ⚡ Spots are limited — she keeps this circle small.
              </p>

              <SubscribeForm onSuccess={() => setSubmitted(true)} />

              <p className="mt-3 text-xs text-gray-600">
                🔒 100% discreet · Free forever · Cancel anytime
              </p>
            </>
          ) : (
            // ── STAREA DUPA SUBMIT ──
            <div className="flex flex-col items-start gap-5 max-w-sm animate-fadeIn">

              {/* Eyebrow */}
              <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60">
                Almost there · Check your inbox
              </p>

              {/* Icon email animat */}
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-8 h-8 text-rose-400"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>

              {/* Headline */}
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                One step left.{' '}
                <span
                  className="italic font-normal text-rose-300 block"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Confirm your access.
                </span>
              </h1>

              {/* Instructiuni clare */}
              <p className="text-sm lg:text-base text-gray-400 font-light leading-relaxed">
                We sent you a confirmation email.{' '}
                <strong className="text-white font-medium">
                  Open it and click the link
                </strong>{' '}
                to unlock your exclusive access — it only takes a second.
              </p>

              {/* Steps vizuali */}
              <div className="flex flex-col gap-3 w-full">

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-400 text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Open your <strong className="text-white">email inbox</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-400 text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Find the email from <strong className="text-white">Martina Valenti</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-400 text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Click <strong className="text-white">"Confirm My Access"</strong> — and you&apos;re in
                  </p>
                </div>

              </div>

              {/* Hint spam */}
              <p className="text-xs text-gray-700 mt-1">
                Don&apos;t see it? Check your <span className="text-gray-500">spam folder</span> — it may have landed there.
              </p>

            </div>
          )}

        </div>

        {/* DREAPTA — avatar mereu vizibil */}
        <div className="flex flex-col items-center justify-center gap-4 w-[42%] h-full">

          <div className="relative w-72 h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(136,19,55,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
                transform: 'scale(1.3)',
              }}
              aria-hidden="true"
            />
            <div className="relative w-full h-full rounded-full ring-1 ring-rose-500/20 overflow-hidden shadow-2xl">
              <Image
                src="/avatar.webp"
                alt="Martina Valenti"
                fill
                priority
                quality={85}
                className="object-cover object-top"
                sizes="(min-width: 1280px) 384px, (min-width: 1024px) 320px, 288px"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-1/3"
                style={{ background: 'linear-gradient(to top, #000000 0%, transparent 100%)' }}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/60"
              role="img"
              aria-label="Online"
            />
            <span className="text-xs text-gray-400 tracking-wide">
              <strong className="text-white font-medium">Martina Valenti</strong> · Online now
            </span>
          </div>

          <p className="text-[0.65rem] text-gray-600 tracking-widest uppercase text-center">
            Applications reviewed manually
          </p>

        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE
          ════════════════════════════════════════ */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center text-center px-6 py-8 md:hidden">

        {/* Avatar mereu vizibil */}
        <div className="relative mb-3">
          <div className="w-36 h-36 rounded-full ring-1 ring-rose-500/20 overflow-hidden shadow-2xl mx-auto">
            <Image
              src="/avatar.webp"
              alt="Martina Valenti"
              width={144}
              height={144}
              priority
              quality={85}
              className="object-cover object-top w-full h-full"
            />
          </div>
          <div
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8"
            style={{
              background: 'radial-gradient(ellipse, rgba(136,19,55,0.3) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
            aria-hidden="true"
          />
          <span
            className="absolute bottom-1 right-1/2 translate-x-14 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-black shadow-lg shadow-emerald-400/60"
            role="img"
            aria-label="Online"
          />
        </div>

        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-400 tracking-wide">
            <strong className="text-white font-medium">Martina Valenti</strong> · Online now
          </span>
        </div>

        {!submitted ? (
          // ── MOBILE STAREA INITIALA ──
          <>
            <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-2">
              Exclusive Circle · By Invitation Only
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-3">
              She doesn&apos;t show this to everyone.{' '}
              <span
                className="italic font-normal text-rose-300 block"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                You just made the list.
              </span>
            </h1>

            <p
              className="text-sm text-gray-400 font-light leading-relaxed mb-3 max-w-xs"
              spellCheck={false}
            >
              Exclusive content, real moments, nothing held back —{' '}
              <strong className="text-white font-medium">free access, by invitation only.</strong>
            </p>

            <p className="text-xs text-rose-300/70 font-medium tracking-wide mb-5">
              ⚡ Spots are limited — she keeps this circle small.
            </p>

            <div className="w-full max-w-sm">
              <SubscribeForm onSuccess={() => setSubmitted(true)} />
            </div>

            <p className="mt-3 text-xs text-gray-600">
              🔒 100% discreet · Free forever · Cancel anytime
            </p>

            <p className="mt-2 text-[0.65rem] text-gray-700 tracking-widest uppercase">
              Applications reviewed manually
            </p>
          </>
        ) : (
          // ── MOBILE STAREA DUPA SUBMIT ──
          <div className="flex flex-col items-center gap-4 max-w-sm text-center">

            <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60">
              Almost there · Check your inbox
            </p>

            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-7 h-7 text-rose-400"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              One step left.{' '}
              <span
                className="italic font-normal text-rose-300 block"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Confirm your access.
              </span>
            </h1>

            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-xs">
              We sent you a confirmation email.{' '}
              <strong className="text-white font-medium">Open it and click the link</strong>{' '}
              to unlock your exclusive access.
            </p>

            <div className="flex flex-col gap-3 w-full text-left">

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-rose-400 text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-gray-400">
                  Open your <strong className="text-white">email inbox</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-rose-400 text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-gray-400">
                  Find the email from <strong className="text-white">Martina Valenti</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-rose-400 text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-gray-400">
                  Click <strong className="text-white">"Confirm My Access"</strong> — and you&apos;re in
                </p>
              </div>

            </div>

            <p className="text-xs text-gray-700 mt-1">
              Don&apos;t see it? Check your <span className="text-gray-500">spam folder.</span>
            </p>

          </div>
        )}

      </div>

    </main>
  );
}
