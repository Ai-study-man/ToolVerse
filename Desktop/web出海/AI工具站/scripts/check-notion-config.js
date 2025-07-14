#!/usr/bin/env node

// Notion 配置检查脚本
// 运行此脚本检查 Notion 集成配置是否正确

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');

async function checkNotionConfig() {
  console.log('🔍 检查 Notion 配置...\n');

  // 1. 检查环境变量
  const token = process.env.NOTION_API_TOKEN;
  const databaseId = process.env.NOTION_TOOLS_DATABASE_ID;

  console.log('📋 环境变量检查:');
  console.log(`✓ NOTION_API_TOKEN: ${token ? token.substring(0, 10) + '...' : '❌ 未设置'}`);
  console.log(`✓ NOTION_TOOLS_DATABASE_ID: ${databaseId ? databaseId.substring(0, 8) + '...' : '❌ 未设置'}\n`);

  if (!token || !databaseId) {
    console.log('❌ 环境变量缺失，请先配置 .env.local 文件');
    process.exit(1);
  }

  // 2. 测试 Notion 连接
  try {
    console.log('🔗 测试 Notion API 连接...');
    const notion = new Client({ auth: token });
    
    // 测试基本连接
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    console.log('✅ Notion API 连接成功');
    console.log(`📚 数据库标题: ${response.title[0]?.plain_text || '未命名'}`);
    console.log(`🔢 数据库 ID: ${response.id}\n`);

    // 3. 检查数据库字段
    console.log('📝 检查数据库字段...');
    const requiredFields = [
      { key: 'Name', type: 'title' },
      { key: '简介', type: 'rich_text' },
      { key: '详细描述', type: 'rich_text' },
      { key: '网址', type: 'url' },
      { key: '标签', type: 'multi_select' },
      { key: '适用场景', type: 'multi_select' },
      { key: '价格模式', type: 'select' },
      { key: '评分', type: 'number' },
      { key: '分类', type: 'select' },
      { key: '状态', type: 'status' }
    ];

    const properties = response.properties;
    const missingFields = [];
    const wrongTypeFields = [];

    for (const field of requiredFields) {
      if (!properties[field.key]) {
        missingFields.push(field.key);
      } else if (properties[field.key].type !== field.type) {
        wrongTypeFields.push({
          name: field.key,
          expected: field.type,
          actual: properties[field.key].type
        });
      } else {
        console.log(`✅ ${field.key} (${field.type})`);
      }
    }

    if (missingFields.length > 0) {
      console.log('\n❌ 缺失字段:');
      missingFields.forEach(field => console.log(`   - ${field}`));
    }

    if (wrongTypeFields.length > 0) {
      console.log('\n⚠️ 字段类型错误:');
      wrongTypeFields.forEach(field => 
        console.log(`   - ${field.name}: 期望 ${field.expected}, 实际 ${field.actual}`)
      );
    }

    // 4. 测试数据查询
    console.log('\n📊 测试数据查询...');
    const queryResponse = await notion.databases.query({
      database_id: databaseId,
      page_size: 3,
      filter: {
        property: '状态',
        status: {
          equals: '进行中'
        }
      }
    });

    console.log(`✅ 查询成功，找到 ${queryResponse.results.length} 条已发布记录`);
    
    if (queryResponse.results.length > 0) {
      console.log('\n📋 示例工具:');
      queryResponse.results.forEach((item, index) => {
        const name = item.properties.Name?.title[0]?.plain_text || '未命名';
        const category = item.properties['分类']?.select?.name || '未分类';
        console.log(`   ${index + 1}. ${name} (${category})`);
      });
    } else {
      console.log('\n💡 提示: 数据库中暂无已发布的工具，可以添加一些示例数据测试');
    }

    console.log('\n🎉 Notion 配置检查完成！');
    
    if (missingFields.length === 0 && wrongTypeFields.length === 0) {
      console.log('✅ 所有配置都正确，网站应该能正常从 Notion 加载数据');
    } else {
      console.log('⚠️ 存在配置问题，请按照上述提示修复');
    }

  } catch (error) {
    console.log('❌ Notion API 测试失败:');
    console.error(error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\n💡 解决方案:');
      console.log('1. 检查 NOTION_API_TOKEN 是否正确');
      console.log('2. 确保集成已被邀请到数据库');
    } else if (error.code === 'object_not_found') {
      console.log('\n💡 解决方案:');
      console.log('1. 检查 NOTION_TOOLS_DATABASE_ID 是否正确');
      console.log('2. 确保数据库存在且可访问');
    }
  }
}

// 运行检查
checkNotionConfig().catch(console.error);
