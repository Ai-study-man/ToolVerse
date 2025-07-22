require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

async function findNewTools() {
  try {
    console.log('🔍 查找新添加的工具...');
    
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: 'Name',
            title: {
              equals: 'Chatsimple',
            },
          },
          {
            property: 'Name', 
            title: {
              equals: 'Frase',
            },
          },
          {
            property: 'Name',
            title: {
              equals: 'Murf AI',
            },
          },
        ],
      },
    });
    
    console.log(`\n找到 ${response.results.length} 个匹配的工具:\n`);
    
    response.results.forEach((page, index) => {
      const name = page.properties.Name.title[0]?.text?.content || '无名称';
      const website = page.properties['网址']?.url || '无网址';
      
      console.log(`${index + 1}. ${name}`);
      console.log(`   - Notion ID: ${page.id}`);
      console.log(`   - 网址: ${website}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ 查询工具时出错:', error.message);
  }
}

findNewTools();
