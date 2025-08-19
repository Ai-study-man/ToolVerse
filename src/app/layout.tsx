import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'ToolVerse - Discover Best AI Tools | AI Tools Directory & Reviews',
    template: '%s | ToolVerse - AI Tools Directory'
  },
  description: 'Discover and use the best AI tools! ToolVerse provides 500+ detailed AI tool reviews and guides. Find ChatGPT, Midjourney, GitHub Copilot alternatives and more AI solutions for your business and creative projects.',
  keywords: 'AI tools, artificial intelligence tools, ChatGPT, Midjourney, AI art generator, AI writing tools, AI coding assistant, best AI tools 2024, free AI tools, AI productivity tools, machine learning tools, AI software directory, AI platforms, AI applications, conversational AI, text to image AI, AI chatbots, AI image generation, AI code completion, natural language processing, computer vision AI, AI automation tools',
  authors: [{ name: 'ToolVerse Team' }],
  creator: 'ToolVerse',
  publisher: 'ToolVerse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://toolverse.com',
    title: 'ToolVerse - Discover Best AI Tools | AI Tools Directory & Reviews',
    description: 'Discover and use the best AI tools! Find 500+ AI tool reviews, comparisons, and guides for business and creative projects.',
    siteName: 'ToolVerse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolVerse - AI Tools Directory Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolVerse - Discover Best AI Tools',
    description: 'Find the best AI tools for your needs. 500+ reviews, comparisons, and guides.',
    creator: '@toolverse',
    images: ['/og-image.png'],
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
  alternates: {
    canonical: 'https://toolverse.com',
    languages: {
      'en': 'https://toolverse.com',
      'zh': 'https://toolverse.com/zh',
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: '3dqJHfaHU8v1sPuS8FsnELHoY0IOGAexZlMKc7xC93Q',
  },
  other: {
    'google-analytics': 'G-68YE02ND1P',
    'google-adsense-account': 'ca-pub-4372695356377122',
    'msvalidate.01': 'your-bing-verification-code',
    'yandex-verification': 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-68YE02ND1P"
          strategy="afterInteractive"
          async
        />
        
        {/* Ahrefs Analytics */}
        <Script
          id="ahrefs-analytics"
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Y3EhGUnu3K8A0krIGV1Rdg"
          strategy="afterInteractive"
          async
        />

        {/* JSON-LD for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'ToolVerse',
              description: 'Discover the best AI tools for your business and creative projects',
              url: 'https://toolverse.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://toolverse.com/tools?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'ToolVerse',
                logo: 'https://toolverse.com/logo.png',
                sameAs: [
                  'https://twitter.com/toolverse',
                  'https://github.com/toolverse',
                  'https://linkedin.com/company/toolverse'
                ]
              }
            })
          }}
        />

        {/* JSON-LD for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'ToolVerse',
              description: 'Professional AI tools discovery and review platform',
              url: 'https://toolverse.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://toolverse.com/logo.png',
                width: 200,
                height: 60
              },
              foundingDate: '2024',
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'contact@toolverse.com',
                availableLanguage: ['English', 'Chinese']
              },
              sameAs: [
                'https://twitter.com/toolverse',
                'https://github.com/toolverse',
                'https://linkedin.com/company/toolverse'
              ],
              knowsAbout: [
                'Artificial Intelligence',
                'Machine Learning',
                'AI Tools',
                'Software Reviews',
                'Technology'
              ]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-68YE02ND1P');
          `}
        </Script>
        
        <Script
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4372695356377122"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
