// 简单测试翻译映射
const tagTranslations = {
  '技术SEO': 'Technical SEO',
  '大规模优化': 'Large-scale Optimization', 
  '自动化营销': 'Marketing Automation',
  '内容创作': 'Content Creation',
  '客户服务': 'Customer Service',
  '商业智能': 'Business Intelligence'
};

function translateUseCases(useCases) {
  return useCases.map(useCase => tagTranslations[useCase] || useCase);
}

// 测试
const testCases = ['技术SEO', '大规模优化', '自动化营销', '未知术语'];
const translated = translateUseCases(testCases);

console.log('原始术语:', testCases);
console.log('翻译结果:', translated);
console.log('翻译映射验证:');
testCases.forEach((term, index) => {
  console.log(`  ${term} -> ${translated[index]}`);
});
