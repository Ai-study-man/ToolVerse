import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'ToolVerse - Discover the Best AI Tools',
    template: '%s | ToolVerse'
  },
  description: 'Find and discover the best AI tools for your business, creative projects, and productivity needs. Curated collection of ChatGPT, Midjourney, GitHub Copilot and more.',
  keywords: ['AI tools', 'artificial intelligence', 'ChatGPT', 'Midjourney', 'AI software', 'productivity tools', 'AI directory'],
  authors: [{ name: 'ToolVerse Team' }],
  creator: 'ToolVerse',
  publisher: 'ToolVerse',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolverse.com',
    title: 'ToolVerse - Discover the Best AI Tools',
    description: 'Find and discover the best AI tools for your business, creative projects, and productivity needs.',
    siteName: 'ToolVerse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolVerse - Discover the Best AI Tools',
    description: 'Find and discover the best AI tools for your business, creative projects, and productivity needs.',
    creator: '@toolverse',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  other: {
    'google-analytics': 'G-TTK01C8NN5',
    'google-adsense-account': 'ca-pub-4372695356377122',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Google AdSense - 直接嵌入确保爬虫可以检测 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4372695356377122"
          crossOrigin="anonymous"
        ></script>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-TTK01C8NN5"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TTK01C8NN5');
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
