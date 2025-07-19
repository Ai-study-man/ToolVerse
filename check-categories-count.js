// 检查工具数量和类别映射
const fs = require('fs');
const path = require('path');

// 读取mockData.ts文件
const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.ts');
const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// 提取工具数组
const toolsMatch = mockDataContent.match(/export const allTools: Tool\[\] = \[([\s\S]*?)\];/);
if (!toolsMatch) {
  console.log('❌ 无法找到工具数据');
  process.exit(1);
}

// 解析工具数据
const toolsContent = toolsMatch[1];
const toolObjects = [];

// 简单解析每个工具对象
const toolStrings = toolsContent.split(/},\s*{/);
toolStrings.forEach((toolStr, index) => {
  if (index === 0) toolStr = toolStr.replace(/^\s*{/, '');
  if (index === toolStrings.length - 1) toolStr = toolStr.replace(/}\s*$/, '');
  
  // 提取工具信息
  const nameMatch = toolStr.match(/name:\s*['"`]([^'"`]+)['"`]/);
  const categoryMatch = toolStr.match(/category:\s*['"`]([^'"`]+)['"`]/);
  const subcategoryMatch = toolStr.match(/subcategory:\s*['"`]([^'"`]+)['"`]/);
  
  if (nameMatch && categoryMatch) {
    toolObjects.push({
      name: nameMatch[1],
      category: categoryMatch[1],
      subcategory: subcategoryMatch ? subcategoryMatch[1] : null
    });
  }
});

console.log(`📊 总工具数量: ${toolObjects.length}\n`);

// 按类别分组统计
const categoryStats = {};
toolObjects.forEach(tool => {
  const category = tool.category;
  if (!categoryStats[category]) {
    categoryStats[category] = {
      count: 0,
      tools: []
    };
  }
  categoryStats[category].count++;
  categoryStats[category].tools.push({
    name: tool.name,
    subcategory: tool.subcategory
  });
});

console.log('📈 按类别统计工具数量:\n');
Object.entries(categoryStats).sort(([,a], [,b]) => b.count - a.count).forEach(([category, stats]) => {
  console.log(`🔸 ${category}: ${stats.count}个工具`);
  stats.tools.forEach(tool => {
    const subcategoryInfo = tool.subcategory ? ` (${tool.subcategory})` : '';
    console.log(`   • ${tool.name}${subcategoryInfo}`);
  });
  console.log('');
});

// 特别检查Image Generation相关工具
console.log('🖼️ Image Generation 相关工具:\n');
const imageGenTools = toolObjects.filter(tool => 
  tool.category === 'Image Generation' || 
  tool.subcategory === 'Image Generation' ||
  tool.name.toLowerCase().includes('image') ||
  tool.name.toLowerCase().includes('midjourney') ||
  tool.name.toLowerCase().includes('dall-e') ||
  tool.name.toLowerCase().includes('stable diffusion')
);

imageGenTools.forEach(tool => {
  console.log(`• ${tool.name} (${tool.category}${tool.subcategory ? ' / ' + tool.subcategory : ''})`);
});

console.log(`\n总计发现 ${imageGenTools.length} 个图像生成相关工具`);

// 检查是否有中文描述
console.log('\n🔍 检查中文描述:\n');
const chineseRegex = /[\u4e00-\u9fff]/;
let chineseCount = 0;

// 检查description和shortDescription
const descMatches = toolsContent.match(/(?:description|shortDescription):\s*['"`]([^'"`]+)['"`]/g) || [];
descMatches.forEach(match => {
  const desc = match.split(/['"`]/)[1];
  if (chineseRegex.test(desc)) {
    console.log(`❌ 发现中文描述: ${desc}`);
    chineseCount++;
  }
});

if (chineseCount === 0) {
  console.log('✅ 未发现中文描述');
} else {
  console.log(`\n总计发现 ${chineseCount} 个中文描述`);
}
