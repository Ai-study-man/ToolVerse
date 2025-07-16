import { allTools, categories } from '../src/data/mockData';

console.log('=== 数据库数据检查 ===');
console.log(`工具数量: ${allTools.length}`);
console.log(`分类数量: ${categories.length}`);

console.log('\n=== 分类详情 ===');
categories.forEach((category, index) => {
  console.log(`${index + 1}. ${category.name} (${category.slug}) - 工具数: ${category.toolCount}`);
});

console.log('\n=== 前10个工具 ===');
allTools.slice(0, 10).forEach((tool, index) => {
  console.log(`${index + 1}. ${tool.name} (ID: ${tool.id}) - 分类: ${tool.category}`);
});

if (allTools.length > 10) {
  console.log(`\n... 还有 ${allTools.length - 10} 个工具`);
}

console.log('\n=== 按分类统计工具数量 ===');
const toolsByCategory = allTools.reduce((acc, tool) => {
  acc[tool.category] = (acc[tool.category] || 0) + 1;
  return acc;
}, {});

Object.entries(toolsByCategory).forEach(([category, count]) => {
  console.log(`${category}: ${count} 个工具`);
});
