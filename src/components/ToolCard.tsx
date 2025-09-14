'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Tool } from '@/types';
import { getCategoryIcon } from '@/utils/categoryIcons';
import ToolLogo from './ToolLogo';

interface ToolCardProps {
  tool: Tool;
  priority?: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, priority = false }) => {
  const getPricingBadgeStyle = (pricing: string) => {
    switch (pricing.toLowerCase()) {
      case 'free':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'freemium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const categoryIcon = getCategoryIcon(tool.category);

  return (
    <Link href={`/tool/${tool.id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group-hover:scale-[1.02] h-full flex flex-col">
        {/* Header with Logo and Pricing */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ToolLogo 
              name={tool.name}
              logo={tool.logo}
              size="md"
              className="flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {tool.name}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="mr-1">{categoryIcon}</span>
                <span className="capitalize">{tool.category}</span>
              </div>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPricingBadgeStyle(tool.pricing)}`}>
            {tool.pricing}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-grow">
          {tool.description}
        </p>

        {/* Visit Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
            View Details →
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;