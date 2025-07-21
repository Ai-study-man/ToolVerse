'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ToolCard from '../../components/ToolCard';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import DataSyncService from '../../lib/dataSyncService';
import { Tool } from '../../types';

export default function FeaturedPage() {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('rating');

  useEffect(() => {
    const fetchFeaturedTools = async () => {
      try {
        const allTools = await DataSyncService.getTools();
        
        // Select featured tools based on criteria (high rating, has local logo, popular)
        const featured = allTools
          .filter(tool => 
            tool.rating >= 4.0 || // High rated tools
            tool.logo?.startsWith('/logos/') // Tools with local logos
          )
          .sort((a, b) => {
            // Priority sorting: has logo > rating
            const aHasLogo = a.logo?.startsWith('/logos/') ? 1 : 0;
            const bHasLogo = b.logo?.startsWith('/logos/') ? 1 : 0;
            if (aHasLogo !== bHasLogo) return bHasLogo - aHasLogo;
            
            return (b.rating || 0) - (a.rating || 0);
          })
          .slice(0, 24); // Show top 24 featured tools

        setFeaturedTools(featured);
      } catch (error) {
        console.error('Error fetching featured tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTools();
  }, []);

  const categories = ['All', ...Array.from(new Set(featuredTools.map(tool => tool.category)))];

  const filteredAndSortedTools = featuredTools
    .filter(tool => selectedCategory === 'All' || tool.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-5xl mr-4">⭐</span>
            <h1 className="text-4xl md:text-5xl font-bold">
              Featured AI Tools
            </h1>
          </div>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Discover our hand-picked selection of the most powerful, innovative, and user-friendly AI tools. 
            These tools are chosen based on quality, user ratings, and real-world impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-lg">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-accent-300 rounded-full"></span>
              <span>{featuredTools.length} Featured Tools</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-accent-300 rounded-full"></span>
              <span>Curated by Experts</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-2 h-2 bg-accent-300 rounded-full"></span>
              <span>Updated Regularly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2 py-2">Filter by category:</span>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>

          {filteredAndSortedTools.length > 0 && (
            <p className="mt-4 text-sm text-gray-600">
              Showing {filteredAndSortedTools.length} featured tools
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          )}
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <LoadingSkeleton variant="featured" count={12} />
            </div>
          ) : filteredAndSortedTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedTools.map((tool) => (
                <div key={tool.id} className="relative">
                  {tool.logo?.startsWith('/logos/') && (
                    <div className="absolute -top-2 -right-2 z-10 bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ⭐ Featured
                    </div>
                  )}
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured tools found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No featured tools match your current filter criteria. Try selecting a different category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why These Tools Are Featured Section */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why These Tools Are Featured</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our featured tools are carefully selected based on strict criteria to ensure you get the best AI solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-gray-600">
                Tools with ratings of 4.0+ and proven track records of delivering excellent results.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Approved</h3>
              <p className="text-gray-600">
                Highly recommended by our community and extensively tested by real users.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Cutting-edge AI technologies that push the boundaries of what's possible.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
