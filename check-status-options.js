require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

async function checkStatusOptions() {
  try {
    console.log('🔍 检查数据库字段配置...');
    
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    const statusProperty = response.properties['状态'];
    
    if (statusProperty && statusProperty.type === 'status') {
      console.log('\n📊 状态字段的可用选项:');
      statusProperty.status.options.forEach((option, index) => {
        console.log(`   ${index + 1}. ${option.name} (${option.color})`);
      });
      
      console.log('\n🎯 可以使用的状态名称:');
      const validStatuses = statusProperty.status.options.map(opt => opt.name);
      console.log(validStatuses);
      
    } else {
      console.log('❌ 找不到状态字段或字段类型不正确');
    }
    
  } catch (error) {
    console.error('❌ 查询失败:', error.message);
  }
}

checkStatusOptions();
