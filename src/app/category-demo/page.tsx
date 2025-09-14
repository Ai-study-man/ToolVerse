/**
 * 智能分类系统演示页面
 * 展示如何使用 mapToUnifiedCategory 函数
 */

'use client';

import React, { useState, useMemo } from 'react';
import { mapToUnifiedCategory, getCategoryIcon, getCategoriesWithIcons } from '../../utils/categoryIcons';

interface DemoTool {
  name: string;
  description: string;
  category?: string | null;
}

const CategoryDemoPage: React.FC = () => {
  const [newToolName, setNewToolName] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('');
  const [demoTools, setDemoTools] = useState<DemoTool[]>([
    { name: 'ChatGPT', description: 'AI chatbot for conversations and assistance', category: 'AI Assistant' },
    { name: 'GitHub Copilot', description: 'AI pair programming assistant for code completion', category: null },
    { name: 'DALL-E 2', description: 'Generate images from text descriptions using AI', category: 'Image Generation' },
    { name: 'Grammarly', description: 'Writing assistant for grammar and spell checking', category: null },
    { name: 'Notion AI', description: 'Smart workspace for notes and project management', category: null },
    { name: 'Figma', description: 'Collaborative design tool for UI/UX designers', category: null },
    { name: 'Canva', description: 'Easy graphic design platform for social media', category: null },
    { name: 'Loom', description: 'Screen recording tool for video messages', category: null },
    { name: 'Zapier', description: 'Automation platform connecting different apps', category: null },
    { name: 'Calendly', description: 'Scheduling tool for booking meetings', category: null },
  ]);

  const allCategories = getCategoriesWithIcons();

  // 处理工具分类
  const processedTools = useMemo(() => {
    return demoTools.map(tool => {
      const unifiedCategory = mapToUnifiedCategory(tool);
      return {
        ...tool,
        unifiedCategory,
        isSmartMapped: !tool.category || tool.category !== unifiedCategory
      };
    });
  }, [demoTools]);

  // 添加新工具
  const addTool = () => {
    if (newToolName && newToolDescription) {
      const newTool: DemoTool = {
        name: newToolName,
        description: newToolDescription,
        category: newToolCategory || null
      };
      setDemoTools([...demoTools, newTool]);
      setNewToolName('');
      setNewToolDescription('');
      setNewToolCategory('');
    }
  };

  // 统计信息
  const stats = useMemo(() => {
    const categoryStats: Record<string, number> = {};
    const smartMappedCount = processedTools.filter(tool => tool.isSmartMapped).length;
    
    processedTools.forEach(tool => {
      categoryStats[tool.unifiedCategory] = (categoryStats[tool.unifiedCategory] || 0) + 1;
    });

    return { categoryStats, smartMappedCount };
  }, [processedTools]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 标题和说明 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧠 智能分类系统演示
        </h1>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
          <p className="text-blue-800">
            这个演示展示了智能分类系统如何自动将工具分类到11个核心类别中。
            系统首先检查原始分类，然后通过关键词分析工具名称和描述来确定最合适的分类。
          </p>
        </div>
      </div>

      {/* 添加新工具 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🔧 测试智能分类</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              工具名称
            </label>
            <input
              type="text"
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
              placeholder="例如: Adobe Photoshop"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              原始分类 (可选)
            </label>
            <input
              type="text"
              value={newToolCategory}
              onChange={(e) => setNewToolCategory(e.target.value)}
              placeholder="例如: Design Software"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            工具描述
          </label>
          <textarea
            value={newToolDescription}
            onChange={(e) => setNewToolDescription(e.target.value)}
            placeholder="例如: Professional image editing software for photographers and designers"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={addTool}
          disabled={!newToolName || !newToolDescription}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
        >
          添加并测试分类
        </button>
      </div>

      {/* 统计信息 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">📊 分类统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {allCategories.map(({ name, icon }) => (
            <div key={name} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-medium text-sm text-gray-700">{name}</div>
              <div className="text-lg font-bold text-blue-600">
                {stats.categoryStats[name] || 0}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center bg-green-50 p-4 rounded-lg">
          <div className="text-green-800">
            <span className="font-semibold">{stats.smartMappedCount}</span> 个工具通过智能分析获得分类
            <span className="text-sm block mt-1">
              ({((stats.smartMappedCount / processedTools.length) * 100).toFixed(1)}% 智能分类率)
            </span>
          </div>
        </div>
      </div>

      {/* 工具列表 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">🛠️ 工具分类结果</h2>
        <div className="space-y-4">
          {processedTools.map((tool, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                tool.isSmartMapped
                  ? 'border-green-400 bg-green-50'
                  : 'border-blue-400 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{tool.name}</h3>
                    {tool.isSmartMapped && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        智能分类
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
                  
                  {/* 分类信息 */}
                  <div className="flex items-center gap-4 text-sm">
                    {tool.category && (
                      <div className="text-gray-500">
                        原分类: <span className="font-medium">{tool.category}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>最终分类:</span>
                      <span className="flex items-center gap-1 font-medium text-blue-600">
                        {getCategoryIcon(tool.unifiedCategory)}
                        {tool.unifiedCategory}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 说明 */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">💡 工作原理</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>优先级检查</strong>: 首先检查工具是否已有有效的原始分类</li>
          <li>• <strong>关键词分析</strong>: 如果没有原始分类或分类无效，系统分析工具名称和描述中的关键词</li>
          <li>• <strong>加权评分</strong>: 根据关键词权重和长度计算每个分类的匹配分数</li>
          <li>• <strong>智能匹配</strong>: 选择得分最高的分类，确保每个工具都有合适的分类</li>
          <li>• <strong>11大核心类别</strong>: 所有工具都被归类到预定义的11个主要类别中</li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryDemoPage;