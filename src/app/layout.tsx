import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import { OfflineProvider } from '@/app/components/offline/OfflineProvider';
import { OfflineStatusBar, UpdateAvailableNotice } from '@/app/components/offline/OfflineStatusBar';

// Self-hosted by next/font: the files land under _next/static and therefore in
// the service worker's precache, so headings keep their face offline. A
// fonts.googleapis.com <link> would break exactly that.
const nunito = Nunito({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'harjutaja',
  description: 'Kiuri ja Kirsi harjutuste äpp',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'harjutaja'
  }
};

export const viewport: Viewport = {
  themeColor: '#1E9BF0'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="et" className={nunito.variable}>
      <body>
        <OfflineProvider>
          <UpdateAvailableNotice />
          {children}
          <OfflineStatusBar />
        </OfflineProvider>
      </body>
    </html>
  );
}
