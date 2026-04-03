// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Martina Valenti',
  description:
    'Hey, I\'m Martina. Here\'s where you can find me.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Martina Valenti',
    description: 'Hey, I\'m Martina. Here\'s where you can find me.',
    type: 'website',
    url: 'https://martinavalenti.com',
    images: [
      {
        url: 'https://martinavalenti.com/avatar.webp',
        width: 600,
        height: 600,
        alt: 'Martina Valenti',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Martina Valenti',
    description: 'Hey, I\'m Martina. Here\'s where you can find me.',
    images: ['https://martinavalenti.com/avatar.webp'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-black antialiased font-sans">

        <Script
          defer
          src="https://stats.martinavalenti.com/script.js"
          data-website-id="eb889186-34be-48cd-96e7-79b43a97c72e"
          strategy="afterInteractive"
        />

        {children}

      </body>
    </html>
  );
}
