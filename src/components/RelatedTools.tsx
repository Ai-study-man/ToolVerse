'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ToolCard from './ToolCard';
import { Tool } from '../types';

interface RelatedToolsProps {
  currentTool?: Tool;
  category?: string;
  toolId?: string;
  maxItems?: number;
  title?: string;
}

export default function RelatedTools({ 
  currentTool, 
  category, 
  toolId, 
  maxItems = 6,
  title = "Related AI Tools"
}: RelatedToolsProps) {
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedTools = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tools');
        const allTools: Tool[] = await response.json();
        
        let filteredTools = allTools;

        // 排除当前工具
        if (toolId) {
          filteredTools = filteredTools.filter(tool => tool.id !== toolId);
        }

        // 相关性算法
        let scoredTools = filteredTools.map(tool => {
          let score = 0;
          
          // 1. 相同分类 (+3分)
          if (currentTool && tool.category === currentTool.category) {
            score += 3;
          } else if (category && tool.category === category) {
            score += 3;
          }
          
          // 2. 相同定价模式 (+2分)
          if (currentTool && tool.pricingModel === currentTool.pricingModel) {
            score += 2;
          }
          
          // 3. 相似用例标签 (+1分每个匹配)
          if (currentTool?.useCases && tool.useCases) {
            const commonUseCases = currentTool.useCases.filter(useCase => 
              tool.useCases?.includes(useCase)
            );
            score += commonUseCases.length;
          }
          
          // 4. 相似特性 (+1分每个匹配)
          if (currentTool?.features && tool.features) {
            const commonFeatures = currentTool.features.filter(feature => 
              tool.features?.includes(feature)
            );
            score += commonFeatures.length;
          }
          
          // 5. 评分相近 (+1分如果评分差距小于1)
          if (currentTool?.rating && tool.rating) {
            if (Math.abs(currentTool.rating - tool.rating) < 1) {
              score += 1;
            }
          }
          
          // 6. 随机因子 (避免结果过于固定)
          score += Math.random() * 0.5;
          
          return { ...tool, relevanceScore: score };
        });

        // 按相关性分数排序
        scoredTools.sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        // 取前N个
        const topRelated = scoredTools.slice(0, maxItems);
        setRelatedTools(topRelated);
        
      } catch (error) {
        console.error('Failed to fetch related tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedTools();
  }, [currentTool, category, toolId, maxItems]);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">{title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedTools.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          {category && (
            <Link 
              href={`/tools?category=${encodeURIComponent(category)}`}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              View all in {category} →
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {/* 算法说明（仅开发环境） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 text-center">
            <details className="inline-block text-left">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                算法说明 (开发模式)
              </summary>
              <div className="mt-2 text-xs text-gray-600 bg-gray-100 p-3 rounded max-w-md">
                <p>相关性评分规则:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>相同分类: +3分</li>
                  <li>相同定价模式: +2分</li>
                  <li>相似用例: +1分/匹配</li>
                  <li>相似特性: +1分/匹配</li>
                  <li>评分相近: +1分</li>
                  <li>随机因子: +0-0.5分</li>
                </ul>
              </div>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}
