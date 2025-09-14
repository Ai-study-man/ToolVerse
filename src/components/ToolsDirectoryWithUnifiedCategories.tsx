/**
 * Frontend Integration Example for Unified Category System
 * 展示如何在前端组件中使用新的分类系统
 */

import React, { useState, useMemo } from 'react';
import { mapToUnifiedCategory, getCategoryIcon, getCategoriesWithIcons } from '../utils/categoryIcons';

// 工具类型定义
interface Tool {
  id: number;
  name: string;
  description: string;
  category?: string | null;
  url: string;
  // 其他字段...
}

// 示例工具数据
const sampleTools: Tool[] = [
  { id: 1, name: 'ChatGPT', description: 'AI chatbot for conversations', category: 'AI Assistant', url: '#' },
  { id: 2, name: 'DALL-E', description: 'Generate images from text', category: 'Image Generation', url: '#' },
  { id: 3, name: 'GitHub Copilot', description: 'AI pair programming assistant', category: null, url: '#' },
  { id: 4, name: 'Grammarly', description: 'Writing assistant for grammar checking', category: null, url: '#' },
  { id: 5, name: 'Notion AI', description: 'Smart workspace and note-taking', category: null, url: '#' },
  // 更多工具...
];

const ToolsDirectory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // 获取所有11个核心分类
  const allCategories = getCategoriesWithIcons();
  
  // 处理工具分类并过滤
  const processedTools = useMemo(() => {
    return sampleTools.map(tool => ({
      ...tool,
      unifiedCategory: mapToUnifiedCategory(tool)
    }));
  }, []);
  
  // 根据选择的分类过滤工具
  const filteredTools = useMemo(() => {
    if (selectedCategory === 'All') {
      return processedTools;
    }
    return processedTools.filter(tool => tool.unifiedCategory === selectedCategory);
  }, [processedTools, selectedCategory]);
  
  // 计算每个分类的工具数量
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    processedTools.forEach(tool => {
      stats[tool.unifiedCategory] = (stats[tool.unifiedCategory] || 0) + 1;
    });
    return stats;
  }, [processedTools]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 分类导航栏 - 只显示11大类 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">工具分类</h2>
        <div className="flex flex-wrap gap-2">
          {/* 全部分类选项 */}
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🔥 全部 ({processedTools.length})
          </button>
          
          {/* 11个核心分类 */}
          {allCategories.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                selectedCategory === name
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span>{icon}</span>
              <span>{name}</span>
              <span className="text-sm opacity-75">({categoryStats[name] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 工具网格 */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">
          {selectedCategory === 'All' ? '所有工具' : selectedCategory}
          <span className="text-gray-500 ml-2">({filteredTools.length} 个工具)</span>
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {/* 空状态 */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            暂无 "{selectedCategory}" 分类的工具
          </h3>
          <p className="text-gray-500">
            试试选择其他分类或添加新工具
          </p>
        </div>
      )}
    </div>
  );
};

// 工具卡片组件
interface ToolCardProps {
  tool: Tool & { unifiedCategory: string };
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const categoryIcon = getCategoryIcon(tool.unifiedCategory);
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border">
      {/* 工具标题和分类 */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-800 line-clamp-1">
          {tool.name}
        </h4>
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm">
          <span>{categoryIcon}</span>
          <span className="text-gray-600">{tool.unifiedCategory}</span>
        </div>
      </div>
      
      {/* 工具描述 */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {tool.description}
      </p>
      
      {/* 原始分类信息（调试用，生产环境可删除） */}
      {tool.category && tool.category !== tool.unifiedCategory && (
        <div className="text-xs text-gray-400 mb-3">
          原分类: {tool.category} → {tool.unifiedCategory}
        </div>
      )}
      
      {/* 操作按钮 */}
      <div className="flex gap-2">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-4 rounded transition-colors"
        >
          访问工具
        </a>
        <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
          ❤️
        </button>
      </div>
    </div>
  );
};

// 分类统计组件
const CategoryStats: React.FC<{ tools: (Tool & { unifiedCategory: string })[] }> = ({ tools }) => {
  const allCategories = getCategoriesWithIcons();
  
  const stats = useMemo(() => {
    const categoryStats: Record<string, number> = {};
    tools.forEach(tool => {
      categoryStats[tool.unifiedCategory] = (categoryStats[tool.unifiedCategory] || 0) + 1;
    });
    return categoryStats;
  }, [tools]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">分类统计</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allCategories.map(({ name, icon }) => (
          <div key={name} className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="font-medium text-sm">{name}</div>
            <div className="text-lg font-bold text-blue-600">{stats[name] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsDirectory;