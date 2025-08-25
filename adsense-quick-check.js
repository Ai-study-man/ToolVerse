// 简化版 AdSense 诊断脚本
const fs = require('fs');

console.log('🔍 AdSense 问题快速诊断...\n');

// 检查主要配置文件
const adConfigPath = 'src/lib/adConfig.ts';
if (fs.existsSync(adConfigPath)) {
  const content = fs.readFileSync(adConfigPath, 'utf8');
  
  console.log('1️⃣ AdSense 配置检查:');
  
  // 检查客户端ID
  const clientMatch = content.match(/CLIENT_ID:\s*['"`]([^'"`]+)['"`]/);
  if (clientMatch) {
    console.log(`   ✅ 客户端ID: ${clientMatch[1]}`);
  }
  
  // 检查是否使用示例广告位
  if (content.includes('1234567890')) {
    console.log('   ❌ 发现示例广告位ID (1234567890)');
    console.log('   ⚠️  需要在Google AdSense中创建真实广告位');
  }
  
  // 检查测试模式
  if (content.includes("process.env.NODE_ENV === 'development'")) {
    console.log('   ⚠️  测试模式：开发环境下可能限制广告显示');
  }
}

// 检查ads.txt
console.log('\n2️⃣ ads.txt 检查:');
const adsPath = 'public/ads.txt';
if (fs.existsSync(adsPath)) {
  const adsContent = fs.readFileSync(adsPath, 'utf8').trim();
  console.log('   ✅ ads.txt 存在');
  console.log(`   内容: ${adsContent}`);
  
  if (adsContent.includes('pub-4372695356377122')) {
    console.log('   ✅ 客户端ID匹配');
  }
} else {
  console.log('   ❌ ads.txt 不存在');
}

console.log('\n3️⃣ 可能的问题原因:');
console.log('   🔸 使用了示例广告位ID而非真实ID');
console.log('   🔸 开发模式下测试限制');
console.log('   🔸 AdSense账户可能被暂停或限制');
console.log('   🔸 网站政策违规导致广告被停用');
console.log('   🔸 浏览器广告拦截器');
console.log('   🔸 AdSense需要时间审核新广告位');

console.log('\n💡 立即解决方案:');
console.log('   1. 登录Google AdSense控制台检查账户状态');
console.log('   2. 创建真实的广告位ID替换示例ID');
console.log('   3. 检查是否有政策违规通知');
console.log('   4. 在生产环境测试（非localhost）');
console.log('   5. 禁用浏览器广告拦截器测试');
