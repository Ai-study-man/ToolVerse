'use client';

import { useState, useEffect } from 'react';
import DataSyncService from '../../lib/dataSyncService';

export default function ToolsTestPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const targetTools = [
    'ChatGPT', 'Claude', 'Google Gemini', 'Perplexity AI', 'DeepSeek',
    'GitHub Copilot', 'Codium AI', 'CodeWhisperer', 'Sourcegraph Cody', 'Tabnine',
    'Midjourney', 'DALL-E 2', 'Stable Diffusion', 'Leonardo AI', 'Canva AI',
    'Grammarly', 'Jasper AI', 'Copy.ai', 'Writesonic', 'QuillBot'
  ];

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const toolsData = await DataSyncService.getTools();
        console.log('Fetched tools:', toolsData.length);
        setTools(toolsData);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const foundTargetTools = targetTools.filter(targetTool =>
    tools.some(tool => tool.name.toLowerCase().includes(targetTool.toLowerCase()))
  );

  const missingTargetTools = targetTools.filter(targetTool =>
    !tools.some(tool => tool.name.toLowerCase().includes(targetTool.toLowerCase()))
  );

  if (loading) {
    return <div className="p-8">Loading tools...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tools Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-800">Total Tools</h2>
          <p className="text-3xl font-bold text-blue-900">{tools.length}</p>
        </div>
        
        <div className="bg-green-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-green-800">Found Target Tools</h2>
          <p className="text-3xl font-bold text-green-900">{foundTargetTools.length}</p>
        </div>
        
        <div className="bg-red-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-red-800">Missing Target Tools</h2>
          <p className="text-3xl font-bold text-red-900">{missingTargetTools.length}</p>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-green-600">Found Target Tools ({foundTargetTools.length})</h3>
          <div className="bg-green-50 p-4 rounded-lg">
            {foundTargetTools.map((tool, index) => (
              <div key={index} className="py-1 text-green-800">
                ✓ {tool}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-red-600">Missing Target Tools ({missingTargetTools.length})</h3>
          <div className="bg-red-50 p-4 rounded-lg">
            {missingTargetTools.map((tool, index) => (
              <div key={index} className="py-1 text-red-800">
                ✗ {tool}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">All Tools ({filteredTools.length})</h3>
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredTools.map((tool, index) => (
              <div key={index} className="text-sm py-2 px-3 bg-white rounded border">
                <div className="font-medium">{tool.name}</div>
                <div className="text-gray-600 text-xs">{tool.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
