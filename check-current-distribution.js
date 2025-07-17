require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

async function checkDistribution() {
  try {
    console.log('🔍 检查工具分类分布...');
    
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log(`📊 总工具数: ${response.results.length}`);
    
    // 按分类统计
    const categoryCount = {};
    const statusCount = {};
    
    response.results.forEach(page => {
      const category = page.properties.分类?.select?.name || 'No Category';
      const status = page.properties.状态?.status?.name || 'No Status';
      
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    console.log('\n📂 分类分布:');
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} 个工具`);
    });
    
    console.log('\n📈 状态分布:');
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} 个工具`);
    });
    
    console.log(`\n✅ 已完成状态的工具: ${statusCount['已完成'] || 0} 个`);
    console.log(`📋 总分类数: ${Object.keys(categoryCount).filter(cat => cat !== 'No Category').length} 个`);
    
  } catch (error) {
    console.error('❌ 查询失败:', error.message);
  }
}

checkDistribution();
