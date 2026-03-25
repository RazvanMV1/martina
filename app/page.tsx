// app/page.tsx
import Image from 'next/image';
import SubscribeForm from '@/components/SubscribeForm';

export default function HomePage() {
  return (
    <main className="relative h-screen w-full flex items-center overflow-hidden bg-black">

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
            right: '38%',
            width: '1px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(244,63,94,0.08) 30%, rgba(244,63,94,0.12) 50%, rgba(244,63,94,0.08) 70%, transparent 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-20 flex flex-col justify-center
        items-center text-center md:items-start md:text-left
        px-6 md:px-16 lg:px-24
        w-full max-w-lg mx-auto md:mx-0">

        {/* AVATAR */}
        <div className="mb-5 relative">
          <div className="w-20 h-20 rounded-full ring-2 ring-rose-500/30 overflow-hidden shadow-2xl shadow-rose-900/20">
            <Image
              src="/avatar.jpg"
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
            role="img"
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

        {/* FORM — client component */}
        <SubscribeForm />

        {/* SOCIAL PROOF */}
        <div className="mt-6 flex items-center gap-2.5 opacity-50">
          <div className="flex -space-x-2" aria-hidden="true">
            {['bg-rose-400/50', 'bg-purple-400/50', 'bg-pink-400/50', 'bg-indigo-400/50'].map((color, i) => (
              <div key={i} className={`w-6 h-6 rounded-full ${color} ring-2 ring-black`} />
            ))}
          </div>
          <p className="text-xs text-gray-500">
            <span className="text-white font-semibold">2,400+</span> members already inside
          </p>
        </div>

      </div>

      {/* ── DECORATIVE dreapta desktop ── */}
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
