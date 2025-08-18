// 验证新工具的存在和状态
console.log('开始验证新添加的9个工具...\n');

const targetTools = [
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

async function verifyNewTools() {
  try {
    console.log('🔍 开始检查API数据...');
    
    // 获取API数据
    const response = await fetch('http://localhost:3001/api/tools');
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`📊 API返回数据: ${data.tools?.length || 0} 个工具, ${data.categories?.length || 0} 个分类`);
    
    if (!data.tools || !Array.isArray(data.tools)) {
      console.error('❌ API返回的工具数据格式无效');
      return;
    }
    
    const tools = data.tools;
    console.log('\n🔍 搜索新添加的工具...');
    
    let foundCount = 0;
    let missingCount = 0;
    
    targetTools.forEach((targetName, index) => {
      console.log(`\n${index + 1}. 搜索: "${targetName}"`);
      
      // 多种匹配方式
      const exactMatch = tools.find(tool => 
        tool.name?.toLowerCase() === targetName.toLowerCase()
      );
      
      const containsMatch = tools.find(tool => 
        tool.name?.toLowerCase().includes(targetName.toLowerCase())
      );
      
      const fuzzyMatch = tools.find(tool => {
        const toolName = tool.name?.toLowerCase().replace(/[^\w\s]/g, '');
        const searchName = targetName.toLowerCase().replace(/[^\w\s]/g, '');
        return toolName?.includes(searchName) || searchName.includes(toolName);
      });
      
      if (exactMatch) {
        console.log(`   ✅ 精确匹配: "${exactMatch.name}" (ID: ${exactMatch.id})`);
        console.log(`      状态: ${exactMatch.status || '未知'}`);
        console.log(`      分类: ${exactMatch.category || '未知'}`);
        foundCount++;
      } else if (containsMatch) {
        console.log(`   🔸 包含匹配: "${containsMatch.name}" (ID: ${containsMatch.id})`);
        console.log(`      状态: ${containsMatch.status || '未知'}`);
        foundCount++;
      } else if (fuzzyMatch) {
        console.log(`   🔹 模糊匹配: "${fuzzyMatch.name}" (ID: ${fuzzyMatch.id})`);
        console.log(`      状态: ${fuzzyMatch.status || '未知'}`);
        foundCount++;
      } else {
        console.log(`   ❌ 未找到`);
        missingCount++;
      }
    });
    
    console.log(`\n📈 检查结果:`);
    console.log(`   ✅ 找到: ${foundCount} 个工具`);
    console.log(`   ❌ 缺失: ${missingCount} 个工具`);
    
    if (missingCount > 0) {
      console.log('\n🔍 显示所有工具名称以便手动查找:');
      tools.forEach((tool, index) => {
        if (index < 10) { // 只显示前10个作为样本
          console.log(`   ${index + 1}. "${tool.name}" (ID: ${tool.id})`);
        }
      });
      
      if (tools.length > 10) {
        console.log(`   ... 还有 ${tools.length - 10} 个工具`);
      }
    }
    
  } catch (error) {
    console.error('❌ 验证过程中出错:', error.message);
    console.error('详细错误:', error);
  }
}

verifyNewTools();
