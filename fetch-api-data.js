// 通过API获取实际工具数据
async function fetchToolData() {
  try {
    // 获取工具数据
    const toolsResponse = await fetch('http://localhost:3000/api/tools');
    const tools = await toolsResponse.json();
    
    console.log(`📊 API返回的总工具数量: ${tools.length}\n`);
    
    // 按类别统计
    const categoryStats = {};
    tools.forEach(tool => {
      const category = tool.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          count: 0,
          tools: [],
          chineseDescriptions: []
        };
      }
      categoryStats[category].count++;
      categoryStats[category].tools.push(tool.name);
      
      // 检查中文描述
      const chineseRegex = /[\u4e00-\u9fff]/;
      if (chineseRegex.test(tool.shortDescription || '')) {
        categoryStats[category].chineseDescriptions.push({
          name: tool.name,
          description: tool.shortDescription
        });
      }
      if (chineseRegex.test(tool.description || '')) {
        categoryStats[category].chineseDescriptions.push({
          name: tool.name,
          description: tool.description
        });
      }
    });
    
    console.log('📈 按类别统计 (来自API):\n');
    
    // 按需要的顺序显示相关类别
    const targetCategories = [
      'Development - AI Tools',
      'Marketing & SEO - AI Tools', 
      'Business & Analytics - AI Tools',
      'Video & Audio - AI Tools',
      'Language & Translation - AI Tools',
      'Image Generation - AI Tools'
    ];
    
    targetCategories.forEach(category => {
      if (categoryStats[category]) {
        const stats = categoryStats[category];
        console.log(`🔸 ${category}: ${stats.count}个工具`);
        stats.tools.forEach(tool => {
          console.log(`   • ${tool}`);
        });
        
        if (stats.chineseDescriptions.length > 0) {
          console.log(`   ❌ 发现${stats.chineseDescriptions.length}个中文描述:`);
          stats.chineseDescriptions.forEach(item => {
            console.log(`      - ${item.name}: ${item.description.substring(0, 50)}...`);
          });
        }
        console.log('');
      }
    });
    
    // 显示所有类别
    console.log('🗂️ 所有类别:\n');
    Object.entries(categoryStats).sort(([,a], [,b]) => b.count - a.count).forEach(([category, stats]) => {
      console.log(`${category}: ${stats.count}个工具`);
    });
    
    // 特别检查Image Generation
    const imageGenCategory = 'Image Generation - AI Tools';
    if (categoryStats[imageGenCategory]) {
      console.log(`\n🖼️ ${imageGenCategory} 详情:`);
      console.log(`实际工具数: ${categoryStats[imageGenCategory].count}`);
      console.log(`工具列表: ${categoryStats[imageGenCategory].tools.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ 获取API数据失败:', error.message);
  }
}

// Node.js环境下需要使用node-fetch
const fetch = require('node-fetch');
fetchToolData();
