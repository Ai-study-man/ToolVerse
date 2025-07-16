const DataSyncService = require('../src/lib/dataSyncService').DataSyncService;

async function checkDatabaseData() {
  try {
    console.log('正在检查数据库数据...');
    
    // 获取工具数据
    const tools = await DataSyncService.getTools();
    console.log(`\n工具数量: ${tools.length}`);
    
    if (tools.length > 0) {
      console.log('前5个工具:');
      tools.slice(0, 5).forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} (ID: ${tool.id})`);
      });
    }
    
    // 获取分类数据
    const categories = await DataSyncService.getCategories();
    console.log(`\n分类数量: ${categories.length}`);
    
    if (categories.length > 0) {
      console.log('所有分类:');
      categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.name} (工具数: ${category.toolCount})`);
      });
    }
    
    console.log('\n数据检查完成!');
  } catch (error) {
    console.error('检查数据时出错:', error);
  }
}

checkDatabaseData();
