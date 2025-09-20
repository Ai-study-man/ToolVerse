'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 声明全局gtag函数类型
declare global {
  function gtag(...args: any[]): void;
}

// SEO性能优化组件
export default function SEOOptimizations() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. 预加载关键页面
    const criticalPages = ['/tools', '/categories', '/compare'];
    
    criticalPages.forEach(page => {
      if (pathname !== page) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      }
    });

    // 2. 预连接到外部资源
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://www.googletagmanager.com',
      'https://pagead2.googlesyndication.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // 3. 延迟加载非关键CSS
    const nonCriticalCSS = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ];

    setTimeout(() => {
      nonCriticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'print';
        link.onload = () => { link.media = 'all'; };
        document.head.appendChild(link);
      });
    }, 100);

    // 4. 图片懒加载优化
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
      });

      // 观察所有带有data-src的图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }

    // 清理函数
    return () => {
      // 清理预加载的链接
      document.querySelectorAll('link[rel="prefetch"]').forEach(link => {
        link.remove();
      });
    };
  }, [pathname]);

  return null; // 这是一个隐形组件，不渲染任何内容
}

// Core Web Vitals 监控
export function WebVitalsTracker() {
  useEffect(() => {
    // 监控 Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // 发送到分析工具（如Google Analytics）
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'LCP',
            value: Math.round(lastEntry.startTime),
            custom_map: { metric_value: 'value' }
          });
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    // 监控 First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry: any) => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'FID',
              value: Math.round(entry.processingStart - entry.startTime),
              custom_map: { metric_value: 'value' }
            });
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported');
      }
    }

    // 监控 Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // 页面卸载时发送CLS数据
        window.addEventListener('beforeunload', () => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'CLS',
              value: Math.round(clsValue * 1000),
              custom_map: { metric_value: 'value' }
            });
          }
        });
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }, []);

  return null;
}

// 智能预加载组件
export function SmartPreloader({ pages }: { pages: string[] }) {
  useEffect(() => {
    const preloadPage = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    };

    // 基于用户行为预加载
    let mouseOverTimer: NodeJS.Timeout;
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && pages.includes(anchor.pathname)) {
        mouseOverTimer = setTimeout(() => {
          preloadPage(anchor.href);
        }, 100); // 100ms后预加载
      }
    };

    const handleMouseOut = () => {
      if (mouseOverTimer) {
        clearTimeout(mouseOverTimer);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // 基于滚动位置预加载
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      // 当用户滚动到50%时，预加载下一页
      if (scrollPercent > 50) {
        pages.forEach(page => preloadPage(page));
        document.removeEventListener('scroll', handleScroll);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('scroll', handleScroll);
      if (mouseOverTimer) clearTimeout(mouseOverTimer);
    };
  }, [pages]);

  return null;
}

// 图片优化组件
export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className,
  priority = false 
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={priority ? src : undefined}
      data-src={priority ? undefined : src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={{
        contentVisibility: priority ? 'auto' : 'auto',
        containIntrinsicSize: `${width}px ${height}px`
      }}
    />
  );
}