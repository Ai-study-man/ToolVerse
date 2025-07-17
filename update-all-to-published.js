require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

async function updateAllToPublished() {
  try {
    console.log('🔍 获取所有记录...');
    
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log(`📊 找到 ${response.results.length} 条记录`);
    
    let updateCount = 0;
    
    for (const page of response.results) {
      const currentStatus = page.properties.状态?.status?.name;
      
      if (currentStatus !== '已发布') {
        try {
          await notion.pages.update({
            page_id: page.id,
            properties: {
              '状态': {
                status: {
                  name: '已发布'
                }
              }
            }
          });
          
          updateCount++;
          const name = page.properties.Name?.title?.[0]?.text?.content || 'No Name';
          console.log(`✅ 更新 ${updateCount}: ${name} -> 已发布`);
          
          // 添加延迟避免API限制
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          const name = page.properties.Name?.title?.[0]?.text?.content || 'No Name';
          console.error(`❌ 更新失败 ${name}:`, error.message);
        }
      }
    }
    
    console.log(`\n🎉 更新完成！总共更新了 ${updateCount} 条记录为"已发布"状态`);
    
  } catch (error) {
    console.error('❌ 操作失败:', error.message);
  }
}

updateAllToPublished();
