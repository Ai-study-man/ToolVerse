// 网络诊断脚本 - 专门检查logo加载问题
const fs = require('fs');
const path = require('path');

console.log('🔍 Logo加载问题诊断...\n');

// 检查logo文件是否存在
function checkLogoFiles() {
  console.log('1️⃣ 检查logo文件存在性:');
  
  const logosDir = path.join(__dirname, 'public', 'logos');
  
  // 从用户截图中提到的工具
  const toolsInScreenshot = [
    'Remini.jpeg',
    'bigjpg.svg', 
    'topaz-gigapixel.jpeg',
    'Midjourney.png',
    'stable-diffusion.png',
    'OpenAI_Icon_0.jpeg', // DALL-E 2
    'Canva_Logo_0.svg',
    'leonardo-ai.svg',
    'looka.svg'
  ];
  
  toolsInScreenshot.forEach(logoFile => {
    const filePath = path.join(logosDir, logoFile);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${logoFile} - 存在`);
    } else {
      console.log(`   ❌ ${logoFile} - 不存在`);
    }
  });
}

// 检查notionService中的映射
function checkLogoMappings() {
  console.log('\n2️⃣ 检查notionService映射:');
  
  const notionServicePath = path.join(__dirname, 'src', 'lib', 'notionService.ts');
  if (fs.existsSync(notionServicePath)) {
    const content = fs.readFileSync(notionServicePath, 'utf8');
    
    const toolsToCheck = ['Remini', 'BigJPG', 'Topaz Gigapixel', 'Midjourney', 'Stable Diffusion', 'DALL-E 2', 'Canva', 'Leonardo AI'];
    
    toolsToCheck.forEach(tool => {
      if (content.includes(`'${tool}':`)) {
        console.log(`   ✅ ${tool} - 已映射`);
      } else {
        console.log(`   ❌ ${tool} - 未映射`);
      }
    });
  }
}

// 检查Data URL生成函数
function checkDataUrlGeneration() {
  console.log('\n3️⃣ 检查Data URL生成:');
  
  // 模拟generateFallbackLogo函数
  function testGenerateFallbackLogo(name) {
    const firstLetter = name.charAt(0).toUpperCase();
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%232563eb'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Arial' font-size='28' font-weight='bold' fill='white'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
  }
  
  const testTools = ['Remini', 'BigJPG', 'Topaz'];
  testTools.forEach(tool => {
    const dataUrl = testGenerateFallbackLogo(tool);
    console.log(`   📝 ${tool}: ${dataUrl.substring(0, 100)}...`);
  });
}

// 检查Next.js Image组件兼容性
function checkNextImageConfig() {
  console.log('\n4️⃣ 检查Next.js配置:');
  
  const nextConfigPath = path.join(__dirname, 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (content.includes('dangerouslyAllowSVG: true')) {
      console.log('   ✅ SVG支持已启用');
    } else {
      console.log('   ❌ SVG支持未启用');
    }
    
    if (content.includes('unoptimized: false')) {
      console.log('   ⚠️  图片优化已启用 - 可能导致Data URL问题');
    } else {
      console.log('   ✅ 图片优化配置正常');
    }
  }
}

// 提供解决方案
function provideSolutions() {
  console.log('\n💡 解决方案建议:');
  
  console.log('📋 基于控制台错误的分析:');
  console.log('   🔸 Next.js Image组件无法处理Data URL格式的SVG');
  console.log('   🔸 多个工具仍在使用fallback logo而非真实logo');
  console.log('   🔸 浏览器扩展可能干扰网络请求');
  
  console.log('\n🔧 立即修复步骤:');
  console.log('   1. 修改ToolLogo组件，对Data URL使用<img>而非<Image>');
  console.log('   2. 确保所有工具都有正确的logo映射');
  console.log('   3. 检查生产环境的静态资源访问');
  console.log('   4. 使用隐私模式测试排除扩展干扰');
  
  console.log('\n🚀 验证方法:');
  console.log('   • 访问: https://你的域名/logos/Remini.jpeg');
  console.log('   • 检查浏览器Network面板');
  console.log('   • 在隐私模式下测试');
}

// 执行所有检查
checkLogoFiles();
checkLogoMappings();
checkDataUrlGeneration();
checkNextImageConfig();
provideSolutions();

console.log('\n🎯 诊断完成！');
