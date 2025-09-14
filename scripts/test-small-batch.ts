import { main } from './fetch-pricing';
require('dotenv').config({ path: '.env.local' });

// 临时修改并发数为测试模式
process.env.TEST_MODE = 'true';
process.env.TEST_LIMIT = '5';

console.log('🧪 运行小规模测试 (5个工具)...\n');

main().then(() => {
  console.log('✅ 小规模测试完成！');
}).catch(error => {
  console.error('❌ 测试失败:', error);
});