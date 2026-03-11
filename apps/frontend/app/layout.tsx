import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oishi — доставка суши',
  description: 'Суши и роллы Oishi'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
