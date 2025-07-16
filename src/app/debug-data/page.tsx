'use client';

import { useState, useEffect } from 'react';

export default function DebugDataPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from APIs...');
        
        // 直接调用API
        const [toolsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/tools'),
          fetch('/api/categories')
        ]);

        if (!toolsResponse.ok) {
          throw new Error(`Tools API failed: ${toolsResponse.statusText}`);
        }
        
        if (!categoriesResponse.ok) {
          throw new Error(`Categories API failed: ${categoriesResponse.statusText}`);
        }

        const toolsData = await toolsResponse.json();
        const categoriesData = await categoriesResponse.json();

        console.log('Raw tools data:', toolsData);
        console.log('Raw categories data:', categoriesData);
        
        setTools(toolsData);
        setCategories(categoriesData);
        
        console.log(`Successfully loaded ${toolsData.length} tools and ${categoriesData.length} categories`);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Loading Debug Data...</h1>
        <div className="animate-pulse">Fetching data from APIs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Debug Data Verification</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">Total Tools</h2>
          <p className="text-4xl font-bold text-blue-900">{tools.length}</p>
          <p className="text-sm text-blue-600 mt-2">Expected: 72</p>
        </div>
        
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">Total Categories</h2>
          <p className="text-4xl font-bold text-green-900">{categories.length}</p>
          <p className="text-sm text-green-600 mt-2">Expected: 11</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Sample Tools (First 20)</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tools.slice(0, 20).map((tool, index) => (
              <div key={index} className="flex justify-between py-2 px-3 bg-white rounded border">
                <span className="font-medium">{tool.name}</span>
                <span className="text-sm text-gray-600">{tool.category}</span>
              </div>
            ))}
          </div>
          {tools.length > 20 && (
            <p className="text-center mt-4 text-gray-600">
              ... and {tools.length - 20} more tools
            </p>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">All Tool Names</h3>
        <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {tools.map((tool, index) => (
              <div key={index} className="text-sm py-1 px-2 bg-white rounded border">
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
