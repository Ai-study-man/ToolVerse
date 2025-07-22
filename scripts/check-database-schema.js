require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

async function checkDatabaseSchema() {
  try {
    console.log('🔍 检查数据库结构...');
    
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    
    // 查看状态字段的选项
    const statusProperty = database.properties['状态'];
    if (statusProperty && statusProperty.status) {
      console.log('\n📊 状态字段可用选项:');
      statusProperty.status.options.forEach(option => {
        console.log(`  - ${option.name} (${option.color})`);
      });
    }
    
    // 查看分类字段的选项
    const categoryProperty = database.properties['分类'];
    if (categoryProperty && categoryProperty.select) {
      console.log('\n📁 分类字段可用选项:');
      categoryProperty.select.options.forEach(option => {
        console.log(`  - ${option.name} (${option.color})`);
      });
    }
    
    // 查看价格模式字段的选项
    const pricingProperty = database.properties['价格模式'];
    if (pricingProperty && pricingProperty.select) {
      console.log('\n💰 价格模式字段可用选项:');
      pricingProperty.select.options.forEach(option => {
        console.log(`  - ${option.name} (${option.color})`);
      });
    }
    
  } catch (error) {
    console.error('❌ 检查数据库结构时出错:', error.message);
  }
}

checkDatabaseSchema();
