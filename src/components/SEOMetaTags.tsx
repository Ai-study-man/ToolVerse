'use client';

import { useEffect } from 'react';
import Head from 'next/head';

interface SEOMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: any;
  noIndex?: boolean;
}

// 动态SEO Meta标签组件
export default function SEOMetaTags({
  title,
  description,
  keywords,
  ogImage = '/og-image.png',
  canonicalUrl,
  structuredData,
  noIndex = false
}: SEOMetaTagsProps) {
  
  useEffect(() => {
    // 避免与Next.js的metadata API冲突，只在客户端动态更新特定标签
    
    // 更新页面标题
    if (title && typeof document !== 'undefined') {
      document.title = title.includes('ToolVerse') ? title : `${title} | ToolVerse - AI Tools Directory`;
    }

    // 动态更新meta描述
    if (description && typeof document !== 'undefined') {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // 动态更新keywords
    if (keywords && typeof document !== 'undefined') {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // 动态更新OG标签
    if (typeof document !== 'undefined') {
      // OG Title
      if (title) {
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
          ogTitle = document.createElement('meta');
          ogTitle.setAttribute('property', 'og:title');
          document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', title);
      }

      // OG Description
      if (description) {
        let ogDesc = document.querySelector('meta[property="og:description"]');
        if (!ogDesc) {
          ogDesc = document.createElement('meta');
          ogDesc.setAttribute('property', 'og:description');
          document.head.appendChild(ogDesc);
        }
        ogDesc.setAttribute('content', description);
      }

      // OG Image
      let ogImageTag = document.querySelector('meta[property="og:image"]');
      if (!ogImageTag) {
        ogImageTag = document.createElement('meta');
        ogImageTag.setAttribute('property', 'og:image');
        document.head.appendChild(ogImageTag);
      }
      ogImageTag.setAttribute('content', `https://www.toolsverse.tools${ogImage}`);

      // OG URL
      if (canonicalUrl) {
        let ogUrl = document.querySelector('meta[property="og:url"]');
        if (!ogUrl) {
          ogUrl = document.createElement('meta');
          ogUrl.setAttribute('property', 'og:url');
          document.head.appendChild(ogUrl);
        }
        ogUrl.setAttribute('content', canonicalUrl);
      }
    }

    // 动态更新Twitter Card
    if (typeof document !== 'undefined') {
      // Twitter Title
      if (title) {
        let twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (!twitterTitle) {
          twitterTitle = document.createElement('meta');
          twitterTitle.setAttribute('name', 'twitter:title');
          document.head.appendChild(twitterTitle);
        }
        twitterTitle.setAttribute('content', title);
      }

      // Twitter Description
      if (description) {
        let twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (!twitterDesc) {
          twitterDesc = document.createElement('meta');
          twitterDesc.setAttribute('name', 'twitter:description');
          document.head.appendChild(twitterDesc);
        }
        twitterDesc.setAttribute('content', description);
      }

      // Twitter Image
      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
      }
      twitterImage.setAttribute('content', `https://www.toolsverse.tools${ogImage}`);
    }

    // 动态更新canonical链接
    if (canonicalUrl && typeof document !== 'undefined') {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }

    // 动态添加结构化数据
    if (structuredData && typeof document !== 'undefined') {
      // 移除现有的结构化数据（如果有）
      const existingLD = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
      if (existingLD) {
        existingLD.remove();
      }

      // 添加新的结构化数据
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // 处理noIndex
    if (typeof document !== 'undefined') {
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      
      if (noIndex) {
        robotsTag.setAttribute('content', 'noindex, nofollow');
      } else {
        robotsTag.setAttribute('content', 'index, follow');
      }
    }

  }, [title, description, keywords, ogImage, canonicalUrl, structuredData, noIndex]);

  // 这个组件不渲染任何内容，只负责更新head标签
  return null;
}

// 为工具页面生成SEO数据的辅助函数
export function generateToolSEO(tool: any) {
  const toolName = tool?.name || 'AI Tool';
  const toolDesc = tool?.description || 'Discover this powerful AI tool for your needs.';
  const toolCategory = tool?.category || 'AI Tool';
  const toolPricing = tool?.pricing || 'See pricing';
  
  return {
    title: `${toolName} Review - ${toolCategory} | Features, Pricing & Alternatives`,
    description: `${toolDesc.substring(0, 140)}... Discover ${toolName}'s features, pricing (${toolPricing}), user reviews, and best alternatives. Complete ${toolCategory.toLowerCase()} tool analysis.`,
    keywords: `${toolName}, ${toolCategory}, AI tool, ${toolName} review, ${toolName} pricing, ${toolName} alternative, AI software, artificial intelligence`,
    canonicalUrl: `https://www.toolsverse.tools/tools/${tool?.id || ''}`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: toolName,
      description: toolDesc,
      applicationCategory: toolCategory,
      operatingSystem: 'Web Browser',
      url: tool?.website || `https://www.toolsverse.tools/tools/${tool?.id || ''}`,
      offers: {
        '@type': 'Offer',
        price: tool?.pricing?.includes('Free') ? '0' : 'Contact for pricing',
        priceCurrency: 'USD'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        ratingCount: '100',
        bestRating: '5',
        worstRating: '1'
      },
      review: {
        '@type': 'Review',
        author: {
          '@type': 'Organization',
          name: 'ToolVerse'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '4.5',
          bestRating: '5'
        }
      }
    }
  };
}

// 为工具列表页面生成SEO数据
export function generateToolsListSEO(searchQuery?: string, category?: string) {
  let title = 'AI Tools Directory - Discover 500+ Best AI Software & Solutions';
  let description = 'Browse 500+ AI tools and software solutions. Find the best artificial intelligence tools for your business, creative projects, and productivity needs. Updated daily with reviews and ratings.';
  
  if (searchQuery) {
    title = `"${searchQuery}" AI Tools - Search Results | ToolVerse Directory`;
    description = `Find AI tools related to "${searchQuery}". Discover the best artificial intelligence software and solutions for your specific needs. Compare features, pricing, and user reviews.`;
  }
  
  if (category) {
    title = `Best ${category} AI Tools - Complete Directory & Reviews | ToolVerse`;
    description = `Discover the best ${category} AI tools and software. Compare features, pricing, and user reviews of top artificial intelligence solutions in the ${category.toLowerCase()} category.`;
  }
  
  return {
    title,
    description,
    keywords: `AI tools, artificial intelligence, ${searchQuery || category || 'AI software'}, AI directory, AI tool reviews, best AI tools 2025, AI applications, machine learning tools`,
    canonicalUrl: `https://www.toolsverse.tools/tools${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}${category ? `?category=${encodeURIComponent(category)}` : ''}`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: description,
      url: `https://www.toolsverse.tools/tools`,
      mainEntity: {
        '@type': 'ItemList',
        name: 'AI Tools Directory',
        description: 'Comprehensive directory of AI tools and software'
      }
    }
  };
}

// 为首页生成SEO数据
export function generateHomeSEO() {
  return {
    title: 'ToolVerse - Discover Best AI Tools | AI Directory & Reviews 2025',
    description: 'Discover 500+ best AI tools for business, creativity, and productivity. Compare ChatGPT, Midjourney, GitHub Copilot alternatives. Find free and paid AI solutions with expert reviews.',
    keywords: 'AI tools, best AI tools 2025, artificial intelligence, ChatGPT, Midjourney, AI directory, AI software reviews, free AI tools, AI productivity tools, business AI solutions',
    canonicalUrl: 'https://www.toolsverse.tools/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ToolVerse',
      description: 'The ultimate directory for discovering and comparing AI tools',
      url: 'https://www.toolsverse.tools/',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.toolsverse.tools/tools?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      },
      mainEntity: {
        '@type': 'Organization',
        name: 'ToolVerse',
        description: 'Professional AI tools discovery and review platform',
        url: 'https://www.toolsverse.tools/',
        logo: 'https://www.toolsverse.tools/logo.png'
      }
    }
  };
}