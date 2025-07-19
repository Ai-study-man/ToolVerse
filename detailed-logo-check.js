// 更详细的logo匹配检查
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
const logoFiles = fs.readdirSync(logosDir).filter(file => 
  file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || 
  file.endsWith('.svg') || file.endsWith('.webp')
);

console.log('🔍 详细logo匹配分析:\n');

// 手动映射一些已知的匹配关系
const manualMappings = {
  'Codeium': 'codium-ai.png',
  'Stable Diffusion': 'dreamstudio.png', // DreamStudio是Stable Diffusion的界面
  'Playground AI': 'OpenAI_Icon_0.jpeg', // 可能需要专门的Playground AI logo
  'Leonardo AI': null, // 需要添加
  'Notion AI': null, // 需要添加  
  'Perplexity AI': null, // 需要添加
  'Otter.ai': null, // 需要添加
};

missingLogoTools.forEach(toolName => {
  console.log(`🔸 ${toolName}:`);
  
  // 检查手动映射
  if (manualMappings[toolName]) {
    console.log(`   ✅ 手动映射找到: ${manualMappings[toolName]}`);
    return;
  }
  
  if (manualMappings[toolName] === null) {
    console.log(`   ❌ 需要添加logo文件`);
    return;
  }
  
  // 模糊匹配
  const toolNameLower = toolName.toLowerCase().replace(/[.\s-_]/g, '');
  const matches = logoFiles.filter(file => {
    const fileNameLower = file.toLowerCase().replace(/[.\s-_]/g, '').replace(/\.(png|jpg|jpeg|svg|webp)$/i, '');
    return fileNameLower.includes(toolNameLower) || toolNameLower.includes(fileNameLower);
  });
  
  if (matches.length > 0) {
    console.log(`   🤔 可能匹配: ${matches.join(', ')}`);
  } else {
    console.log(`   ❌ 未找到匹配的logo文件`);
  }
});

console.log('\n📋 建议的logo文件映射:');
console.log('需要创建或重命名的文件:');
console.log('• worldtune.png - 需要添加');  
console.log('• stable-diffusion.png - 或使用现有的dreamstudio.png');
console.log('• leonardo-ai.png - 需要添加');
console.log('• looka.png - 需要添加');
console.log('• codet5.png - 需要添加'); 
console.log('• codeium.png - 重命名codium-ai.png');
console.log('• notion-ai.png - 需要添加');
console.log('• monkeylearn.png - 需要添加');
console.log('• dataiku.png - 需要添加');
console.log('• semrush-ai.png - 需要添加');
console.log('• contentking.png - 需要添加');
console.log('• perplexity-ai.png - 需要添加');
console.log('• playground-ai.png - 需要添加');
console.log('• otter-ai.png - 需要添加');
console.log('• motion.png - 需要添加');
console.log('• reclaim-ai.png - 需要添加');
console.log('• krisp.png - 需要添加');
console.log('• windsurf.png - 需要添加');
console.log('• code-t5-plus.png - 需要添加');
console.log('• sourcegraph-cody.png - 需要添加');
