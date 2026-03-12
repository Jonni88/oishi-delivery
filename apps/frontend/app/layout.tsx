import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Oishi — доставка суши',
  description: 'Суши и роллы Oishi',
  icons: {
    icon: '/logo/oishi-logo.jpg',
    apple: '/logo/oishi-logo.jpg'
  }
};

const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
