import DataSyncService from '../../../lib/dataSyncService';

// 为静态导出生成预定义的工具ID
export async function generateStaticParams() {
  try {
    // 获取所有工具并生成前50个工具的静态页面
    const tools = await DataSyncService.getTools();
    const params = tools.slice(0, 50).map((tool) => ({
      id: tool.id,
    }));
    
    // 添加一些常见的工具ID作为备选
    const commonIds = ['chatgpt', 'claude', 'midjourney', 'canva', 'notion'];
    commonIds.forEach(id => {
      if (!params.find(p => p.id === id)) {
        params.push({ id });
      }
    });
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    // 如果获取失败，返回一些默认的工具ID
    return [
      { id: 'chatgpt' },
      { id: 'claude' },
      { id: 'midjourney' },
      { id: 'canva' },
      { id: 'notion' }
    ];
  }
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  // 在构建时获取工具数据
  let tool = null;
  try {
    const tools = await DataSyncService.getTools();
    tool = tools.find(t => t.id === params.id);
  } catch (error) {
    console.error('Error fetching tool:', error);
  }

  // 如果工具不存在，显示404页面
  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-6">The requested tool could not be found.</p>
          <a 
            href="/tools"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Tools
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 简化的工具详情页 */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-center mb-6">
            {tool.logo && (
              <img 
                src={tool.logo} 
                alt={tool.name}
                className="w-20 h-20 mx-auto mb-4 rounded-xl object-contain"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
            <p className="text-lg text-gray-600">{tool.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Details</h2>
              <dl className="space-y-2">
                <div>
                  <dt className="font-medium text-gray-500">Category</dt>
                  <dd className="text-gray-900">{tool.category}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Pricing</dt>
                  <dd className="text-gray-900">{tool.pricing}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Rating</dt>
                  <dd className="text-gray-900">{tool.rating}/5.0</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Features</h2>
              <ul className="space-y-1">
                {tool.features?.slice(0, 5).map((feature, index) => (
                  <li key={index} className="text-gray-600">• {feature}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Visit Website
            </a>
            <a
              href="/tools"
              className="inline-block ml-4 bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Back to Tools
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
