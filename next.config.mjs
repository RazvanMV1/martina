// next.config.mjs
// Notă: fișierul folosește sintaxa ESM (.mjs) — obligatoriu cu App Router modern.

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITIC pentru Docker: generează un server Node.js standalone,
  // fără a necesita întregul node_modules în container.
  output: 'standalone',

  // Optimizare imagini
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 zile cache
  },

  // Elimină console.log în producție
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimizare CSS — elimină render blocking
  experimental: {
    optimizeCss: true,
  },

  // Headers de securitate
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Cache agresiv pentru assets statice
      {
        source: '/(.*)\\.(webp|jpg|jpeg|png|svg|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
