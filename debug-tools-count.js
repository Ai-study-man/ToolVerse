const fetch = require('node-fetch');

async function checkToolsCount() {
  try {
    console.log('🔍 检查工具数量...');
    
    const response = await fetch('http://localhost:3002/api/tools');
    const tools = await response.json();
    
    console.log('📊 工具总数:', tools.length);
    
    // 检查工具状态分布
    const statusDistribution = {};
    tools.forEach(tool => {
      const status = tool.status || '未知';
      statusDistribution[status] = (statusDistribution[status] || 0) + 1;
    });
    
    console.log('📈 状态分布:', statusDistribution);
    
    // 检查是否有重复的工具
    const uniqueNames = new Set();
    const duplicates = [];
    tools.forEach(tool => {
      if (uniqueNames.has(tool.name)) {
        duplicates.push(tool.name);
      } else {
        uniqueNames.add(tool.name);
      }
    });
    
    console.log('🔄 重复工具:', duplicates.length > 0 ? duplicates : '无');
    console.log('✅ 唯一工具数量:', uniqueNames.size);
    
    // 检查已发布的工具数量
    const publishedTools = tools.filter(tool => 
      tool.status === '已完成' || 
      tool.status === 'published' || 
      tool.status === 'Published' || 
      !tool.status || 
      tool.status === 'complete'
    );
    
    console.log('🎯 已发布工具数量:', publishedTools.length);
    
    // 显示前5个工具的状态
    console.log('\n📝 前5个工具的状态:');
    tools.slice(0, 5).forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} - 状态: "${tool.status}"`);
    });
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

checkToolsCount();
