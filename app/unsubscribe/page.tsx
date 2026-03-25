// app/unsubscribe/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import UnsubscribeForm from '@/components/UnsubscribeForm';
import { createClient } from '@supabase/supabase-js';
import { verifyUnsubscribeToken } from '@/lib/email';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = '' } = await searchParams;

  // Verifică și decodează tokenul
  const email = token ? verifyUnsubscribeToken(token) : null;
  const normalized = email?.toLowerCase().trim() ?? '';

  // Verifică dacă emailul există în Supabase
  let emailExists = false;
  if (normalized) {
    const { data } = await supabase
      .from('email_subscribers')
      .select('id')
      .eq('email', normalized)
      .maybeSingle();
    emailExists = !!data;
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center px-6">

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
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)',
          }}
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">

        {/* Avatar cu badge condiționat */}
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
          <div className="relative w-20 h-20 rounded-full ring-1 ring-rose-500/20 overflow-hidden shadow-2xl mx-auto">
            <Image
              src="/avatar.webp"
              alt="Martina Valenti"
              fill
              quality={85}
              className="object-cover object-top"
              sizes="80px"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{ background: 'linear-gradient(to top, #000000 0%, transparent 100%)' }}
              aria-hidden="true"
            />
          </div>

          {/* Badge pe avatar — condiționat per stare */}
          {!token || !normalized ? (
            // Invalid — badge gri cu X
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3 text-gray-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          ) : !emailExists ? (
            // Already done — badge emerald cu check
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-900 border-2 border-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3 text-emerald-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </span>
          ) : (
            // Leaving — badge gri cu email icon
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3 text-gray-400" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
          )}
        </div>

        {/* Conținut condiționat — fără iconuri mari */}
        {!token || !normalized ? (

          // — Token lipsă sau invalid —
          <>
            <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-3">
              Email Preferences
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-2">
              Invalid link.{' '}
              <span
                className="italic font-normal text-rose-300 block"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                No access found.
              </span>
            </h1>
            <p className="text-sm text-gray-400 font-light leading-relaxed mt-3 mb-7 max-w-sm mx-auto">
              Please use the unsubscribe link from your email.
              If you need help, contact us directly.
            </p>
          </>

        ) : !emailExists ? (

          // — Token valid dar emailul nu mai există în baza de date —
          <>
            <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-3">
              Email Preferences
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-2">
              Already done.{' '}
              <span
                className="italic font-normal text-rose-300 block"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                You&apos;re not on the list.
              </span>
            </h1>
            <p className="text-sm text-gray-400 font-light leading-relaxed mt-3 mb-7 max-w-sm mx-auto">
              <strong className="text-white font-medium">{normalized}</strong>{' '}
              is not subscribed.
              You won&apos;t receive any emails from us.
            </p>
          </>

        ) : (

          // — Token valid și emailul există — afișează butonul —
          <>
            <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-3">
              Email Preferences
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white leading-tight mb-2">
              Leaving already?{' '}
              <span
                className="italic font-normal text-rose-300 block"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                No hard feelings.
              </span>
            </h1>
            <p className="text-sm text-gray-400 font-light leading-relaxed mt-3 mb-7 max-w-sm mx-auto">
              Click the button below to unsubscribe{' '}
              <strong className="text-white font-medium">{normalized}</strong>{' '}
              from all emails. You can always come back.
            </p>
            <UnsubscribeForm token={token} />
          </>

        )}

        {/* Back link */}
        <div className="mt-7">
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
