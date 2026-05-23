import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pikkuste harjutaja',
  description: 'Lõbus pikkusühikute harjutamise mäng'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  );
}
