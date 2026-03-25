// app/invalid-token/page.tsx
import Link from 'next/link';

export default function InvalidTokenPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">

      {/* Background gradient — consistent cu landing page */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 80% 50%, rgba(136,19,55,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 20% 80%, rgba(88,28,135,0.08) 0%, transparent 60%),
            #000000
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center max-w-md">

        {/* Icon X */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-8 h-8 text-red-400"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Eyebrow */}
        <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-3">
          Access Denied · Link Expired
        </p>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-white leading-tight mb-2">
          This door is closed.{' '}
          <span
            className="italic font-normal text-rose-300 block"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            But it doesn&apos;t have to stay that way.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-gray-400 text-sm leading-relaxed mt-4 mb-8 max-w-sm mx-auto">
          This confirmation link is invalid or has expired.
          Access to the circle is still open —
          request it again before spots fill up.
        </p>

        {/* CTA */}
        <Link
          href="/"
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
          Request Access Again →
        </Link>

        {/* Microcopy */}
        <p className="mt-6 text-xs text-gray-700">
          Discreet · Select members only · Free to join
        </p>

      </div>
    </main>
  );
}
