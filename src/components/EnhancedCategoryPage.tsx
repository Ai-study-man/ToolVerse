'use client';

import { useState, useEffect } from 'react';
import { ChevronDownIcon, AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Tool, Category } from '@/types';
import OptimizedToolCard from './OptimizedToolCard';
import Breadcrumbs from './Breadcrumbs';
import EnhancedSchema from './EnhancedSchema';

interface CategoryPageProps {
  category: Category;
  tools: Tool[];
  allCategories: Category[];
}

interface FilterState {
  pricingModel: string;
  rating: number;
  sortBy: string;
  search: string;
}

export default function EnhancedCategoryPage({ category, tools, allCategories }: CategoryPageProps) {
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const [filters, setFilters] = useState<FilterState>({
    pricingModel: 'all',
    rating: 0,
    sortBy: 'popularity',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const toolsPerPage = 12;

  useEffect(() => {
    applyFilters();
  }, [filters, tools]);

  const applyFilters = () => {
    setIsLoading(true);
    let filtered = [...tools];

    // 搜索过滤
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // 价格模式过滤
    if (filters.pricingModel !== 'all') {
      filtered = filtered.filter(tool => tool.pricingModel === filters.pricingModel);
    }

    // 评分过滤
    if (filters.rating > 0) {
      filtered = filtered.filter(tool => tool.rating >= filters.rating);
    }

    // 排序
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'popularity':
        default:
          return (b.views || 0) - (a.views || 0);
      }
    });

    setFilteredTools(filtered);
    setCurrentPage(1);
    setIsLoading(false);
  };

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      pricingModel: 'all',
      rating: 0,
      sortBy: 'popularity',
      search: ''
    });
  };

  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const startIndex = (currentPage - 1) * toolsPerPage;
  const endIndex = startIndex + toolsPerPage;
  const currentTools = filteredTools.slice(startIndex, endIndex);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: category.name }
  ];

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} AI Tools`,
    description: category.description,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredTools.length,
      itemListElement: filteredTools.slice(0, 10).map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'SoftwareApplication',
          name: tool.name,
          description: tool.description,
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/tool/${tool.id}`,
          applicationCategory: category.name,
          offers: {
            '@type': 'Offer',
            price: tool.pricing,
            priceCurrency: 'USD'
          }
        }
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org structured data */}
      <EnhancedSchema schemas={[categorySchema]} />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="text-4xl mr-4">{category.icon}</div>
            <h1 className="text-3xl font-bold text-gray-900">
              {category.name} AI Tools
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            {category.description}
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>{category.toolCount} tools available</span>
            <span>•</span>
            <span>Updated daily</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
              Filters
              <ChevronDownIcon className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Pricing Model Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing Model
                  </label>
                  <select
                    value={filters.pricingModel}
                    onChange={(e) => handleFilterChange('pricingModel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Types</option>
                    <option value="free">Free</option>
                    <option value="freemium">Freemium</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTools.length)} of {filteredTools.length} tools
          </p>
          {isLoading && (
            <div className="text-sm text-gray-500">Filtering...</div>
          )}
        </div>

        {/* Tools Grid */}
        {currentTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {currentTools.map((tool) => (
              <OptimizedToolCard
                key={tool.id}
                tool={tool}
                priority={currentPage === 1}
                showStats={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms to find more tools.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              const actualPage = totalPages > 5 ? 
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i :
                pageNum;
              
              return (
                <button
                  key={actualPage}
                  onClick={() => setCurrentPage(actualPage)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    currentPage === actualPage
                      ? 'text-white bg-primary-600'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {actualPage}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Category Navigation */}
        <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Explore Other Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCategories
              .filter(cat => cat.id !== category.id)
              .slice(0, 8)
              .map((cat) => (
                <a
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
                >
                  <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                    <div className="text-xs text-gray-600">{cat.toolCount} tools</div>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
