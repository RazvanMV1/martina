// app/page.tsx
import Image from 'next/image';
import SubscribeForm from '@/components/SubscribeForm';

export default function HomePage() {
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
          DESKTOP — stânga content, dreapta avatar
          ════════════════════════════════════════ */}
      <div className="relative z-20 w-full h-full hidden md:flex items-center">

        {/* STÂNGA — content */}
        <div className="flex flex-col justify-center items-start text-left px-16 lg:px-24 w-[58%]">

          {/* Eyebrow */}
          <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-3">
            Exclusive Circle · By Invitation Only
          </p>

          {/* Headline */}
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            Not everyone gets in.{' '}
            <span
              className="italic font-normal text-rose-300 block"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              You might be the exception.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm lg:text-base text-gray-400 font-light leading-relaxed mb-7 max-w-sm">
            A private circle. No filters. No performance.{' '}
            <strong className="text-white font-medium">Just the real me.</strong>
          </p>

          {/* Form */}
          <SubscribeForm />

        </div>

        {/* DREAPTA — avatar mare Martina */}
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

        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE — vertical, centrat
          ════════════════════════════════════════ */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center text-center px-6 py-8 md:hidden">

        {/* Avatar centrat sus */}
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

        {/* Online text */}
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-400 tracking-wide">
            <strong className="text-white font-medium">Martina Valenti</strong> · Online now
          </span>
        </div>

        {/* Eyebrow */}
        <p className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-rose-300/60 mb-2">
          Exclusive Circle · By Invitation Only
        </p>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-3">
          Not everyone gets in.{' '}
          <span
            className="italic font-normal text-rose-300 block"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            You might be the exception.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm text-gray-400 font-light leading-relaxed mb-5 max-w-xs">
          A private circle. No filters. No performance.{' '}
          <strong className="text-white font-medium">Just the real me.</strong>
        </p>

        {/* Form */}
        <div className="w-full max-w-sm">
          <SubscribeForm />
        </div>

      </div>

    </main>
  );
}
