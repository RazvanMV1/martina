// app/welcome/page.tsx
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[#111827] flex items-center justify-center px-6">
      <div className="text-center max-w-md">

        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-10 h-10 text-emerald-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>

        <p className="text-xs font-medium tracking-[0.25em] uppercase text-rose-300/80 mb-3">
          Access Confirmed
        </p>

        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to my secret world 🔥
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          Your email has been confirmed. Click the button below to join my private Telegram channel.
        </p>

        <a
          href="https://t.me/themartinavalenti"
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block
            px-8 py-4
            bg-rose-500 hover:bg-rose-400
            text-white font-bold text-sm tracking-wider uppercase
            rounded-xl
            transition-all duration-200
            shadow-lg shadow-rose-500/30
          "
        >
          Join Telegram Now →
        </a>

        <p className="mt-6 text-xs text-gray-600">
          Spam-free · 100% discreet · Unsubscribe anytime
        </p>
      </div>
    </main>
  );
}
