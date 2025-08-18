'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';
import CategoryFilter from '../../components/CategoryFilter';
import FilteredToolsGrid from '../../components/FilteredToolsGrid';
import StructuredData from '../../components/StructuredData';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import DataSyncService from '../../lib/dataSyncService';
import { Category, Tool } from '../../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, toolsData] = await Promise.all([
          DataSyncService.getCategories(),
          DataSyncService.getTools()
        ]);
        setCategories(categoriesData);
        setTools(toolsData);
        setFilteredTools(toolsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update categories with filtered tool counts
  const getCategoriesWithFilteredCounts = () => {
    return categories.map(category => {
      const toolCount = filteredTools.filter(tool => tool.category === category.name).length;
      return { ...category, toolCount };
    });
  };

  const categoriesWithCounts = getCategoriesWithFilteredCounts();
  
  const filteredCategories = categoriesWithCounts.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFilteredTools = filteredTools.length;

  const handleFilterChange = (newFilteredTools: Tool[]) => {
    setFilteredTools(newFilteredTools);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* SEO结构化数据 */}
      <StructuredData 
        type="website" 
        data={{
          name: "AI工具分类",
          description: "按分类浏览AI工具：对话AI、图像生成、代码开发等",
          url: "https://toolverse.com/categories"
        }} 
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore AI Tool Categories
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Discover AI tools organized by category. Find the perfect tools for your specific needs and use cases.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-lg">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-accent-300 rounded-full"></span>
              <span>{categories.length} Categories</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-accent-300 rounded-full"></span>
              <span>{totalFilteredTools} AI Tools</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                Showing {filteredCategories.length} of {categories.length} categories
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Advanced Filters Section */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Advanced Filters</h2>
              <p className="text-sm text-gray-600">
                Refine your search by pricing, license type, difficulty level, and more
              </p>
            </div>
            <CategoryFilter
              tools={tools}
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          {/* Filter Results Summary */}
          {filteredTools.length !== tools.length && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-blue-800 font-medium">
                  Showing {filteredTools.length} of {tools.length} tools
                </span>
                <span className="text-blue-600">
                  ({categoriesWithCounts.filter(c => c.toolCount > 0).length} categories have matching tools)
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid or Filtered Tools */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <LoadingSkeleton variant="category" count={6} />
            </div>
          ) : filteredTools.length !== tools.length ? (
            // Show filtered tools when filters are active
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Filtered Results</h2>
                <p className="text-gray-600">
                  Showing tools that match your filter criteria, organized by category
                </p>
              </div>
              <FilteredToolsGrid 
                tools={filteredTools} 
                categories={categories}
              />
            </>
          ) : filteredCategories.length > 0 ? (
            // Show category overview when no filters are active
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    icon={category.icon}
                    toolCount={category.toolCount}
                    onClick={() => window.location.href = `/tools?category=${encodeURIComponent(category.name)}`}
                  />
                ))}
              </div>
              
              {/* Category Statistics */}
              <div className="mt-16 bg-white rounded-lg p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Category Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">{categories.length}</div>
                    <div className="text-gray-600">Total Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-600 mb-2">{totalFilteredTools}</div>
                    <div className="text-gray-600">Total AI Tools</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-600 mb-2">
                      {categories.length > 0 ? Math.round(totalFilteredTools / categories.length) : 0}
                    </div>
                    <div className="text-gray-600">Avg Tools per Category</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No categories match your search criteria. Try adjusting your search terms.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Categories Section */}
      {!searchQuery && !loading && (
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Most Popular Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories
                .sort((a, b) => b.toolCount - a.toolCount)
                .slice(0, 4)
                .map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.location.href = `/tools?category=${encodeURIComponent(category.name)}`}
                  >
                    <div className="text-2xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    <div className="text-primary-600 font-medium">{category.toolCount} tools</div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
