// app/welcome/page.tsx
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">

      {/* Background gradient — consistent cu landing page */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 80% 50%, rgba(136,19,55,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(88,28,135,0.10) 0%, transparent 60%),
            #000000
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-md">

        {/* Icon check */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-8 h-8 text-emerald-400"
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
        <h1 className="text-3xl font-bold text-white leading-tight mb-2">
          You made the cut.{' '}
          <span
            className="italic font-normal text-rose-300 block"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Welcome to my private world.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-gray-400 text-sm leading-relaxed mt-4 mb-8 max-w-sm mx-auto">
          Your email has been confirmed. You now have exclusive access —
          join the private Telegram channel to see what the others never will.
        </p>

        {/* CTA Telegram */}
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
        <p className="mt-6 text-xs text-gray-700">
          Discreet · Select members only · Unsubscribe anytime
        </p>

        {/* Back link */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2"
          >
            ← Back to home
          </Link>
        </div>

      </div>
    </main>
  );
}
