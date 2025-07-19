// 检查前端类别卡片显示的工具数量
async function checkCategoryCards() {
  try {
    const response = await fetch('http://localhost:3000/api/categories');
    const result = await response.json();
    
    if (result.success) {
      const categories = result.data.categories;
      console.log(`📊 获取到 ${categories.length} 个类别:\n`);
      
      categories.forEach(category => {
        console.log(`🔸 ${category.name}: ${category.toolCount}个工具`);
      });
      
      // 特别检查Image Generation类别
      const imageGenCategory = categories.find(cat => cat.name.includes('Image Generation'));
      if (imageGenCategory) {
        console.log(`\n🖼️ Image Generation类别详情:`);
        console.log(`显示数量: ${imageGenCategory.toolCount}`);
        console.log(`类别ID: ${imageGenCategory.id}`);
        console.log(`类别Slug: ${imageGenCategory.slug}`);
      } else {
        console.log(`\n❌ 未找到Image Generation类别`);
      }
    } else {
      console.error('❌ 获取类别失败:', result.error);
    }
    
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

const fetch = require('node-fetch');
checkCategoryCards();
