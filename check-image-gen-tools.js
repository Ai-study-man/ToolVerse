// 检查Image Generation类别的具体工具
async function checkImageGenTools() {
  try {
    const response = await fetch('http://localhost:3001/api/tools');
    const tools = await response.json();
    
    console.log(`📊 API返回的总工具数量: ${tools.length}`);
    
    // 筛选Image Generation工具
    const imageGenTools = tools.filter(tool => tool.category === 'Image Generation');
    
    console.log(`\n🖼️ Image Generation 类别工具 (${imageGenTools.length} 个):`);
    imageGenTools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   ID: ${tool.id}`);
      console.log(`   描述: ${tool.description?.substring(0, 100)}...`);
      console.log(`   Logo: ${tool.logo}`);
      console.log('');
    });

    // 检查类别API
    const categoriesResponse = await fetch('http://localhost:3001/api/categories');
    const categoriesResult = await categoriesResponse.json();
    
    if (categoriesResult.success) {
      const imageGenCategory = categoriesResult.data.categories.find(cat => cat.name === 'Image Generation');
      if (imageGenCategory) {
        console.log(`📋 类别卡片显示: ${imageGenCategory.toolCount} 个工具`);
        console.log(`🔍 实际发现: ${imageGenTools.length} 个工具`);
        
        if (imageGenCategory.toolCount !== imageGenTools.length) {
          console.log(`⚠️ 数量不匹配!`);
        } else {
          console.log(`✅ 数量匹配`);
        }
      }
    }

  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

const fetch = require('node-fetch');
checkImageGenTools();
