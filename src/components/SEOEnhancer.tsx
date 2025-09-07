'use client';

import Head from 'next/head';

interface SEOEnhancerProps {
  tool?: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    website: string;
    pricing?: string;
    rating: number;
    reviewCount: number;
  };
  page?: 'home' | 'tools' | 'categories';
}

export default function SEOEnhancer({ tool, page = 'home' }: SEOEnhancerProps) {
  // 生成结构化数据
  const generateStructuredData = () => {
    if (tool) {
      // 工具页面的结构化数据
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        applicationCategory: tool.category,
        operatingSystem: 'Web',
        url: tool.website,
        offers: {
          '@type': 'Offer',
          price: tool.pricing === 'Contact for pricing' ? '0' : tool.pricing?.replace(/[^\d.]/g, '') || '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.rating,
          reviewCount: tool.reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
        keywords: tool.tags.join(', '),
        creator: {
          '@type': 'Organization',
          name: 'ToolVerse',
          url: 'https://toolverse.com',
        },
      };
    }

    // 首页的结构化数据
    if (page === 'home') {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ToolVerse',
        description: 'ToolVerse - 发现最佳AI工具 | AI工具目录和评测平台',
        url: 'https://toolverse.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://toolverse.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@type': 'Organization',
          name: 'ToolVerse',
          logo: {
            '@type': 'ImageObject',
            url: 'https://toolverse.com/logo.png',
          },
        },
      };
    }

    return null;
  };

  const structuredData = generateStructuredData();

  return (
    <Head>
      {/* 结构化数据 */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* 预加载关键资源 */}
      <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
      
      {/* DNS预获取 */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      
      {/* 预连接到关键的第三方域名 */}
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      
      {/* 移动端优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Apple相关元标签 */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="ToolVerse" />
      
      {/* Microsoft相关元标签 */}
      <meta name="msapplication-TileColor" content="#2563eb" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* 其他SEO增强标签 */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="handheldFriendly" content="true" />
      <meta name="mobile-web-app-capable" content="yes" />
    </Head>
  );
}
