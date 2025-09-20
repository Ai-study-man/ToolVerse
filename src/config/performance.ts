// Core Web Vitals优化配置
export const PERFORMANCE_CONFIG = {
  // 图片优化配置
  images: {
    // 使用WebP格式优先
    formats: ['image/webp', 'image/avif'],
    // 响应式尺寸
    sizes: {
      mobile: '100vw',
      tablet: '50vw', 
      desktop: '33vw'
    },
    // 预加载关键图片
    priority: ['hero', 'logo', 'featured-tools'],
    // Lazy loading配置
    loading: 'lazy',
    placeholder: 'blur'
  },

  // 路由预加载配置
  prefetch: {
    // 关键路由自动预加载
    criticalRoutes: ['/tools', '/categories', '/about'],
    // hover时预加载延迟
    hoverDelay: 100,
    // 视窗内预加载
    intersectionThreshold: 0.1
  },

  // 字体优化
  fonts: {
    // 预加载字体
    preload: ['Inter-Regular.woff2', 'Inter-Medium.woff2', 'Inter-Bold.woff2'],
    // 字体显示策略
    display: 'swap',
    // 回退字体
    fallback: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
  },

  // 脚本优化
  scripts: {
    // 延迟加载非关键脚本
    defer: ['analytics', 'tracking'],
    // 异步加载第三方脚本
    async: ['ads', 'social-widgets']
  },

  // Core Web Vitals目标值
  vitals: {
    // Largest Contentful Paint (LCP) - 最大内容绘制
    LCP: {
      good: 2500,      // 2.5秒内 - 良好
      poor: 4000       // 4秒以上 - 差
    },
    // First Input Delay (FID) - 首次输入延迟
    FID: {
      good: 100,       // 100ms内 - 良好
      poor: 300        // 300ms以上 - 差
    },
    // Cumulative Layout Shift (CLS) - 累积布局偏移
    CLS: {
      good: 0.1,       // 0.1以下 - 良好
      poor: 0.25       // 0.25以上 - 差
    },
    // First Contentful Paint (FCP) - 首次内容绘制
    FCP: {
      good: 1800,      // 1.8秒内 - 良好
      poor: 3000       // 3秒以上 - 差
    },
    // Time to First Byte (TTFB) - 首字节时间
    TTFB: {
      good: 800,       // 800ms内 - 良好
      poor: 1800       // 1.8秒以上 - 差
    }
  },

  // 缓存策略
  cache: {
    // 静态资源缓存时间
    static: {
      images: '1y',
      fonts: '1y',
      css: '1y',
      js: '1y'
    },
    // API缓存时间
    api: {
      tools: '1h',
      categories: '1d',
      search: '30m'
    }
  }
};

// 性能监控配置
export const MONITORING_CONFIG = {
  // 启用的监控功能
  enabled: {
    vitals: true,
    navigation: true,
    resources: true,
    errors: true
  },
  
  // 采样率
  sampleRate: 0.1, // 10%的用户

  // 报告端点
  endpoint: '/api/performance',
  
  // 批量发送配置
  batch: {
    size: 10,
    timeout: 30000 // 30秒
  }
};

export default PERFORMANCE_CONFIG;