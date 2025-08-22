'use client';

interface SchemaData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

interface EnhancedSchemaProps {
  schemas: SchemaData[];
}

export default function EnhancedSchema({ schemas }: EnhancedSchemaProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
    </>
  );
}

// 工具详情页面的完整Schema
export function generateToolSchema(tool: any) {
  const baseUrl = 'https://www.toolverse.tools';
  
  const schemas: SchemaData[] = [
    // SoftwareApplication Schema
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      url: tool.website,
      applicationCategory: 'AI Software',
      operatingSystem: 'Web Browser',
      ...(tool.logo && { image: `${baseUrl}/logos/${tool.logo}` }),
      ...(tool.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.rating,
          ratingCount: tool.reviewCount || 100,
          bestRating: 5,
          worstRating: 1
        }
      }),
      offers: {
        '@type': 'Offer',
        price: tool.pricingModel === 'free' ? '0' : tool.pricing || '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      publisher: {
        '@type': 'Organization',
        name: 'ToolVerse',
        url: baseUrl
      }
    },
    // Product Schema
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: tool.name,
      description: tool.description,
      category: tool.category,
      brand: {
        '@type': 'Brand',
        name: tool.developer || tool.name
      },
      ...(tool.logo && { image: `${baseUrl}/logos/${tool.logo}` }),
      ...(tool.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: tool.rating,
          ratingCount: tool.reviewCount || 100,
          bestRating: 5,
          worstRating: 1
        }
      }),
      offers: {
        '@type': 'Offer',
        price: tool.pricingModel === 'free' ? '0' : tool.pricing || '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: tool.developer || tool.name
        }
      }
    }
  ];

  // 如果有评论，添加评论Schema
  if (tool.reviews && tool.reviews.length > 0) {
    const reviewSchemas = tool.reviews.map((review: any) => ({
      '@context': 'https://schema.org',
      '@type': 'Review',
      reviewBody: review.content,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      author: {
        '@type': 'Person',
        name: review.userName
      },
      itemReviewed: {
        '@type': 'SoftwareApplication',
        name: tool.name
      }
    }));
    schemas.push(...reviewSchemas);
  }

  return schemas;
}

// 比较页面的Schema
export function generateComparisonSchema(tool1: any, tool2: any, comparisonData: any) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ComparisonArticle',
      headline: `${tool1.name} vs ${tool2.name}: Complete Comparison`,
      description: `Detailed comparison of ${tool1.name} and ${tool2.name}. Compare features, pricing, and capabilities.`,
      author: {
        '@type': 'Organization',
        name: 'ToolVerse'
      },
      publisher: {
        '@type': 'Organization',
        name: 'ToolVerse',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.toolverse.tools/favicon.png'
        }
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      about: [
        {
          '@type': 'SoftwareApplication',
          name: tool1.name,
          description: tool1.description
        },
        {
          '@type': 'SoftwareApplication',
          name: tool2.name,
          description: tool2.description
        }
      ]
    }
  ];
}

// 分类页面的Schema
export function generateCategorySchema(category: string, tools: any[]) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category} AI Tools`,
      description: `Discover the best ${category} AI tools. Compare features, pricing, and reviews.`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: tools.length,
        itemListElement: tools.slice(0, 10).map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: tool.name,
            description: tool.description,
            url: `https://www.toolverse.tools/tools/${tool.id}`
          }
        }))
      }
    }
  ];
}

// FAQ页面的Schema
export function generateFAQSchema(faqs: Array<{question: string; answer: string}>) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  ];
}
