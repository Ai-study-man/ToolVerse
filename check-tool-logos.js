// 检查API中工具的logo配置
async function checkToolLogos() {
  try {
    const response = await fetch('http://localhost:3000/api/tools');
    const tools = await response.json();
    
    const problematicTools = [
      'Worldtune',
      'Stable Diffusion', 
      'Leonardo AI',
      'Looka',
      'CodeT5',
      'Codeium',
      'Notion AI',
      'MonkeyLearn', 
      'Dataiku',
      'Semrush AI',
      'ContentKing',
      'Perplexity AI',
      'Playground AI',
      'Otter.ai',
      'Motion',
      'Reclaim.ai',
      'Krisp',
      'Windsurf',
      'Code T5+',
      'Sourcegraph Cody'
    ];
    
    console.log('🔍 检查API中工具的logo配置:\n');
    
    problematicTools.forEach(toolName => {
      const tool = tools.find(t => t.name === toolName || t.name.includes(toolName.split(' ')[0]));
      
      if (tool) {
        console.log(`🔸 ${tool.name} (ID: ${tool.id}):`);
        console.log(`   Logo URL: ${tool.logo}`);
        console.log(`   Category: ${tool.category}`);
        
        // 检查logo是否是默认生成的SVG
        if (tool.logo.startsWith('data:image/svg+xml')) {
          console.log(`   ⚠️  使用默认SVG logo`);
        } else {
          console.log(`   ✅ 使用官方logo: ${tool.logo}`);
        }
        console.log('');
      } else {
        console.log(`❌ 未找到工具: ${toolName}\n`);
      }
    });
    
    // 查找所有使用默认logo的工具
    const defaultLogoTools = tools.filter(tool => 
      tool.logo.startsWith('data:image/svg+xml')
    );
    
    console.log(`\n📊 总共有 ${defaultLogoTools.length} 个工具使用默认logo:\n`);
    defaultLogoTools.forEach(tool => {
      console.log(`• ${tool.name} (${tool.category})`);
    });
    
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

const fetch = require('node-fetch');
checkToolLogos();
