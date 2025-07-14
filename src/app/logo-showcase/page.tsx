import ToolLogo from '@/components/ToolLogo';

const allTools = [
  // Conversational AI
  { name: 'ChatGPT', category: 'Conversational AI' },
  { name: 'Claude', category: 'Conversational AI' },
  { name: 'Google Gemini', category: 'Conversational AI' },
  { name: 'Character.AI', category: 'Conversational AI' },
  { name: 'Perplexity AI', category: 'Conversational AI' },
  { name: 'DeepSeek', category: 'Conversational AI' },
  
  // Code Development
  { name: 'GitHub Copilot', category: 'Code Development' },
  { name: 'Tabnine', category: 'Code Development' },
  { name: 'Replit AI', category: 'Code Development' },
  { name: 'Codeium', category: 'Code Development' },
  { name: 'CodeT5', category: 'Code Development' },
  { name: 'CodeT5+', category: 'Code Development' },
  { name: 'CodeWhisperer', category: 'Code Development' },
  { name: 'Amazon CodeWhisperer', category: 'Code Development' },
  { name: 'Blackbox AI', category: 'Code Development' },
  { name: 'Aider', category: 'Code Development' },
  { name: 'Codium AI', category: 'Code Development' },
  { name: 'Sourcegraph Cody', category: 'Code Development' },
  { name: 'Windsurf Editor', category: 'Code Development' },
  
  // Image Generation & Design
  { name: 'DALL-E 2', category: 'Image Generation' },
  { name: 'Midjourney', category: 'Image Generation' },
  { name: 'Stable Diffusion', category: 'Image Generation' },
  { name: 'Leonardo AI', category: 'Design & Art' },
  { name: 'Adobe Firefly', category: 'Design & Art' },
  { name: 'Canva AI', category: 'Design & Art' },
  { name: 'Figma AI', category: 'Design & Art' },
  { name: 'DreamStudio', category: 'Image Generation' },
  { name: 'Flux AI', category: 'Image Generation' },
  { name: 'Ideogram', category: 'Image Generation' },
  { name: 'Imagen 3', category: 'Image Generation' },
  { name: 'Playground AI', category: 'Image Generation' },
  { name: 'Looka', category: 'Design & Art' },
  
  // Productivity
  { name: 'Notion AI', category: 'Business & Analytics' },
  { name: 'Grammarly', category: 'Writing & Content' },
  { name: 'Jasper AI', category: 'Writing & Content' },
  { name: 'Copy.ai', category: 'Writing & Content' },
  { name: 'Calendly AI', category: 'Productivity' },
  { name: 'Krisp', category: 'Productivity' },
  { name: 'Motion', category: 'Productivity' },
  { name: 'Reclaim.ai', category: 'Productivity' },
  { name: 'Zapier AI', category: 'Productivity' },
  { name: 'Otter.ai', category: 'Productivity' },
  
  // Video & Audio
  { name: 'Runway ML', category: 'Video & Audio' },
  { name: 'Synthesia', category: 'Video & Audio' },
  { name: 'Murf AI', category: 'Video & Audio' },
  { name: 'ElevenLabs', category: 'Video & Audio' },
  { name: 'Descript', category: 'Video & Audio' },
  { name: 'Loom AI', category: 'Video & Audio' },
  { name: 'Pictory AI', category: 'Video & Audio' },
  
  // Writing & Content
  { name: 'Writesonic', category: 'Writing & Content' },
  { name: 'Rytr', category: 'Writing & Content' },
  { name: 'QuillBot', category: 'Writing & Content' },
  { name: 'Wordtune', category: 'Writing & Content' },
  { name: 'ContentBot', category: 'Writing & Content' },
  
  // Language & Translation
  { name: 'DeepL', category: 'Language & Translation' },
  { name: 'Google Translate AI', category: 'Language & Translation' },
  { name: 'Linguee', category: 'Language & Translation' },
  
  // Business & Analytics
  { name: 'Tableau AI', category: 'Business & Analytics' },
  { name: 'H2O.ai', category: 'Business & Analytics' },
  { name: 'Crystal', category: 'Business & Analytics' },
  { name: 'Dataiku', category: 'Business & Analytics' },
  { name: 'MonkeyLearn', category: 'Business & Analytics' },
  { name: 'Qlik Sense AI', category: 'Business & Analytics' },
  { name: 'Sisense AI', category: 'Business & Analytics' },
  
  // Marketing & SEO
  { name: 'Alli AI', category: 'Marketing & SEO' },
  { name: 'BrightEdge', category: 'Marketing & SEO' },
  { name: 'Clearscope', category: 'Marketing & SEO' },
  { name: 'ContentKing', category: 'Marketing & SEO' },
  { name: 'Frase', category: 'Marketing & SEO' },
  { name: 'MarketMuse', category: 'Marketing & SEO' },
  { name: 'Semrush AI', category: 'Marketing & SEO' },
  { name: 'Surfer SEO', category: 'Marketing & SEO' },
];

// 按分类分组
const groupedTools = allTools.reduce((acc, tool) => {
  if (!acc[tool.category]) {
    acc[tool.category] = [];
  }
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof allTools>);

export default function LogoShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 AI工具官方Logo展示
          </h1>
          <p className="text-xl text-gray-600">
            展示所有{allTools.length}个AI工具的高质量官方logo
          </p>
        </div>

        {Object.entries(groupedTools).map(([category, tools]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
              📂 {category} ({tools.length}个工具)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
              {tools.map((tool) => (
                <div key={tool.name} className="text-center">
                  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    <ToolLogo 
                      name={tool.name} 
                      size="lg" 
                      className="mx-auto mb-3"
                    />
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {tool.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ✨ Logo功能特性
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="font-semibold text-lg text-blue-600 mb-2">🎯 官方Logo</h4>
                <p className="text-gray-600">
                  使用AI工具的官方高质量logo，确保品牌认知度和专业性
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-green-600 mb-2">🔄 智能备用</h4>
                <p className="text-gray-600">
                  当官方logo不可用时，自动生成美观的备用logo
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-purple-600 mb-2">📱 响应式</h4>
                <p className="text-gray-600">
                  支持多种尺寸（sm/md/lg/xl），适配不同设备和场景
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
