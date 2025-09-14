#!/usr/bin/env npx tsx

import { checkWebsiteValidity } from './importAICollectionWithValidation';

// 测试工具数据
const testTools = [
  { name: 'ChatGPT', website: 'https://chat.openai.com', description: 'AI聊天机器人' },
  { name: 'Dead Link 1', website: 'https://this-website-does-not-exist-12345.com', description: '这是一个死链测试' },
  { name: 'GitHub Copilot', website: 'https://github.com/features/copilot', description: 'AI编程助手' },
  { name: 'Dead Link 2', website: 'https://another-fake-website-999.org', description: '另一个死链测试' },
  { name: 'Google', website: 'https://www.google.com', description: '搜索引擎' },
];

async function testValidation() {
  console.log('🧪 测试导入验证功能...\n');
  
  const results = await Promise.all(
    testTools.map(async (tool) => {
      console.log(`🔍 检测: ${tool.name} (${tool.website})`);
      const result = await checkWebsiteValidity(tool.website);
      
      if (result.isValid) {
        console.log(`   ✅ 有效 (${result.statusCode}) - ${result.responseTime}ms`);
      } else {
        console.log(`   ❌ 无效: ${result.error} - ${result.responseTime}ms`);
      }
      
      return { tool, result };
    })
  );
  
  console.log('\n📊 测试结果总结:');
  const validCount = results.filter(r => r.result.isValid).length;
  const invalidCount = results.length - validCount;
  
  console.log(`   ✅ 有效: ${validCount} 个`);
  console.log(`   ❌ 无效: ${invalidCount} 个`);
  console.log(`   📈 有效率: ${((validCount / results.length) * 100).toFixed(1)}%`);
  
  const avgResponseTime = results.reduce((sum, r) => sum + (r.result.responseTime || 0), 0) / results.length;
  console.log(`   ⏱️  平均响应时间: ${Math.round(avgResponseTime)}ms`);
}

if (require.main === module) {
  testValidation().catch(console.error);
}

export { testValidation };
