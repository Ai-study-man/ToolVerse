require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

async function checkAllTags() {
  try {
    console.log('🔍 检查所有工具的标签...');
    
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 100
    });
    
    console.log(`\n找到 ${response.results.length} 个工具:\n`);
    
    // 收集所有标签
    const allTags = new Set();
    const chineseTags = new Set();
    
    response.results.forEach((page, index) => {
      const name = page.properties.Name.title[0]?.text?.content || '无名称';
      const tags = page.properties['标签']?.multi_select?.map(tag => tag.name) || [];
      
      if (tags.length > 0) {
        console.log(`${index + 1}. ${name}`);
        console.log(`   - 标签: [${tags.join(', ')}]`);
        
        // 检查是否包含中文字符
        tags.forEach(tag => {
          allTags.add(tag);
          if (/[\u4e00-\u9fa5]/.test(tag)) {
            chineseTags.add(tag);
            console.log(`   ⚠️  中文标签发现: "${tag}"`);
          }
        });
        
        console.log('');
      }
    });
    
    console.log('\n📊 标签统计:');
    console.log(`总标签数: ${allTags.size}`);
    console.log(`中文标签数: ${chineseTags.size}`);
    
    if (chineseTags.size > 0) {
      console.log('\n🇨🇳 所有中文标签:');
      Array.from(chineseTags).sort().forEach(tag => {
        console.log(`  - "${tag}"`);
      });
    }
    
    console.log('\n🌍 所有标签:');
    Array.from(allTags).sort().forEach(tag => {
      const isChinese = /[\u4e00-\u9fa5]/.test(tag);
      console.log(`  ${isChinese ? '🇨🇳' : '🇺🇸'} "${tag}"`);
    });
    
  } catch (error) {
    console.error('❌ 查询标签时出错:', error.message);
  }
}

checkAllTags();
