import { MetadataRoute } from 'next'
import { siteConfig } from './lib/metadata'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'IEEE PESCE Student Branch',
    short_name: 'IEEE PESCE',
    description: 'IEEE PESCE Student Branch is a community of students dedicated to promoting technological innovation and excellence.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00629B',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  }
} 