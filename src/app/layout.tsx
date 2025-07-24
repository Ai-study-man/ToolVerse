import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'ToolVerse - 发现最佳AI工具 | AI工具目录和评测平台',
    template: '%s | ToolVerse - AI工具目录'
  },
  description: '发现和使用最好的AI工具！ToolVerse提供500+AI工具详细评测、使用指南。包括ChatGPT、Midjourney、GitHub Copilot等热门AI工具，找到适合您业务和创意项目的AI解决方案。',
  keywords: 'AI工具,人工智能工具,ChatGPT,Midjourney,AI绘画,AI写作,AI编程,AI工具大全,AI工具目录,AI工具评测',
  authors: [{ name: 'ToolVerse团队' }],
  creator: 'ToolVerse',
  publisher: 'ToolVerse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://toolverse.com',
    title: 'ToolVerse - 发现最佳AI工具 | AI工具目录和评测平台',
    description: '发现和使用最好的AI工具！提供500+AI工具详细评测、使用指南。',
    siteName: 'ToolVerse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ToolVerse - AI工具目录平台',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolVerse - 发现最佳AI工具',
    description: '发现和使用最好的AI工具！提供500+AI工具详细评测、使用指南。',
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
    <html lang="zh-CN" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TTK01C8NN5');
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
