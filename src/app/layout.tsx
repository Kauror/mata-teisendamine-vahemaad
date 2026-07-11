import './globals.css';
import type { Metadata, Viewport } from 'next';
import { OfflineProvider } from '@/app/components/offline/OfflineProvider';
import { OfflineStatusBar, UpdateAvailableNotice } from '@/app/components/offline/OfflineStatusBar';

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
    <html lang="et">
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
