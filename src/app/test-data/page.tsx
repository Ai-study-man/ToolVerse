'use client';

import { useState, useEffect } from 'react';
import DataSyncService from '../../lib/dataSyncService';

export default function TestData() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('开始获取数据...');
        
        // 直接使用 DataSyncService 获取数据
        const [categoriesData, toolsData] = await Promise.all([
          DataSyncService.getCategories(),
          DataSyncService.getTools()
        ]);
        
        console.log('类别数据:', categoriesData);
        setCategories(categoriesData || []);
        
        console.log('工具数据:', toolsData);
        setTools(toolsData || []);
        
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">正在加载数据...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">数据测试页面</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">类别 ({categories.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <div key={index} className="border p-4 rounded">
              <div className="text-lg font-medium">{category.icon} {category.name}</div>
              <div className="text-sm text-gray-600">{category.toolCount} 个工具</div>
              <div className="text-xs text-gray-400">{category.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">工具 ({tools.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.slice(0, 12).map((tool, index) => (
            <div key={index} className="border p-4 rounded">
              <div className="font-medium">{tool.name}</div>
              <div className="text-sm text-gray-600">{tool.category}</div>
              <div className="text-xs text-gray-400">{tool.shortDescription}</div>
              <div className="text-xs text-blue-600">{tool.website}</div>
            </div>
          ))}
        </div>
        {tools.length > 12 && (
          <div className="mt-4 text-center text-gray-600">
            还有 {tools.length - 12} 个工具...
          </div>
        )}
      </div>
    </div>
  );
}
