import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Harjutamine',
  description: 'Kiuri ja Kirsi harjutuste äpp',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Harjutamine'
  }
};

export const viewport: Viewport = {
  themeColor: '#1E9BF0'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et">
      <body>{children}</body>
    </html>
  );
}
