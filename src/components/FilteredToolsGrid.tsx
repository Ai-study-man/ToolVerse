import React from 'react';
import ToolImage from './ToolImage';
import { Tool } from '../types';

interface FilteredToolsGridProps {
  tools: Tool[];
  categories: any[];
  className?: string;
}

const FilteredToolsGrid: React.FC<FilteredToolsGridProps> = ({
  tools,
  categories,
  className = ''
}) => {
  // Group tools by category
  const toolsByCategory = categories.reduce((acc: { [key: string]: Tool[] }, category) => {
    acc[category.name] = tools.filter(tool => tool.category === category.name);
    return acc;
  }, {});

  // Only show categories that have tools after filtering
  const categoriesWithTools = categories.filter(category => 
    toolsByCategory[category.name] && toolsByCategory[category.name].length > 0
  );

  if (categoriesWithTools.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          No tools match your current filter criteria. Try adjusting your filters or clearing them to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {categoriesWithTools.map((category) => {
        const categoryTools = toolsByCategory[category.name];
        
        return (
          <div key={category.id} className="mb-12">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''}
                </span>
                <a 
                  href={`/category/${encodeURIComponent(category.name)}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all →
                </a>
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryTools.slice(0, 6).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>

            {/* Show More Link */}
            {categoryTools.length > 6 && (
              <div className="mt-6 text-center">
                <a 
                  href={`/category/${encodeURIComponent(category.name)}`}
                  className="inline-flex items-center px-4 py-2 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  View {categoryTools.length - 6} more {category.name} tools
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Tool Card Component for the grid
interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const getPricingBadgeStyle = (pricingModel: string) => {
    switch (pricingModel) {
      case 'free':
        return 'bg-green-100 text-green-800';
      case 'freemium':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPricingLabel = (pricingModel: string) => {
    switch (pricingModel) {
      case 'free':
        return 'Free';
      case 'freemium':
        return 'Freemium';
      case 'paid':
        return 'Paid';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 p-6">
      {/* Tool Header */}
      <div className="flex items-center gap-3 mb-4">
        <ToolImage
          src={tool.logo}
          alt={`${tool.name} logo`}
          name={tool.name}
          className="w-12 h-12 rounded-lg object-contain"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{tool.name}</h3>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
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
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tool.shortDescription}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {tool.tags.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
          >
            {tag}
          </span>
        ))}
        {tool.tags.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
            +{tool.tags.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPricingBadgeStyle(tool.pricingModel)}`}>
          {getPricingLabel(tool.pricingModel)}
        </span>
        <a 
          href={`/tool/${tool.id}`}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Learn more →
        </a>
      </div>
    </div>
  );
};

export default FilteredToolsGrid;
