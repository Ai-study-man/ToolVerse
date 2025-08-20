'use client';

interface StructuredDataProps {
  type: 'website' | 'tool' | 'organization' | 'breadcrumb' | 'faq' | 'article' | 'product';
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
          description: 'Discover and use the best AI tools! ToolVerse provides 500+ detailed AI tool reviews and guides.',
          url: 'https://www.toolsverse.tools',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://www.toolsverse.tools/tools?search={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
          publisher: {
            '@type': 'Organization',
            name: 'ToolVerse',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.toolsverse.tools/logo.png',
              width: 200,
              height: 60,
            },
            sameAs: [
              'https://twitter.com/toolverse',
              'https://github.com/toolverse',
              'https://linkedin.com/company/toolverse',
            ],
          },
          mainEntity: {
            '@type': 'ItemList',
            name: 'AI Tools Directory',
            description: 'Comprehensive list of AI tools and applications',
            numberOfItems: '500+',
            itemListElement: data.tools?.slice(0, 10).map((tool: any, index: number) => ({
              '@type': 'SoftwareApplication',
              position: index + 1,
              name: tool.name,
              description: tool.description,
              url: `https://www.toolsverse.tools/tools/${tool.id}`,
              applicationCategory: tool.category,
            })) || []
          }
        };

      case 'tool':
      case 'product':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: data.name,
          description: data.description,
          applicationCategory: data.category,
          operatingSystem: 'Web Browser',
          url: data.website,
          screenshot: data.logo,
          downloadUrl: data.website,
          featureList: data.features?.join(', '),
          author: {
            '@type': 'Organization',
            name: 'ToolVerse',
            url: 'https://www.toolsverse.tools',
          },
          publisher: {
            '@type': 'Organization',
            name: 'ToolVerse',
            url: 'https://www.toolsverse.tools',
          },
          offers: {
            '@type': 'Offer',
            price: data.pricingModel === 'free' ? '0' : (data.pricing?.replace(/[^\d.]/g, '') || '0'),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            category: data.category,
            eligibleRegion: 'Worldwide',
            paymentAccepted: ['Credit Card', 'PayPal', 'Cryptocurrency'],
          },
          aggregateRating: data.rating && data.reviewCount ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount,
            bestRating: 5,
            worstRating: 1,
          } : undefined,
          review: data.reviews?.slice(0, 5).map((review: any) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: review.author || 'Anonymous User',
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review.rating,
              bestRating: 5,
            },
            reviewBody: review.content,
            datePublished: review.createdAt,
          })) || [],
          keywords: data.tags?.join(', '),
          datePublished: data.createdAt,
          dateModified: data.updatedAt || data.createdAt,
          inLanguage: 'en',
          isAccessibleForFree: data.pricingModel === 'free' || data.pricingModel === 'freemium',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${data.name} Pricing Plans`,
            itemListElement: [
              {
                '@type': 'Offer',
                name: data.pricingModel === 'free' ? 'Free Plan' : data.pricingModel === 'freemium' ? 'Free Trial' : 'Premium Plan',
                price: data.pricingModel === 'free' ? '0' : (data.pricing?.replace(/[^\d.]/g, '') || '0'),
                priceCurrency: 'USD',
              }
            ]
          }
        };

      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'ToolVerse',
          description: 'Professional AI tools discovery and review platform',
          url: 'https://www.toolsverse.tools',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.toolsverse.tools/logo.png',
            width: 200,
            height: 60,
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-555-AI-TOOLS',
            contactType: 'customer service',
            email: 'contact@toolsverse.tools',
            availableLanguage: ['English', 'Chinese'],
          },
          sameAs: [
            'https://twitter.com/toolverse',
            'https://github.com/toolverse',
            'https://linkedin.com/company/toolverse',
          ],
          foundingDate: '2024',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US',
            addressLocality: 'San Francisco',
            addressRegion: 'CA',
          },
          slogan: 'Discover the Best AI Tools',
          knowsAbout: [
            'Artificial Intelligence',
            'Machine Learning',
            'AI Tools',
            'Software Reviews',
            'Technology',
          ],
        };

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          image: data.image || 'https://www.toolsverse.tools/og-image.png',
          datePublished: data.publishedAt,
          dateModified: data.modifiedAt || data.publishedAt,
          author: {
            '@type': 'Organization',
            name: 'ToolVerse',
            url: 'https://www.toolsverse.tools',
          },
          publisher: {
            '@type': 'Organization',
            name: 'ToolVerse',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.toolsverse.tools/logo.png',
              width: 200,
              height: 60,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url,
          },
          articleSection: data.category,
          keywords: data.keywords,
          wordCount: data.wordCount,
          articleBody: data.content,
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
