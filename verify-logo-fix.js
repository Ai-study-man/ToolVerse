// 验证logo映射修复脚本
const fs = require('fs');
const path = require('path');

// 要检查的工具列表（来自用户截图）
const toolsToCheck = [
  'Remini',
  'BigJPG', 
  'Bigjpg',
  'Topaz Gigapixel AI',
  'Topaz Gigapixel',
  'Midjourney',
  'Stable Diffusion',
  'DALL-E 2',
  'DALL-E 3',
  'Canva AI',
  'Canva',
  'Leonardo AI',
  'Adobe Firefly',
  'Figma AI',
  'Looka',
  'Fal AI',
  'Fal.ai',
  'IMGCreator AI',
  'ImgCreator.ai',
  'Bolt.new',
  'Bolt',
  'Cursor',
  'Windsurf',
  'v0 by Vercel',
  'Lovable',
  'Reverso',
  'Microsoft Translator',
  'Papago',
  'Whisper by OpenAI',
  "Let's Enhance",
  'LetsEnhance'
];

console.log('🔍 检查logo映射修复情况...\n');

// 读取notionService.ts文件
const notionServicePath = path.join(__dirname, 'src', 'lib', 'notionService.ts');
const notionServiceContent = fs.readFileSync(notionServicePath, 'utf8');

// 提取logoMappings对象
const logoMappingsMatch = notionServiceContent.match(/const logoMappings: \{ \[key: string\]: string \} = \{([\s\S]*?)\};/);
if (!logoMappingsMatch) {
  console.error('❌ 无法找到logoMappings配置');
  process.exit(1);
}

const logoMappingsText = logoMappingsMatch[1];

console.log('✅ 检查工具logo映射状态:\n');

let fixedCount = 0;
let missingCount = 0;

toolsToCheck.forEach(toolName => {
  const hasMapping = logoMappingsText.includes(`'${toolName}':`) || logoMappingsText.includes(`"${toolName}":`);
  
  if (hasMapping) {
    console.log(`✅ ${toolName} - 已配置logo映射`);
    fixedCount++;
  } else {
    console.log(`❌ ${toolName} - 缺少logo映射`);
    missingCount++;
  }
});

console.log('\n📊 统计结果:');
console.log(`✅ 已修复: ${fixedCount}个工具`);
console.log(`❌ 仍需修复: ${missingCount}个工具`);
console.log(`📈 修复率: ${((fixedCount / toolsToCheck.length) * 100).toFixed(1)}%`);

// 检查public/logos目录
const logosDir = path.join(__dirname, 'public', 'logos');
console.log('\n🔍 检查logo文件是否存在:\n');

toolsToCheck.forEach(toolName => {
  // 从映射中提取logo路径
  const mappingMatch = logoMappingsText.match(new RegExp(`['"]${toolName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]:\\s*'(/logos/[^']+)'`));
  
  if (mappingMatch) {
    const logoPath = mappingMatch[1];
    const fileName = logoPath.replace('/logos/', '');
    const filePath = path.join(logosDir, fileName);
    
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${toolName} - logo文件存在: ${fileName}`);
    } else {
      console.log(`⚠️  ${toolName} - logo文件不存在: ${fileName}`);
    }
  }
});

console.log('\n🎉 logo映射检查完成！');
