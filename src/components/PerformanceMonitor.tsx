'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  GlobeAltIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
}

interface WebVitals {
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  FID: number; // First Input Delay
  CLS: number; // Cumulative Layout Shift
  TTFB: number; // Time to First Byte
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [webVitals, setWebVitals] = useState<WebVitals | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      collectMetrics();
    }, 2000); // 等待页面加载完成

    return () => clearTimeout(timer);
  }, []);

  const collectMetrics = async () => {
    setIsLoading(true);

    try {
      // 收集基础性能指标
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
      const FCP = fcpEntry ? fcpEntry.startTime : 0;

      // 收集Web Vitals
      const vitals: WebVitals = {
        FCP,
        LCP: 0,
        FID: 0,
        CLS: 0,
        TTFB: navigation.responseStart - navigation.requestStart
      };

      // 使用PerformanceObserver收集更准确的Web Vitals
      if ('PerformanceObserver' in window) {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          vitals.LCP = lastEntry.startTime;
          updateWebVitals(vitals);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID Observer
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            vitals.FID = entry.processingStart - entry.startTime;
            updateWebVitals(vitals);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS Observer
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          vitals.CLS = clsValue;
          updateWebVitals(vitals);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }

      // 创建性能指标数组
      const performanceMetrics: PerformanceMetric[] = [
        {
          name: 'First Contentful Paint',
          value: FCP,
          unit: 'ms',
          status: getStatus(FCP, { good: 1800, poor: 3000 }),
          threshold: { good: 1800, poor: 3000 }
        },
        {
          name: 'Time to First Byte',
          value: vitals.TTFB,
          unit: 'ms',
          status: getStatus(vitals.TTFB, { good: 800, poor: 1800 }),
          threshold: { good: 800, poor: 1800 }
        },
        {
          name: 'DOM Content Loaded',
          value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          unit: 'ms',
          status: getStatus(
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            { good: 1500, poor: 2500 }
          ),
          threshold: { good: 1500, poor: 2500 }
        },
        {
          name: 'Load Complete',
          value: navigation.loadEventEnd - navigation.loadEventStart,
          unit: 'ms',
          status: getStatus(
            navigation.loadEventEnd - navigation.loadEventStart,
            { good: 2000, poor: 4000 }
          ),
          threshold: { good: 2000, poor: 4000 }
        }
      ];

      setMetrics(performanceMetrics);
      setWebVitals(vitals);
      calculateOverallScore(performanceMetrics, vitals);
      
    } catch (error) {
      console.error('Performance collection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWebVitals = (vitals: WebVitals) => {
    setWebVitals({ ...vitals });
    calculateOverallScore(metrics, vitals);
  };

  const getStatus = (value: number, threshold: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const calculateOverallScore = (metrics: PerformanceMetric[], vitals: WebVitals) => {
    const scores: number[] = metrics.map(metric => {
      switch (metric.status) {
        case 'good': return 100;
        case 'needs-improvement': return 75;
        case 'poor': return 50;
        default: return 0;
      }
    });

    // 添加Web Vitals分数
    if (vitals) {
      const vitalsScores: number[] = [
        vitals.LCP <= 2500 ? 100 : vitals.LCP <= 4000 ? 75 : 50,
        vitals.FID <= 100 ? 100 : vitals.FID <= 300 ? 75 : 50,
        vitals.CLS <= 0.1 ? 100 : vitals.CLS <= 0.25 ? 75 : 50
      ];
      scores.push(...vitalsScores);
    }

    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    setOverallScore(Math.round(average));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'needs-improvement':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms') {
      return value < 1000 ? `${Math.round(value)}ms` : `${(value / 1000).toFixed(2)}s`;
    }
    return `${value.toFixed(3)}${unit}`;
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors z-50"
        title="Performance Monitor"
      >
        <BoltIcon className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 w-80 max-h-96 overflow-hidden z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BoltIcon className="w-5 h-5 mr-2" />
            Performance
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-72 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Core Web Vitals */}
            {webVitals && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <GlobeAltIcon className="w-4 h-4 mr-1" />
                  Core Web Vitals
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">LCP</span>
                    <div className="flex items-center space-x-2">
                      <span>{formatValue(webVitals.LCP, 'ms')}</span>
                      {getStatusIcon(getStatus(webVitals.LCP, { good: 2500, poor: 4000 }))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">FID</span>
                    <div className="flex items-center space-x-2">
                      <span>{formatValue(webVitals.FID, 'ms')}</span>
                      {getStatusIcon(getStatus(webVitals.FID, { good: 100, poor: 300 }))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">CLS</span>
                    <div className="flex items-center space-x-2">
                      <span>{formatValue(webVitals.CLS, '')}</span>
                      {getStatusIcon(getStatus(webVitals.CLS * 1000, { good: 100, poor: 250 }))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                Load Metrics
              </h4>
              <div className="space-y-2 text-sm">
                {metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700 text-xs">{metric.name}</span>
                    <div className="flex items-center space-x-2">
                      <span>{formatValue(metric.value, metric.unit)}</span>
                      {getStatusIcon(metric.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={collectMetrics}
          disabled={isLoading}
          className="w-full bg-primary-600 text-white px-3 py-2 rounded text-sm hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Measuring...' : 'Refresh Metrics'}
        </button>
      </div>
    </div>
  );
}
