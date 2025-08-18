// 检查新添加工具的脚本
const fetch = require('node-fetch');

async function checkNewTools() {
  // 等待服务器启动
  console.log('⏳ 等待服务器启动...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  try {
    console.log('🔍 检查新添加的工具...');
    
    const response = await fetch('http://localhost:3001/api/tools');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const tools = await response.json();
    
    console.log('📊 工具总数:', tools.length);
    
    // 新添加的工具名称列表
    const newToolNames = [
      'lovable',
      'bolt.new', 
      'windsurf',
      'v0 by vercel',
      'cursor',
      'reverso',
      'microsoft translator',
      'papago',
      'whisper by openai'
    ];
    
    console.log('\n🔍 查找新添加的工具:');
    const foundTools = [];
    
    newToolNames.forEach(toolName => {
      const tool = tools.find(t => 
        t.name.toLowerCase().includes(toolName.toLowerCase()) ||
        toolName.toLowerCase().includes(t.name.toLowerCase())
      );
      
      if (tool) {
        foundTools.push(tool);
        console.log(`✅ 找到: ${tool.name}`);
        console.log(`   ID: ${tool.id}`);
        console.log(`   URL: /tools/${tool.id}`);
        console.log('');
      } else {
        console.log(`❌ 未找到: ${toolName}`);
      }
    });
    
    console.log(`\n📈 找到 ${foundTools.length}/${newToolNames.length} 个新工具`);
    
    // 检查最近添加的工具（按创建时间排序）
    console.log('\n🕒 最近创建的10个工具:');
    const recentTools = tools
      .filter(tool => tool.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    
    recentTools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name} (${tool.id}) - ${tool.createdAt}`);
    });
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

checkNewTools();
