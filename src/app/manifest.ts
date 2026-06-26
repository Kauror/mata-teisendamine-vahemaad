import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Harjutamine',
    short_name: 'Harjutamine',
    description: 'Kiuri ja Kirsi harjutuste äpp',
    start_url: '/',
    display: 'standalone',
    background_color: '#1E9BF0',
    theme_color: '#1E9BF0',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
