// 测试特定工具的logo
async function testSpecificLogos() {
  try {
    const response = await fetch('http://localhost:3000/api/tools');
    const tools = await response.json();
    
    const testTools = [
      'Stable Diffusion', 'Leonardo AI', 'Looka', 'CodeT5', 'Codeium',
      'Notion AI', 'MonkeyLearn', 'Dataiku', 'Semrush AI', 'ContentKing',
      'Perplexity AI', 'Playground AI', 'Otter.ai', 'Motion', 'Reclaim.ai',
      'Krisp', 'Windsurf Editor', 'CodeT5+', 'Sourcegraph Cody'
    ];
    
    console.log('🔍 测试特定工具的logo配置:\n');
    
    testTools.forEach(toolName => {
      const tool = tools.find(t => t.name === toolName || t.name.includes(toolName.split(' ')[0]));
      
      if (tool) {
        console.log(`✅ ${tool.name}:`);
        console.log(`   Logo: ${tool.logo}`);
        console.log(`   Category: ${tool.category}`);
        
        if (tool.logo.startsWith('data:image/svg+xml')) {
          console.log(`   ⚠️  仍在使用默认SVG`);
        } else {
          console.log(`   🎯 使用指定logo`);
        }
      } else {
        console.log(`❌ 未找到工具: ${toolName}`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

const fetch = require('node-fetch');
testSpecificLogos();
