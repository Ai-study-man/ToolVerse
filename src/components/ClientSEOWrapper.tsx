'use client';

import { useMemo } from 'react';
import SEOMetaTags, { generateToolSEO } from './SEOMetaTags';
import SEOOptimizations from './SEOOptimizations';

interface ClientSEOWrapperProps {
  toolData: {
    id: string;
    name: string;
    description: string;
    category: string | null;
    pricing: string | null;
    tags: string[] | null;
    features: string[] | null;
    website: string | null;
    logo: string | null;
  };
}

export default function ClientSEOWrapper({ toolData }: ClientSEOWrapperProps) {
  // 动态生成工具详情页SEO数据
  const seoData = useMemo(() => {
    return generateToolSEO(toolData);
  }, [toolData]);

  return (
    <>
      <SEOMetaTags 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonicalUrl={seoData.canonicalUrl}
        structuredData={seoData.structuredData}
      />
      <SEOOptimizations />
    </>
  );
}