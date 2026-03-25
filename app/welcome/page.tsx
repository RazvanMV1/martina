// app/welcome/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function WelcomePage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center px-6">

      {/* ── BACKGROUND — identic cu landing page ── */}
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
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)',
          }}
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">

        {/* Avatar */}
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(136,19,55,0.20) 0%, transparent 70%)',
              filter: 'blur(32px)',
              transform: 'scale(1.4)',
            }}
            aria-hidden="true"
          />
          <div className="relative w-24 h-24 rounded-full ring-1 ring-rose-500/20 overflow-hidden shadow-2xl mx-auto">
            <Image
              src="/avatar.webp"
              alt="Martina Valenti"
              fill
              priority
              quality={85}
              className="object-cover object-top"
              sizes="96px"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{ background: 'linear-gradient(to top, #000000 0%, transparent 100%)' }}
              aria-hidden="true"
            />
          </div>
          {/* Online dot */}
          <span
            className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-black shadow-lg shadow-emerald-400/60"
            role="img"
            aria-label="Online"
          />
        </div>

        {/* Online indicator */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-xs text-gray-400 tracking-wide">
            <strong className="text-white font-medium">Martina Valenti</strong> · Online now
          </span>
        </div>

        {/* Check icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
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

        {/* Eyebrow */}
        <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-3">
          Access Granted · Members Only
        </p>

        {/* Headline */}
        <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-2">
          You made the cut.{' '}
          <span
            className="italic font-normal text-rose-300 block"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Welcome to my private world.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm text-gray-400 font-light leading-relaxed mt-3 mb-7 max-w-sm mx-auto">
          Your email is confirmed. You now have exclusive access —
          join the private Telegram channel to see what{' '}
          <strong className="text-white font-medium">the others never will.</strong>
        </p>

        {/* CTA */}
        <a
          href="https://t.me/themartinavalenti"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-2
            px-8 py-4
            bg-rose-600 hover:bg-rose-500 active:scale-[0.97]
            text-white font-bold text-sm tracking-wider uppercase
            rounded-xl
            transition-all duration-200
            shadow-lg shadow-rose-900/40
          "
        >
          Enter the Circle →
        </a>

        {/* Microcopy */}
        <p className="mt-5 text-xs text-gray-700">
          Discreet · Select members only · Unsubscribe anytime
        </p>
      </div>
    </main>
  );
}
