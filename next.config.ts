import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  generateBuildId: async () => process.env.OFFLINE_BUILD_ID || null,
  async headers() {
    return [
      {
        // The service worker must never be served stale, so a new build is
        // always detected. Registration also uses updateViaCache: 'none'.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' }
        ]
      }
    ];
  }
};

export default nextConfig;
