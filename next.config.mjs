// next.config.mjs
// Notă: fișierul folosește sintaxa ESM (.mjs) — obligatoriu cu App Router modern.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITIC pentru Docker: generează un server Node.js standalone,
  // fără a necesita întregul node_modules în container.
  // Reduce dimensiunea imaginii finale de la ~1GB la ~150MB.
  output: 'standalone',

  // Optimizare imagini: definim domeniile externe dacă Hero Image
  // va fi servit de un CDN extern (ex: Cloudinary, Supabase Storage).
  // Dacă imaginea este locală (în /public), această secțiune nu este necesară.
  images: {
    // Exemplu pentru un CDN extern — decomentează dacă este cazul:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'your-cdn-domain.com',
    //   },
    // ],

    // Forțăm formatul AVIF + WebP pentru compresie maximă.
    // Next.js le servește automat browserelor compatibile.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85],
  },

  // Headers de securitate la nivel de framework (completate ulterior la nivel de reverse proxy).
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
