'use client';

interface StructuredDataProps {
  type: 'website' | 'tool' | 'organization' | 'breadcrumb' | 'faq';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const generateSchema = () => {
    switch (type) {
      case 'website':
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
              width: 200,
              height: 60,
            },
            sameAs: [
              'https://twitter.com/toolverse',
              'https://github.com/toolverse',
            ],
          },
        };

      case 'tool':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: data.name,
          description: data.description,
          applicationCategory: data.category,
          operatingSystem: 'Web Browser',
          url: data.website,
          screenshot: data.logo,
          author: {
            '@type': 'Organization',
            name: 'ToolVerse',
            url: 'https://toolverse.com',
          },
          offers: {
            '@type': 'Offer',
            price: data.pricing === 'Contact for pricing' ? '0' : (data.pricing?.replace(/[^\d.]/g, '') || '0'),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          },
          aggregateRating: data.rating && data.reviewCount ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount,
            bestRating: 5,
            worstRating: 1,
          } : undefined,
          keywords: data.tags?.join(', '),
          datePublished: data.createdAt,
          dateModified: data.updatedAt || data.createdAt,
          inLanguage: 'zh-CN',
        };

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ToolVerse',
          description: '专业的AI工具发现和评测平台',
          url: 'https://toolverse.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://toolverse.com/logo.png',
            width: 200,
            height: 60,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+86-400-000-0000',
            contactType: 'customer service',
            availableLanguage: ['Chinese', 'English'],
          },
          sameAs: [
            'https://twitter.com/toolverse',
            'https://github.com/toolverse',
          ],
          foundingDate: '2024',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'CN',
            addressLocality: '北京',
          },
        };

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };

      case 'faq':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
