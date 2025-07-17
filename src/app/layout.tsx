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
  other: {
    'google-analytics': 'G-TTK01C8NN5',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-TTK01C8NN5"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TTK01C8NN5');
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
