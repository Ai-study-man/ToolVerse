'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import CategoryCard from '../../components/CategoryCard';
import StructuredData from '../../components/StructuredData';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import DataSyncService from '../../lib/dataSyncService';
import { Category } from '../../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await DataSyncService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTools = categories.reduce((sum, category) => sum + category.toolCount, 0);

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
              <span>{totalTools} AI Tools</span>
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

      {/* Categories Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <LoadingSkeleton variant="category" count={6} />
            </div>
          ) : filteredCategories.length > 0 ? (
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
                    <div className="text-3xl font-bold text-secondary-600 mb-2">{totalTools}</div>
                    <div className="text-gray-600">Total AI Tools</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-600 mb-2">
                      {Math.round(totalTools / categories.length)}
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
