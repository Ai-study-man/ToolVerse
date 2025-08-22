'use client';

import { ReactNode } from 'react';
import SEOMonitor from './SEOMonitor';
import PerformanceMonitor from './PerformanceMonitor';

interface GlobalLayoutProps {
  children: ReactNode;
  showMonitoring?: boolean;
  title?: string;
  description?: string;
}

export default function GlobalLayout({ 
  children, 
  showMonitoring = true, 
  title,
  description 
}: GlobalLayoutProps) {
  return (
    <>
      {/* Main Content */}
      {children}

      {/* Development/Monitoring Tools */}
      {showMonitoring && process.env.NODE_ENV === 'development' && (
        <>
          {/* <SEOMonitor /> */}
          <PerformanceMonitor />
        </>
      )}

      {/* Global JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'AI Tools Directory',
            description: 'Discover and compare the best AI tools for your needs',
            url: process.env.NEXT_PUBLIC_SITE_URL,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            },
            publisher: {
              '@type': 'Organization',
              name: 'AI Tools Directory',
              url: process.env.NEXT_PUBLIC_SITE_URL
            }
          })
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'AI Tools Directory',
            url: process.env.NEXT_PUBLIC_SITE_URL,
            description: 'Your comprehensive guide to AI tools and technologies',
            sameAs: [
              // 添加社交媒体链接
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: ['English', 'Chinese']
            }
          })
        }}
      />
    </>
  );
}
