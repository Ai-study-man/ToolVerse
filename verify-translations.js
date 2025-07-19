// 验证翻译效果
async function verifyTranslations() {
  try {
    const response = await fetch('http://localhost:3000/api/tools');
    const tools = await response.json();
    
    console.log(`📊 总工具数: ${tools.length}\n`);
    
    // 检查特定类别的工具是否已翻译
    const targetCategories = [
      'Development',
      'Business & Analytics',
      'Marketing & SEO',
      'Video & Audio',
      'Language & Translation'
    ];
    
    targetCategories.forEach(category => {
      console.log(`🔸 ${category} 类别工具:`);
      const categoryTools = tools.filter(tool => tool.category === category);
      
      categoryTools.slice(0, 3).forEach(tool => { // 只显示前3个工具
        console.log(`   • ${tool.name}:`);
        console.log(`     短描述: ${tool.shortDescription.substring(0, 80)}...`);
        console.log(`     详细描述: ${tool.description.substring(0, 100)}...`);
      });
      console.log('');
    });
    
    // 特别检查Image Generation类别
    console.log('🖼️ Image Generation 类别详情:');
    const imageGenTools = tools.filter(tool => tool.category === 'Image Generation');
    console.log(`实际工具数: ${imageGenTools.length}`);
    
    imageGenTools.forEach(tool => {
      console.log(`   • ${tool.name}: ${tool.shortDescription}`);
    });
    
  } catch (error) {
    console.error('❌ 验证失败:', error.message);
  }
}

const fetch = require('node-fetch');
verifyTranslations();
