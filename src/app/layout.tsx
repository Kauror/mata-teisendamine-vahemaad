import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Harjutamine',
  description: 'Kiuri ja Kirsi harjutuste äpp'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  );
}
