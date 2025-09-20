'use client';

import { useEffect, useState } from 'react';
import { PERFORMANCE_CONFIG } from '../config/performance';

interface PerformanceMetrics {
  LCP: number | null;
  FID: number | null;
  CLS: number | null;
  FCP: number | null;
  TTFB: number | null;
}

interface PerformanceHookResult {
  metrics: PerformanceMetrics;
  loading: boolean;
  score: number;
  recommendations: string[];
}

export function usePerformanceOptimization(): PerformanceHookResult {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 确保在浏览器环境中运行
    if (typeof window === 'undefined') return;

    let observer: PerformanceObserver;

    // 监控Web Vitals
    const initPerformanceMonitoring = () => {
      try {
        // 监控LCP (Largest Contentful Paint)
        if ('PerformanceObserver' in window) {
          observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.entryType === 'largest-contentful-paint') {
                setMetrics(prev => ({ ...prev, LCP: entry.startTime }));
              }
              if (entry.entryType === 'first-input') {
                setMetrics(prev => ({ ...prev, FID: (entry as any).processingStart - entry.startTime }));
              }
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                setMetrics(prev => ({ 
                  ...prev, 
                  CLS: (prev.CLS || 0) + (entry as any).value 
                }));
              }
            });
          });

          // 观察LCP
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
          
          // 观察FID
          observer.observe({ type: 'first-input', buffered: true });
          
          // 观察CLS
          observer.observe({ type: 'layout-shift', buffered: true });
        }

        // 获取FCP和TTFB
        window.addEventListener('load', () => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          // TTFB
          if (navigation) {
            setMetrics(prev => ({ 
              ...prev, 
              TTFB: navigation.responseStart - navigation.requestStart 
            }));
          }

          // FCP
          const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            setMetrics(prev => ({ ...prev, FCP: fcpEntry.startTime }));
          }

          setLoading(false);
        });

      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
        setLoading(false);
      }
    };

    initPerformanceMonitoring();

    // 预加载关键路由
    const prefetchCriticalRoutes = () => {
      PERFORMANCE_CONFIG.prefetch.criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // 延迟执行预加载，避免阻塞关键渲染路径
    setTimeout(prefetchCriticalRoutes, 2000);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // 计算性能分数
  const calculateScore = (): number => {
    if (loading || !metrics.LCP || !metrics.FCP) return 0;
    
    let score = 100;
    const { vitals } = PERFORMANCE_CONFIG;

    // LCP评分 (25%)
    if (metrics.LCP > vitals.LCP.poor) score -= 25;
    else if (metrics.LCP > vitals.LCP.good) score -= 15;

    // FCP评分 (25%)
    if (metrics.FCP && metrics.FCP > vitals.FCP.poor) score -= 25;
    else if (metrics.FCP && metrics.FCP > vitals.FCP.good) score -= 15;

    // FID评分 (25%)
    if (metrics.FID && metrics.FID > vitals.FID.poor) score -= 25;
    else if (metrics.FID && metrics.FID > vitals.FID.good) score -= 15;

    // CLS评分 (25%)
    if (metrics.CLS && metrics.CLS > vitals.CLS.poor) score -= 25;
    else if (metrics.CLS && metrics.CLS > vitals.CLS.good) score -= 15;

    return Math.max(0, score);
  };

  // 生成优化建议
  const generateRecommendations = (): string[] => {
    const recommendations: string[] = [];
    const { vitals } = PERFORMANCE_CONFIG;

    if (metrics.LCP && metrics.LCP > vitals.LCP.good) {
      recommendations.push('优化最大内容绘制(LCP): 压缩图片、使用CDN、启用缓存');
    }
    
    if (metrics.FCP && metrics.FCP > vitals.FCP.good) {
      recommendations.push('优化首次内容绘制(FCP): 减少阻塞资源、优化关键CSS');
    }
    
    if (metrics.FID && metrics.FID > vitals.FID.good) {
      recommendations.push('优化首次输入延迟(FID): 减少主线程阻塞、代码分割');
    }
    
    if (metrics.CLS && metrics.CLS > vitals.CLS.good) {
      recommendations.push('优化累积布局偏移(CLS): 设置图片尺寸、避免动态内容插入');
    }

    return recommendations;
  };

  return {
    metrics,
    loading,
    score: calculateScore(),
    recommendations: generateRecommendations()
  };
}

// 预加载关键资源的Hook
export function usePrefetchOptimization() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 预加载关键字体
    const preloadFonts = () => {
      PERFORMANCE_CONFIG.fonts.preload.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = `/fonts/${font}`;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // 立即预加载字体
    preloadFonts();

    // 使用Intersection Observer优化图片加载
    const optimizeImageLoading = () => {
      const images = document.querySelectorAll('img[data-optimize]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        }, {
          threshold: PERFORMANCE_CONFIG.prefetch.intersectionThreshold
        });

        images.forEach(img => imageObserver.observe(img));
      }
    };

    // 延迟执行图片优化
    setTimeout(optimizeImageLoading, 1000);

  }, []);
}

export default usePerformanceOptimization;