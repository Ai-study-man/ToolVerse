require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

async function checkAllRecords() {
  try {
    console.log('检查 Notion 数据库中的所有记录...\n');
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DATABASE_ID,
      page_size: 100
    });
    
    console.log(`总共找到 ${response.results.length} 条记录\n`);
    
    const statusCounts = {};
    
    response.results.forEach((page, index) => {
      const name = page.properties.Name?.title?.[0]?.text?.content || '无名称';
      const status = page.properties.状态?.status?.name || '无状态';
      
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      
      if (index < 10) {
        console.log(`${index + 1}. ${name} - 状态: ${status}`);
      }
    });
    
    console.log('\n状态统计:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} 条`);
    });
    
    // 查询只获取已发布的
    const publishedResponse = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DATABASE_ID,
      filter: {
        property: '状态',
        status: {
          equals: '已发布'
        }
      }
    });
    
    console.log(`\n已发布的记录: ${publishedResponse.results.length} 条`);
    
  } catch (error) {
    console.error('检查记录时出错:', error);
  }
}

checkAllRecords();
