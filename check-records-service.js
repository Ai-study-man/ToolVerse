const { NotionToolsService } = require('./src/lib/notionService');

async function checkAllRecords() {
  try {
    console.log('检查 Notion 数据库中的所有记录...\n');
    
    // 获取所有工具（包括未发布的）
    const allTools = await NotionToolsService.getAllTools();
    console.log(`总共找到 ${allTools.length} 个工具\n`);
    
    // 获取已发布的工具
    const publishedTools = await NotionToolsService.getAllPublishedTools();
    console.log(`已发布的工具: ${publishedTools.length} 个\n`);
    
    // 显示前10个工具
    console.log('前10个工具:');
    allTools.slice(0, 10).forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} - 分类: ${tool.category || '未分类'}`);
    });
    
    if (publishedTools.length > 0) {
      console.log('\n已发布的工具:');
      publishedTools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name} - 分类: ${tool.category || '未分类'}`);
      });
    }
    
  } catch (error) {
    console.error('检查记录时出错:', error);
  }
}

checkAllRecords();
