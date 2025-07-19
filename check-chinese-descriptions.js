// 详细检查工具的中文描述
async function checkChineseDescriptions() {
  try {
    const response = await fetch('http://localhost:3000/api/tools');
    const tools = await response.json();
    
    console.log(`📊 总工具数: ${tools.length}\n`);
    
    const targetCategories = [
      'Development',
      'Marketing & SEO', 
      'Business & Analytics',
      'Video & Audio',
      'Language & Translation',
      'Image Generation'
    ];
    
    const chineseRegex = /[\u4e00-\u9fff]/;
    let foundChineseTools = [];
    
    tools.forEach(tool => {
      const hasChineseShort = chineseRegex.test(tool.shortDescription || '');
      const hasChineseDescription = chineseRegex.test(tool.description || '');
      
      if (hasChineseShort || hasChineseDescription) {
        foundChineseTools.push({
          name: tool.name,
          category: tool.category,
          shortDescription: tool.shortDescription,
          description: tool.description
        });
      }
    });
    
    if (foundChineseTools.length === 0) {
      console.log('✅ 没有发现中文描述的工具');
      return;
    }
    
    console.log(`❌ 发现 ${foundChineseTools.length} 个包含中文描述的工具:\n`);
    
    foundChineseTools.forEach(tool => {
      console.log(`🔸 工具名: ${tool.name}`);
      console.log(`   类别: ${tool.category}`);
      
      if (chineseRegex.test(tool.shortDescription || '')) {
        console.log(`   ❌ 短描述(中文): ${tool.shortDescription}`);
      }
      
      if (chineseRegex.test(tool.description || '')) {
        console.log(`   ❌ 详细描述(中文): ${tool.description.substring(0, 100)}...`);
      }
      console.log('');
    });
    
    // 按类别分组显示
    const categoryGroups = {};
    foundChineseTools.forEach(tool => {
      if (!categoryGroups[tool.category]) {
        categoryGroups[tool.category] = [];
      }
      categoryGroups[tool.category].push(tool);
    });
    
    console.log('📊 按类别统计中文工具:\n');
    Object.entries(categoryGroups).forEach(([category, tools]) => {
      console.log(`${category}: ${tools.length}个工具`);
      tools.forEach(tool => {
        console.log(`   • ${tool.name}`);
      });
    });
    
  } catch (error) {
    console.error('❌ 检查失败:', error.message);
  }
}

const fetch = require('node-fetch');
checkChineseDescriptions();
