// app/page.tsx
'use client';

import Image from 'next/image';

const LINKS = {
  telegram: 'https://t.me/+2mCTM0udo780NGU0',
  twitter: 'https://x.com/martyyy_only',
  instagram: 'https://www.instagram.com/martyyy.only/',
  fanvue: 'https://www.fanvue.com/martina.valenti',
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center">

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 80% at 50% 30%, rgba(136,19,55,0.20) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 60% 80%, rgba(88,28,135,0.12) 0%, transparent 65%),
              radial-gradient(ellipse 40% 40% at 30% 20%, rgba(136,19,55,0.06) 0%, transparent 60%),
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
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.7) 100%)',
          }}
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-20 w-full max-w-md mx-auto flex flex-col items-center text-center px-6 py-12 sm:py-16">

        {/* HERO IMAGE */}
        <div className="relative mb-6">
          <div className="w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full ring-1 ring-rose-500/20 overflow-hidden shadow-2xl mx-auto">
            <Image
              src="/avatar.webp"
              alt="Martina Valenti"
              width={600}
              height={600}
              priority
              quality={90}
              sizes="(min-width: 768px) 240px, (min-width: 640px) 208px, 176px"
              className="object-cover object-top w-full h-full"
            />
          </div>
          {/* Glow behind avatar */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 rounded-full -z-10"
            style={{
              background: 'radial-gradient(circle, rgba(136,19,55,0.25) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            aria-hidden="true"
          />
          {/* Online indicator */}
          <span
            className="absolute bottom-2 right-1/2 translate-x-[4.5rem] sm:translate-x-[5.2rem] w-4 h-4 rounded-full bg-emerald-400 ring-[3px] ring-black shadow-lg shadow-emerald-400/60"
            role="img"
            aria-label="Online"
          />
        </div>

        {/* NAME + STATUS */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-sm text-gray-400 tracking-wide">
            <strong className="text-white font-medium text-base">Martina Valenti</strong>
            <span className="text-gray-600 mx-1.5">·</span>
            <span className="text-emerald-400/80 text-xs">Online now</span>
          </span>
        </div>

        {/* TAGLINE */}
        <p
          className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed mb-8 max-w-xs"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Hey, I&apos;m Martina.<br />
          <span className="text-white font-normal">Here&apos;s where you can find me.</span>
        </p>

        {/* ── BUTTONS ── */}
        <div className="w-full flex flex-col gap-3.5">

          {/* TELEGRAM — PRIMARY CTA */}
          <a
            href={LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-white font-semibold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(244,63,94,0.9) 0%, rgba(136,19,55,0.9) 100%)',
              boxShadow: '0 0 30px rgba(244,63,94,0.3), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Join my private Telegram
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-300"></span>
            </span>
          </a>

          {/* TWITTER/X */}
          <a
            href={LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl text-white font-medium text-sm border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Follow me on X
          </a>

          {/* INSTAGRAM */}
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl text-white font-medium text-sm border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Follow me on Instagram
          </a>

          {/* FANVUE */}
          <a
            href={LINKS.fanvue}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl text-white font-medium text-sm border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/>
            </svg>
            Subscribe on Fanvue
          </a>

        </div>

        {/* FOOTER */}
        <p className="mt-8 text-[0.65rem] text-gray-700 tracking-widest uppercase">
          🔒 100% discreet
        </p>

      </div>
    </main>
  );
}
