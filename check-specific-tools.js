require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const targetTools = [
  'Codium AI', 'CodeWhisperer', 'Sourcegraph Cody', 'CodeT5+', 'Aider', 'Windsurf Editor',
  'Krisp', 'Reclaim.ai', 'Motion', 'Zapier AI', 'Calendly AI', 'Otter.ai',
  'DreamStudio', 'Imagen 3', 'Flux AI', 'Ideogram', 'Playground AI',
  'Character.AI', 'Perplexity AI', 'DeepSeek', 'Claude', 'Google Gemini',
  'Linguee', 'Google Translate AI', 'DeepL',
  'ElevenLabs', 'Pictory AI', 'Descript', 'Murf AI', 'Synthesia', 'Loom AI', 'Runway ML',
  'ContentKing', 'Alli AI', 'Frase', 'BrightEdge', 'Clearscope', 'Semrush AI', 'MarketMuse', 'Surfer SEO',
  'Qlik Sense AI', 'H2O.ai', 'Sisense AI', 'Dataiku', 'Crystal', 'MonkeyLearn', 'Tableau AI',
  'Notion AI', 'Amazon CodeWhisperer', 'Codeium', 'Blackbox AI', 'CodeT5', 'Tabnine', 'Replit AI', 'GitHub Copilot',
  'Looka', 'Figma AI', 'Adobe Firefly', 'Leonardo AI', 'Canva AI', 'DALL-E 2', 'Stable Diffusion', 'Midjourney',
  'ContentBot', 'Wordtune', 'Rytr', 'QuillBot', 'Writesonic', 'Grammarly', 'Jasper AI', 'Copy.ai', 'ChatGPT'
];

async function checkSpecificTools() {
  try {
    console.log('检查Notion数据库中的特定工具...\n');
    
    // 获取所有记录
    const response = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DATABASE_ID,
      page_size: 100
    });
    
    console.log(`数据库中总共有 ${response.results.length} 条记录\n`);
    
    const foundTools = [];
    const missingTools = [...targetTools];
    
    response.results.forEach((page) => {
      const name = page.properties.Name?.title?.[0]?.text?.content || '无名称';
      const status = page.properties.状态?.status?.name || '无状态';
      const category = page.properties.分类?.select?.name || '无分类';
      
      // 检查是否是我们要找的工具
      const matchedTool = targetTools.find(tool => 
        tool.toLowerCase() === name.toLowerCase() || 
        name.toLowerCase().includes(tool.toLowerCase()) ||
        tool.toLowerCase().includes(name.toLowerCase())
      );
      
      if (matchedTool) {
        foundTools.push({
          searchName: matchedTool,
          actualName: name,
          status: status,
          category: category
        });
        
        // 从缺失列表中移除
        const index = missingTools.indexOf(matchedTool);
        if (index > -1) {
          missingTools.splice(index, 1);
        }
      }
    });
    
    console.log(`找到的工具 (${foundTools.length}个):`);
    foundTools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.actualName} (搜索: ${tool.searchName}) - 状态: ${tool.status} - 分类: ${tool.category}`);
    });
    
    console.log(`\n未找到的工具 (${missingTools.length}个):`);
    missingTools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool}`);
    });
    
    // 统计状态
    const statusCounts = {};
    foundTools.forEach(tool => {
      statusCounts[tool.status] = (statusCounts[tool.status] || 0) + 1;
    });
    
    console.log('\n找到工具的状态分布:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} 个`);
    });
    
  } catch (error) {
    console.error('检查工具时出错:', error);
  }
}

checkSpecificTools();
