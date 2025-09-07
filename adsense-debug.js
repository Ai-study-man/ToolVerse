// AdSense 问题诊断脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 AdSense 问题诊断开始...\n');

// 1. 检查 ads.txt 文件
console.log('1️⃣ 检查 ads.txt 文件:');
const adsPath = path.join(__dirname, 'public', 'ads.txt');
if (fs.existsSync(adsPath)) {
  const adsContent = fs.readFileSync(adsPath, 'utf8');
  console.log('✅ ads.txt 文件存在');
  console.log('内容:', adsContent.trim());
} else {
  console.log('❌ ads.txt 文件不存在');
}

// 2. 检查 AdSense 配置
console.log('\n2️⃣ 检查 AdSense 配置:');
const adConfigPath = path.join(__dirname, 'src', 'lib', 'adConfig.ts');
if (fs.existsSync(adConfigPath)) {
  const adConfigContent = fs.readFileSync(adConfigPath, 'utf8');
  
  // 提取客户端ID
  const clientIdMatch = adConfigContent.match(/CLIENT_ID:\s*['"`]([^'"`]+)['"`]/);
  if (clientIdMatch) {
    console.log('✅ AdSense 客户端ID:', clientIdMatch[1]);
  }
  
  // 检查测试模式
  const testModeMatch = adConfigContent.match(/TEST_MODE:\s*([^,\n]+)/);
  if (testModeMatch) {
    console.log('⚠️  测试模式设置:', testModeMatch[1].trim());
  }
  
  // 检查广告位配置
  const adSlotsMatch = adConfigContent.match(/AD_SLOTS:\s*\{([^}]+)\}/);
  if (adSlotsMatch) {
    console.log('📋 广告位配置:');
    const slots = adSlotsMatch[1];
    const slotMatches = slots.match(/(\w+):\s*['"`]([^'"`]+)['"`]/g);
    if (slotMatches) {
      slotMatches.forEach(slot => {
        const [, name, id] = slot.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
        console.log(`   ${name}: ${id}`);
      });
    }
  }
} else {
  console.log('❌ adConfig.ts 文件不存在');
}

// 3. 检查布局文件中的 AdSense 脚本
console.log('\n3️⃣ 检查 AdSense 脚本加载:');
const layoutPath = path.join(__dirname, 'src', 'app', 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  const adsenseScriptMatch = layoutContent.match(/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=([^"']+)/);
  if (adsenseScriptMatch) {
    console.log('✅ AdSense 脚本已配置');
    console.log('   客户端ID:', adsenseScriptMatch[1]);
  } else {
    console.log('❌ AdSense 脚本未找到');
  }
  
  // 检查 meta 标签
  const metaMatch = layoutContent.match(/google-adsense-account['"]\s*:\s*['"`]([^'"`]+)['"`]/);
  if (metaMatch) {
    console.log('✅ AdSense meta 标签已配置');
    console.log('   账户ID:', metaMatch[1]);
  }
} else {
  console.log('❌ layout.tsx 文件不存在');
}

// 4. 检查广告组件使用情况
console.log('\n4️⃣ 检查广告组件使用:');
const pagesDir = path.join(__dirname, 'src', 'app');
const componentUsage = [];

function searchForAdComponents(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    if (file.isDirectory()) {
      searchForAdComponents(path.join(dir, file.name));
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      const filePath = path.join(dir, file.name);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const adImports = content.match(/import.*(?:HeaderBanner|ContentBanner|SidebarBanner|FooterBanner|AdBanner)/);
      const adUsage = content.match(/<(?:HeaderBanner|ContentBanner|SidebarBanner|FooterBanner|AdBanner)/g);
      
      if (adImports || adUsage) {
        componentUsage.push({
          file: filePath.replace(__dirname, '').replace(/\\/g, '/'),
          imports: !!adImports,
          usage: adUsage ? adUsage.length : 0
        });
      }
    }
  });
}

searchForAdComponents(pagesDir);

if (componentUsage.length > 0) {
  console.log('✅ 找到广告组件使用:');
  componentUsage.forEach(usage => {
    console.log(`   ${usage.file}: ${usage.usage} 个广告位`);
  });
} else {
  console.log('❌ 未找到广告组件使用');
}

// 5. 常见问题检查
console.log('\n5️⃣ 常见问题检查:');

// 检查是否在开发模式
if (process.env.NODE_ENV === 'development') {
  console.log('⚠️  当前处于开发模式 - 可能影响广告显示');
}

// 检查广告位ID是否为示例ID
const adConfigContent = fs.readFileSync(adConfigPath, 'utf8');
if (adConfigContent.includes('1234567890') || adConfigContent.includes('示例slot')) {
  console.log('❌ 使用的是示例广告位ID - 需要在Google AdSense中创建真实的广告位');
}

console.log('\n🔍 诊断完成！\n');

console.log('📋 可能的解决方案:');
console.log('1. 检查 Google AdSense 控制台是否有违规提醒');
console.log('2. 确认广告位ID是否为真实创建的ID（非示例ID）');
console.log('3. 检查网站是否符合 AdSense 政策');
console.log('4. 验证 ads.txt 文件内容是否正确');
console.log('5. 确认网站流量是否达到 AdSense 要求');
console.log('6. 检查浏览器是否安装了广告拦截器');
console.log('7. 查看浏览器控制台是否有 JavaScript 错误');
console.log('8. 确认 AdSense 账户状态是否正常');
