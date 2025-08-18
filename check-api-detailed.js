// 使用原生fetch和setTimeout来模拟延迟
async function checkAPI() {
  console.log('🔍 等待服务器启动...');
  
  // 等待5秒让服务器完全启动
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    console.log('🚀 开始检查API...');
    
    const response = await fetch('http://localhost:3002/api/tools');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const tools = await response.json();
    
    console.log('📊 API返回工具数量:', tools.length);
    
    // 分析状态分布
    const statusCounts = {};
    tools.forEach(tool => {
      const status = tool.status || 'undefined';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log('📈 状态分布:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count} 个工具`);
    });
    
    // 检查是否有工具被意外过滤
    const validTools = tools.filter(tool => 
      tool.name && 
      tool.description && 
      tool.url
    );
    
    console.log('✅ 有效工具数量:', validTools.length);
    console.log('❌ 无效工具数量:', tools.length - validTools.length);
    
    // 显示一些工具名称样本
    console.log('\n📝 前10个工具名称:');
    tools.slice(0, 10).forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (状态: ${tool.status || '未设置'})`);
    });
    
  } catch (error) {
    console.error('❌ 检查API时出错:', error.message);
  }
}

// 使用全局的 fetch（如果可用）或者要求安装 node-fetch
if (typeof fetch === 'undefined') {
  console.log('请先安装 node-fetch: npm install node-fetch');
  process.exit(1);
}

checkAPI();
