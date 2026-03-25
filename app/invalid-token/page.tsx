// app/invalid-token/page.tsx
import Link from 'next/link';

export default function InvalidTokenPage() {
  return (
    <main className="min-h-screen bg-[#111827] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-10 h-10 text-red-400"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Invalid or expired link
        </h1>

        <p className="text-gray-400 mb-8 leading-relaxed">
          This confirmation link is invalid or has already been used. Please sign up again.
        </p>

        <Link
          href="/"
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
          Back to Home →
        </Link>
      </div>
    </main>
  );
}
