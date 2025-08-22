'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface SEOMetrics {
  title: string;
  titleLength: number;
  description: string;
  descriptionLength: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  totalHeadings: number;
  imageCount: number;
  imagesWithAlt: number;
  linkCount: number;
  internalLinks: number;
  externalLinks: number;
  hasStructuredData: boolean;
  loadTime: number;
  contentLength: number;
}

interface PerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

export default function SEOMonitor() {
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('seo');

  useEffect(() => {
    analyzePage();
  }, []);

  const analyzePage = () => {
    setLoading(true);
    
    // 分析SEO指标
    const title = document.title;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    const h1Elements = document.querySelectorAll('h1');
    const h2Elements = document.querySelectorAll('h2');
    const h3Elements = document.querySelectorAll('h3');
    
    const images = document.querySelectorAll('img');
    const imagesWithAlt = Array.from(images).filter(img => img.alt && img.alt.trim() !== '');
    
    const links = document.querySelectorAll('a[href]');
    const internalLinks = Array.from(links).filter(link => {
      const href = link.getAttribute('href');
      return href && (href.startsWith('/') || href.includes(window.location.hostname));
    });
    const externalLinks = Array.from(links).filter(link => {
      const href = link.getAttribute('href');
      return href && href.startsWith('http') && !href.includes(window.location.hostname);
    });

    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    const seoData: SEOMetrics = {
      title,
      titleLength: title.length,
      description: metaDescription,
      descriptionLength: metaDescription.length,
      h1Count: h1Elements.length,
      h2Count: h2Elements.length,
      h3Count: h3Elements.length,
      totalHeadings: h1Elements.length + h2Elements.length + h3Elements.length,
      imageCount: images.length,
      imagesWithAlt: imagesWithAlt.length,
      linkCount: links.length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      hasStructuredData: structuredDataScripts.length > 0,
      loadTime: performance.timing?.loadEventEnd - performance.timing?.navigationStart || 0,
      contentLength: document.body.innerText.length
    };

    setSeoMetrics(seoData);

    // 性能指标 (Web Vitals)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // 处理不同类型的性能条目
          if (entry.entryType === 'paint' || entry.entryType === 'largest-contentful-paint') {
            console.log('Performance entry:', entry.name, entry.startTime);
          }
        });
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    }

    setLoading(false);
  };

  const getSEOScore = () => {
    if (!seoMetrics) return 0;
    
    let score = 0;
    const checks = [
      { condition: seoMetrics.titleLength >= 30 && seoMetrics.titleLength <= 60, points: 15 },
      { condition: seoMetrics.descriptionLength >= 120 && seoMetrics.descriptionLength <= 160, points: 15 },
      { condition: seoMetrics.h1Count === 1, points: 10 },
      { condition: seoMetrics.h2Count >= 2, points: 10 },
      { condition: seoMetrics.imagesWithAlt / seoMetrics.imageCount >= 0.8, points: 10 },
      { condition: seoMetrics.internalLinks >= 3, points: 10 },
      { condition: seoMetrics.hasStructuredData, points: 15 },
      { condition: seoMetrics.contentLength >= 300, points: 10 },
      { condition: seoMetrics.loadTime < 3000, points: 5 }
    ];

    checks.forEach(check => {
      if (check.condition) score += check.points;
    });

    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircleIcon className="w-5 h-5 text-green-500" />
    ) : (
      <XCircleIcon className="w-5 h-5 text-red-500" />
    );
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-80 z-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const score = getSEOScore();

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 w-96 z-50 max-h-96 overflow-hidden">
      {/* 标题栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            SEO Monitor
          </h3>
          <div className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
            Score: {score}/100
          </div>
        </div>
        
        {/* 标签页 */}
        <div className="flex space-x-1 mt-3">
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === 'seo' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === 'performance' 
                ? 'bg-primary-100 text-primary-700' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Performance
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {activeTab === 'seo' && seoMetrics && (
          <div className="space-y-3">
            {/* Title 检查 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Title Length</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{seoMetrics.titleLength}/60</span>
                {getStatusIcon(seoMetrics.titleLength >= 30 && seoMetrics.titleLength <= 60)}
              </div>
            </div>

            {/* Description 检查 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Meta Description</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{seoMetrics.descriptionLength}/160</span>
                {getStatusIcon(seoMetrics.descriptionLength >= 120 && seoMetrics.descriptionLength <= 160)}
              </div>
            </div>

            {/* H1 检查 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">H1 Tags</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{seoMetrics.h1Count}</span>
                {getStatusIcon(seoMetrics.h1Count === 1)}
              </div>
            </div>

            {/* H2 检查 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">H2 Tags</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{seoMetrics.h2Count}</span>
                {getStatusIcon(seoMetrics.h2Count >= 2)}
              </div>
            </div>

            {/* 图片Alt检查 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Images with Alt</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{seoMetrics.imagesWithAlt}/{seoMetrics.imageCount}</span>
                {getStatusIcon(seoMetrics.imagesWithAlt / seoMetrics.imageCount >= 0.8)}
              </div>
            </div>

            {/* 内部链接检查 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Internal Links</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{seoMetrics.internalLinks}</span>
                {getStatusIcon(seoMetrics.internalLinks >= 3)}
              </div>
            </div>

            {/* 结构化数据检查 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Structured Data</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{seoMetrics.hasStructuredData ? 'Yes' : 'No'}</span>
                {getStatusIcon(seoMetrics.hasStructuredData)}
              </div>
            </div>

            {/* 内容长度检查 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Content Length</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{seoMetrics.contentLength} chars</span>
                {getStatusIcon(seoMetrics.contentLength >= 300)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-3">
            <div className="text-center py-4 text-gray-500">
              <ClockIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Performance metrics</p>
              <p className="text-xs mt-1">Loading Web Vitals...</p>
            </div>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={analyzePage}
          className="w-full bg-primary-600 text-white px-3 py-2 rounded text-sm hover:bg-primary-700 transition-colors"
        >
          Re-analyze Page
        </button>
      </div>
    </div>
  );
}
