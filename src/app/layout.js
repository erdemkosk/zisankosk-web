import { Providers } from './providers';
import './globals.css';

export const metadata = {
  title: 'Zişan Köşk - Diyetisyen',
  description: 'Sağlıklı yaşam için profesyonel diyetisyenlik hizmetleri',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
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
