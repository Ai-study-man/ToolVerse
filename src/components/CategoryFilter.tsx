import React, { useState, useEffect } from 'react';
import { Tool } from '../types';

interface FilterState {
  pricingModels: string[];
  commercialLicense: string[];
  difficultyLevel: string[];
  categories: string[];
  ratings: string[];
}

interface CategoryFilterProps {
  tools: Tool[];
  categories: any[];
  onFilterChange: (filteredTools: Tool[]) => void;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  tools,
  categories,
  onFilterChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    pricingModels: [],
    commercialLicense: [],
    difficultyLevel: [],
    categories: [],
    ratings: []
  });

  // Filter options
  const filterOptions = {
    pricingModels: [
      { id: 'free', label: 'Free', description: 'Completely free to use' },
      { id: 'freemium', label: 'Freemium', description: 'Free tier with paid upgrades' },
      { id: 'paid', label: 'Paid Only', description: 'Requires subscription or payment' }
    ],
    commercialLicense: [
      { id: 'commercial', label: 'Commercial Use', description: 'Allowed for business purposes' },
      { id: 'personal', label: 'Personal Use Only', description: 'Limited to personal projects' },
      { id: 'open-source', label: 'Open Source', description: 'Open source license' }
    ],
    difficultyLevel: [
      { id: 'beginner', label: 'Beginner Friendly', description: 'Easy to get started' },
      { id: 'intermediate', label: 'Intermediate', description: 'Requires some experience' },
      { id: 'advanced', label: 'Advanced Users', description: 'For experienced professionals' }
    ],
    ratings: [
      { id: '4.5+', label: '4.5+ Stars', description: 'Highest rated tools' },
      { id: '4.0+', label: '4.0+ Stars', description: 'Highly rated tools' },
      { id: '3.5+', label: '3.5+ Stars', description: 'Well-rated tools' }
    ]
  };

  // Determine tool characteristics based on tags and other properties
  const getToolCharacteristics = (tool: Tool) => {
    const tags = tool.tags.map((tag: string) => tag.toLowerCase());
    const description = tool.description.toLowerCase();
    const features = tool.features.map((f: string) => f.toLowerCase());
    
    // Commercial license detection
    const hasCommercialLicense = 
      tags.some((tag: string) => tag.includes('commercial') || tag.includes('enterprise')) ||
      description.includes('commercial') ||
      description.includes('business') ||
      tool.pricingModel === 'paid' ||
      tool.pricingModel === 'freemium';
    
    const isOpenSource = 
      tags.some((tag: string) => tag.includes('open source') || tag.includes('opensource')) ||
      description.includes('open source') ||
      description.includes('github');
    
    // Difficulty level detection
    const isBeginnerFriendly = 
      tags.some((tag: string) => 
        tag.includes('beginner') || 
        tag.includes('easy') || 
        tag.includes('simple') || 
        tag.includes('user-friendly') ||
        tag.includes('no-code') ||
        tag.includes('drag') ||
        tag.includes('visual')
      ) ||
      description.includes('beginner') ||
      description.includes('easy to use') ||
      description.includes('user-friendly') ||
      description.includes('no coding') ||
      features.some((f: string) => 
        f.includes('easy') || 
        f.includes('simple') || 
        f.includes('drag') ||
        f.includes('visual')
      );
    
    const isAdvanced = 
      tags.some((tag: string) => 
        tag.includes('advanced') || 
        tag.includes('professional') || 
        tag.includes('enterprise') ||
        tag.includes('api') ||
        tag.includes('developer') ||
        tag.includes('technical')
      ) ||
      description.includes('advanced') ||
      description.includes('professional') ||
      description.includes('developer') ||
      features.some((f: string) => 
        f.includes('api') || 
        f.includes('advanced') || 
        f.includes('professional')
      );

    return {
      commercialLicense: isOpenSource ? 'open-source' : hasCommercialLicense ? 'commercial' : 'personal',
      difficultyLevel: isAdvanced ? 'advanced' : isBeginnerFriendly ? 'beginner' : 'intermediate'
    };
  };

  // Apply filters to tools
  const applyFilters = () => {
    let filteredTools = [...tools];

    // Filter by pricing model
    if (filters.pricingModels.length > 0) {
      filteredTools = filteredTools.filter(tool => 
        filters.pricingModels.includes(tool.pricingModel)
      );
    }

    // Filter by category
    if (filters.categories.length > 0) {
      filteredTools = filteredTools.filter(tool => 
        filters.categories.includes(tool.category)
      );
    }

    // Filter by rating
    if (filters.ratings.length > 0) {
      filteredTools = filteredTools.filter(tool => {
        const rating = tool.rating;
        return filters.ratings.some(ratingFilter => {
          switch (ratingFilter) {
            case '4.5+': return rating >= 4.5;
            case '4.0+': return rating >= 4.0;
            case '3.5+': return rating >= 3.5;
            default: return true;
          }
        });
      });
    }

    // Filter by commercial license and difficulty
    if (filters.commercialLicense.length > 0 || filters.difficultyLevel.length > 0) {
      filteredTools = filteredTools.filter(tool => {
        const characteristics = getToolCharacteristics(tool);
        
        const licenseMatch = filters.commercialLicense.length === 0 || 
          filters.commercialLicense.includes(characteristics.commercialLicense);
        
        const difficultyMatch = filters.difficultyLevel.length === 0 || 
          filters.difficultyLevel.includes(characteristics.difficultyLevel);
        
        return licenseMatch && difficultyMatch;
      });
    }

    onFilterChange(filteredTools);
  };

  // Update filters and apply them
  const updateFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentFilters = prev[filterType];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(f => f !== value)
        : [...currentFilters, value];
      
      return { ...prev, [filterType]: newFilters };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      pricingModels: [],
      commercialLicense: [],
      difficultyLevel: [],
      categories: [],
      ratings: []
    });
  };

  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [filters, tools]);

  // Count active filters
  const activeFiltersCount = Object.values(filters).flat().length;

  return (
    <div className={`relative ${className}`}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="font-medium text-gray-700">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-12 left-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Tools</h3>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Pricing Model Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Pricing Model</h4>
              <div className="space-y-2">
                {filterOptions.pricingModels.map(option => (
                  <label key={option.id} className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.pricingModels.includes(option.id)}
                      onChange={() => updateFilter('pricingModels', option.id)}
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Commercial License Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">License Type</h4>
              <div className="space-y-2">
                {filterOptions.commercialLicense.map(option => (
                  <label key={option.id} className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.commercialLicense.includes(option.id)}
                      onChange={() => updateFilter('commercialLicense', option.id)}
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Level Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Difficulty Level</h4>
              <div className="space-y-2">
                {filterOptions.difficultyLevel.map(option => (
                  <label key={option.id} className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.difficultyLevel.includes(option.id)}
                      onChange={() => updateFilter('difficultyLevel', option.id)}
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {categories.map(category => (
                  <label key={category.id} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category.name)}
                      onChange={() => updateFilter('categories', category.name)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="text-sm text-gray-900">{category.name}</span>
                      <span className="text-xs text-gray-500">({category.toolCount})</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {filterOptions.ratings.map(option => (
                  <label key={option.id} className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.ratings.includes(option.id)}
                      onChange={() => updateFilter('ratings', option.id)}
                      className="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Pricing Model Tags */}
          {filters.pricingModels.map(filter => (
            <span
              key={`pricing-${filter}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {filterOptions.pricingModels.find(o => o.id === filter)?.label}
              <button
                onClick={() => updateFilter('pricingModels', filter)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}

          {/* License Tags */}
          {filters.commercialLicense.map(filter => (
            <span
              key={`license-${filter}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
            >
              {filterOptions.commercialLicense.find(o => o.id === filter)?.label}
              <button
                onClick={() => updateFilter('commercialLicense', filter)}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}

          {/* Difficulty Tags */}
          {filters.difficultyLevel.map(filter => (
            <span
              key={`difficulty-${filter}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
            >
              {filterOptions.difficultyLevel.find(o => o.id === filter)?.label}
              <button
                onClick={() => updateFilter('difficultyLevel', filter)}
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}

          {/* Category Tags */}
          {filters.categories.map(filter => (
            <span
              key={`category-${filter}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
            >
              {filter}
              <button
                onClick={() => updateFilter('categories', filter)}
                className="hover:bg-gray-200 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}

          {/* Rating Tags */}
          {filters.ratings.map(filter => (
            <span
              key={`rating-${filter}`}
              className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
            >
              {filter} ⭐
              <button
                onClick={() => updateFilter('ratings', filter)}
                className="hover:bg-yellow-200 rounded-full p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
