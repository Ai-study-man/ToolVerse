import { Tool } from '../types';

export function generateToolJsonLd(tool: Tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: tool.pricingModel === 'free' ? '0' : tool.pricing,
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
    url: tool.website,
    image: tool.logo,
    dateCreated: tool.createdAt,
    keywords: tool.tags.join(', '),
    featureList: tool.features,
  };
}
