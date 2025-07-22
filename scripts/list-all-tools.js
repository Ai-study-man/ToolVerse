require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

async function listAllTools() {
  try {
    console.log('📋 查询所有工具记录...');
    
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    
    console.log(`\n找到 ${response.results.length} 条记录:\n`);
    
    response.results.forEach((page, index) => {
      const name = page.properties.Name.title[0]?.text?.content || '无名称';
      const status = page.properties['状态']?.status?.name || '无状态';
      const category = page.properties['分类']?.select?.name || '无分类';
      const pricing = page.properties['价格模式']?.select?.name || '无定价';
      const rating = page.properties['评分']?.number || '无评分';
      
      console.log(`${index + 1}. ${name}`);
      console.log(`   - 状态: ${status}`);
      console.log(`   - 分类: ${category}`);
      console.log(`   - 定价: ${pricing}`);
      console.log(`   - 评分: ${rating}`);
      console.log(`   - ID: ${page.id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ 查询记录时出错:', error.message);
  }
}

listAllTools();
