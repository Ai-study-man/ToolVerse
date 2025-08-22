'use client';

import { memo, useState, useEffect } from 'react';
import { Tool } from '../types';
import OptimizedToolCard from './OptimizedToolCard';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SmartToolGridProps {
  tools: Tool[];
  title?: string;
  itemsPerPage?: number;
  showPagination?: boolean;
  priority?: boolean;
  className?: string;
  emptyStateText?: string;
}

const SmartToolGrid = memo(function SmartToolGrid({
  tools,
  title,
  itemsPerPage = 12,
  showPagination = true,
  priority = false,
  className = "",
  emptyStateText = "No tools found"
}: SmartToolGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(tools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTools = tools.slice(startIndex, endIndex);

  // 重置页面当工具改变时
  useEffect(() => {
    setCurrentPage(1);
  }, [tools]);

  const handlePageChange = async (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    
    setIsLoading(true);
    
    // 添加轻微延迟以提供视觉反馈
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setCurrentPage(page);
    setIsLoading(false);
    
    // 滚动到顶部
    const gridElement = document.getElementById(`tool-grid-${title?.replace(/\s+/g, '-').toLowerCase()}`);
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (tools.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl text-gray-300 mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Tools Found</h3>
        <p className="text-gray-600">{emptyStateText}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="text-sm text-gray-600">
            {tools.length} tool{tools.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* 工具网格 */}
      <div 
        id={`tool-grid-${title?.replace(/\s+/g, '-').toLowerCase()}`}
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
          isLoading ? 'opacity-50 pointer-events-none' : ''
        } transition-opacity duration-150`}
      >
        {currentTools.map((tool, index) => (
          <OptimizedToolCard
            key={tool.id}
            tool={tool}
            priority={priority && currentPage === 1 && index < 4}
            lazy={!priority || currentPage > 1 || index >= 4}
            showStats={true}
          />
        ))}
      </div>

      {/* 分页控件 */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          {/* 上一页 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Previous
          </button>

          {/* 页码 */}
          <div className="flex space-x-1">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  page === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* 下一页 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* 分页信息 */}
      {showPagination && totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, tools.length)} of {tools.length} tools
        </div>
      )}
    </div>
  );
});

SmartToolGrid.displayName = 'SmartToolGrid';

export default SmartToolGrid;
