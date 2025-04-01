import { Providers } from './providers';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Diyetisyen Zişan Köşk',
  description: 'Sağlıklı beslenme ve yaşam tarzı danışmanlığı',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={inter.className} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
