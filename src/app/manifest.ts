import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ToolVerse - AI Tools Directory',
    short_name: 'ToolVerse',
    description: 'Discover the best AI tools for your business and creative projects. 500+ curated AI software reviews and guides.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
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
    ],
    categories: ['productivity', 'business', 'technology', 'developer'],
    lang: 'en',
    dir: 'ltr',
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png'
      },
      {
        src: '/screenshot-mobile.png', 
        sizes: '375x667',
        type: 'image/png'
      }
    ],
    shortcuts: [
      {
        name: 'Browse AI Tools',
        short_name: 'Tools',
        description: 'Browse all AI tools in our directory',
        url: '/tools',
        icons: [{ src: '/shortcut-tools.png', sizes: '96x96' }]
      },
      {
        name: 'AI Categories',
        short_name: 'Categories',
        description: 'Explore AI tools by category',
        url: '/categories',
        icons: [{ src: '/shortcut-categories.png', sizes: '96x96' }]
      },
      {
        name: 'Submit Tool',
        short_name: 'Submit',
        description: 'Submit a new AI tool',
        url: '/submit',
        icons: [{ src: '/shortcut-submit.png', sizes: '96x96' }]
      }
    ]
  }
}
