'use client';

import { memo } from 'react';
import Link from 'next/link';
import ToolLogo from './ToolLogo';

interface ToolGridProps {
  tools: any[];
}

// 优化单个工具卡片组件
const ToolCard = memo(function ToolCard({ tool }: { tool: any }) {
  return (
    <Link 
      href={`/tool/${tool.id}`}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02] block"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <ToolLogo 
            name={tool.name}
            logo={tool.logo}
            size="md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
            {tool.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {tool.shortDescription}
          </p>
          <div className="flex items-center mt-3 space-x-4">
            <div className="flex items-center">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(tool.rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                {tool.rating} ({tool.reviewCount})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              tool.pricingModel === 'free' 
                ? 'bg-green-100 text-green-800'
                : tool.pricingModel === 'freemium'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {tool.pricingModel === 'free' ? 'Free' : 
               tool.pricingModel === 'freemium' ? 'Freemium' : 'Paid'}
            </span>
            <span className="text-sm text-gray-500">{tool.pricing}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-3">
            {tool.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
            {tool.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                +{tool.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

function ToolGrid({ tools }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}

export default memo(ToolGrid);
