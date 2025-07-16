'use client';

import { useState, useEffect } from 'react';
import DataSyncService from '../../lib/dataSyncService';

export default function DataStatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkData = async () => {
      try {
        const [tools, categories] = await Promise.all([
          DataSyncService.getTools(),
          DataSyncService.getCategories()
        ]);

        const toolsByCategory = tools.reduce((acc: any, tool: any) => {
          const category = tool.category || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        setStatus({
          totalTools: tools.length,
          totalCategories: categories.length,
          toolsByCategory,
          sampleTools: tools.slice(0, 20).map((t: any) => ({ name: t.name, category: t.category })),
          allToolNames: tools.map((t: any) => t.name), // 添加所有工具名称
          sampleCategories: categories.map((c: any) => ({ name: c.name, toolCount: c.toolCount }))
        });
      } catch (error) {
        console.error('Error checking data:', error);
        setStatus({ error: (error as Error).message || 'Unknown error' });
      } finally {
        setLoading(false);
      }
    };

    checkData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading data status...</div>;
  }

  if (status?.error) {
    return <div className="p-8 text-red-600">Error: {status.error}</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Data Status Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">Total Tools</h2>
          <p className="text-3xl font-bold text-blue-900">{status?.totalTools || 0}</p>
        </div>
        
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">Total Categories</h2>
          <p className="text-3xl font-bold text-green-900">{status?.totalCategories || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Tools by Category</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {Object.entries(status?.toolsByCategory || {}).map(([category, count]) => (
              <div key={category} className="flex justify-between py-2 border-b border-gray-200">
                <span>{category}</span>
                <span className="font-semibold">{count as number}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Sample Tools</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {(status?.sampleTools || []).map((tool: any, index: number) => (
              <div key={index} className="py-2 border-b border-gray-200">
                <div className="font-medium">{tool.name}</div>
                <div className="text-sm text-gray-600">{tool.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Categories</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          {(status?.sampleCategories || []).map((category: any, index: number) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-200">
              <span>{category.name}</span>
              <span className="text-sm text-gray-600">Tool Count: {category.toolCount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">All Tools List</h3>
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {(status?.allToolNames || []).map((name: string, index: number) => (
              <div key={index} className="text-sm py-1 px-2 bg-white rounded border">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
