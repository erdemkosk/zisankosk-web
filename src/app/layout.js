import { Providers } from './providers';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Diyetisyen Zişan Köşk - Beslenme ve Diyet Danışmanlığı',
  description: 'Uzman diyetisyen Zişan Köşk ile kişiye özel beslenme programları, online diyet danışmanlığı ve sağlıklı yaşam rehberliği. İstanbul&apos;da profesyonel diyet hizmetleri.',
  keywords: 'diyetisyen, beslenme danışmanı, online diyet, kilo verme, sağlıklı beslenme, İstanbul diyetisyen, Zişan Köşk',
  authors: [{ name: 'Zişan Köşk' }],
  creator: 'Zişan Köşk',
  publisher: 'Zişan Köşk',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Diyetisyen Zişan Köşk - Beslenme ve Diyet Danışmanlığı',
    description: 'Uzman diyetisyen Zişan Köşk ile kişiye özel beslenme programları ve sağlıklı yaşam rehberliği.',
    url: 'https://www.zisankosk.com',
    siteName: 'Diyetisyen Zişan Köşk',
    images: [
      {
        url: '/images/zisankosk.png',
        width: 1200,
        height: 630,
        alt: 'Diyetisyen Zişan Köşk',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diyetisyen Zişan Köşk - Beslenme ve Diyet Danışmanlığı',
    description: 'Uzman diyetisyen Zişan Köşk ile kişiye özel beslenme programları ve sağlıklı yaşam rehberliği.',
    images: ['/images/zisankosk.png'],
    creator: '@zisankosk',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Google doğrulama kodunuz',
    yandex: 'Yandex doğrulama kodunuz',
  },
  alternates: {
    canonical: 'https://www.zisankosk.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={inter.className} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://www.zisankosk.com" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
