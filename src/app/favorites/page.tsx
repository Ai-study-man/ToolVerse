'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { Tool } from '../../types';

export default function FavoritesPage() {
  const [favoriteTools, setFavoriteTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // 获取收藏的工具名称
        const favoriteNames = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favoriteNames.length === 0) {
          setIsLoading(false);
          return;
        }

        // 获取所有工具数据
        const response = await fetch('/api/tools');
        const allTools: Tool[] = await response.json();
        
        // 筛选出收藏的工具
        const favorites = allTools.filter(tool => favoriteNames.includes(tool.name));
        setFavoriteTools(favorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = (toolName: string) => {
    // 从localStorage移除
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favorites.filter((name: string) => name !== toolName);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    // 更新状态
    setFavoriteTools(prev => prev.filter(tool => tool.name !== toolName));
  };

  const clearAllFavorites = () => {
    if (confirm('Are you sure you want to remove all favorites?')) {
      localStorage.removeItem('favorites');
      setFavoriteTools([]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 mt-2">
              {favoriteTools.length} AI tool{favoriteTools.length !== 1 ? 's' : ''} saved locally
            </p>
          </div>
          
          {favoriteTools.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* 收藏列表 */}
        {favoriteTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">Start adding AI tools to your favorites to see them here</p>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse AI Tools
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteTools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-600">{tool.category}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => removeFavorite(tool.name)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Remove from favorites"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{tool.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {tool.pricing || 'N/A'}
                    </span>
                    
                    <div className="flex space-x-2">
                      <a
                        href={`/tools/${tool.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View Details
                      </a>
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-gray-700"
                      >
                        Visit →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 提示信息 */}
        {favoriteTools.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-900">About Your Favorites</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your favorites are stored locally in your browser. They will persist until you clear your browser data or use a different device.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
