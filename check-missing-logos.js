// 检查缺失logo的工具
const fs = require('fs');
const path = require('path');

const missingLogoTools = [
  'Worldtune',
  'Stable Diffusion', 
  'Leonardo AI',
  'Looka',
  'CodeT5',
  'Codeium',
  'Notion AI',
  'MonkeyLearn', 
  'Dataiku',
  'Semrush AI',
  'ContentKing',
  'Perplexity AI',
  'Playground AI',
  'Otter.ai',
  'Motion',
  'Reclaim.ai',
  'Krisp',
  'Windsurf',
  'Code T5+',
  'Sourcegraph Cody'
];

const logosDir = path.join(__dirname, 'public', 'logos');

console.log('🔍 检查缺失logo的工具:\n');

// 获取所有logo文件
const logoFiles = fs.readdirSync(logosDir).filter(file => 
  file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || 
  file.endsWith('.svg') || file.endsWith('.webp')
);

console.log(`📁 logos目录中共有 ${logoFiles.length} 个logo文件\n`);

// 可能的文件名变体
function getPossibleFilenames(toolName) {
  const variations = [
    toolName,
    toolName.toLowerCase(),
    toolName.replace(/\s+/g, '-'),
    toolName.replace(/\s+/g, '-').toLowerCase(),
    toolName.replace(/\s+/g, '_'),
    toolName.replace(/\s+/g, '_').toLowerCase(),
    toolName.replace(/\s+/g, ''),
    toolName.replace(/\s+/g, '').toLowerCase(),
    toolName.replace(/\./g, ''),
    toolName.replace(/\./g, '').toLowerCase(),
    toolName.replace(/\./g, '-'),
    toolName.replace(/\./g, '-').toLowerCase(),
  ];
  
  return variations;
}

missingLogoTools.forEach(toolName => {
  console.log(`🔸 ${toolName}:`);
  
  const possibleNames = getPossibleFilenames(toolName);
  let found = false;
  
  for (const variation of possibleNames) {
    const matches = logoFiles.filter(file => {
      const nameWithoutExt = file.replace(/\.(png|jpg|jpeg|svg|webp)$/i, '');
      return nameWithoutExt.toLowerCase() === variation.toLowerCase();
    });
    
    if (matches.length > 0) {
      console.log(`   ✅ 找到匹配文件: ${matches.join(', ')}`);
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log(`   ❌ 未找到logo文件`);
    console.log(`   💡 尝试的文件名: ${possibleNames.slice(0, 5).join(', ')}...`);
  }
  
  console.log('');
});

// 列出所有可用的logo文件供参考
console.log('\n📋 所有可用的logo文件:');
logoFiles.forEach(file => {
  console.log(`   • ${file}`);
});
