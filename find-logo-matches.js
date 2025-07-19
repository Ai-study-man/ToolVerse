// 查找可能匹配的logo文件
const fs = require('fs');
const path = require('path');

const missingTools = [
  'Worldtune', 'Stable Diffusion', 'Leonardo AI', 'Looka', 'CodeT5', 
  'Codeium', 'Notion AI', 'MonkeyLearn', 'Dataiku', 'Semrush AI', 
  'ContentKing', 'Perplexity AI', 'Playground AI', 'Otter.ai', 
  'Motion', 'Reclaim.ai', 'Krisp', 'Windsurf', 'Code T5+', 'Sourcegraph Cody'
];

const logosDir = path.join(__dirname, 'public', 'logos');
const logoFiles = fs.readdirSync(logosDir).filter(file => 
  file.match(/\.(png|jpg|jpeg|svg|webp)$/i) && file !== '.png'
);

console.log('📁 查找可能的logo文件匹配:\n');

// 手动查找模式
const possibleMatches = {
  'Worldtune': logoFiles.filter(f => f.toLowerCase().includes('worldtune') || f.toLowerCase().includes('world')),
  'Stable Diffusion': logoFiles.filter(f => f.toLowerCase().includes('stable') || f.toLowerCase().includes('diffusion') || f.toLowerCase().includes('dream')),
  'Leonardo AI': logoFiles.filter(f => f.toLowerCase().includes('leonardo')),
  'Looka': logoFiles.filter(f => f.toLowerCase().includes('looka')),
  'CodeT5': logoFiles.filter(f => f.toLowerCase().includes('codet5') || f.toLowerCase().includes('code') && f.toLowerCase().includes('t5')),
  'Codeium': logoFiles.filter(f => f.toLowerCase().includes('codeium') || f.toLowerCase().includes('codium')),
  'Notion AI': logoFiles.filter(f => f.toLowerCase().includes('notion')),
  'MonkeyLearn': logoFiles.filter(f => f.toLowerCase().includes('monkey')),
  'Dataiku': logoFiles.filter(f => f.toLowerCase().includes('dataiku')),
  'Semrush AI': logoFiles.filter(f => f.toLowerCase().includes('semrush')),
  'ContentKing': logoFiles.filter(f => f.toLowerCase().includes('content') && f.toLowerCase().includes('king')),
  'Perplexity AI': logoFiles.filter(f => f.toLowerCase().includes('perplexity')),
  'Playground AI': logoFiles.filter(f => f.toLowerCase().includes('playground')),
  'Otter.ai': logoFiles.filter(f => f.toLowerCase().includes('otter')),
  'Motion': logoFiles.filter(f => f.toLowerCase().includes('motion')),
  'Reclaim.ai': logoFiles.filter(f => f.toLowerCase().includes('reclaim')),
  'Krisp': logoFiles.filter(f => f.toLowerCase().includes('krisp')),
  'Windsurf': logoFiles.filter(f => f.toLowerCase().includes('windsurf') || f.toLowerCase().includes('wind')),
  'Code T5+': logoFiles.filter(f => f.toLowerCase().includes('t5') || f.toLowerCase().includes('plus')),
  'Sourcegraph Cody': logoFiles.filter(f => f.toLowerCase().includes('source') || f.toLowerCase().includes('cody'))
};

Object.entries(possibleMatches).forEach(([tool, matches]) => {
  if (matches.length > 0) {
    console.log(`✅ ${tool}: 可能匹配 ${matches.join(', ')}`);
  } else {
    console.log(`❌ ${tool}: 无匹配文件`);
  }
});

console.log(`\n📋 所有可用的logo文件:`);
logoFiles.forEach(file => console.log(`   • ${file}`));

// 检查具体可能被忽略的模式
console.log(`\n🔍 检查具体工具的变体匹配:`);
console.log(`Codeium相关: ${logoFiles.filter(f => f.toLowerCase().includes('codi')).join(', ')}`);
console.log(`Notion相关: ${logoFiles.filter(f => f.toLowerCase().includes('not')).join(', ')}`);
console.log(`Motion相关: ${logoFiles.filter(f => f.toLowerCase().includes('mot')).join(', ')}`);
console.log(`Perplexity相关: ${logoFiles.filter(f => f.toLowerCase().includes('per')).join(', ')}`);
console.log(`Playground相关: ${logoFiles.filter(f => f.toLowerCase().includes('play')).join(', ')}`);
console.log(`Stable相关: ${logoFiles.filter(f => f.toLowerCase().includes('sta')).join(', ')}`);
console.log(`Leonardo相关: ${logoFiles.filter(f => f.toLowerCase().includes('leo')).join(', ')}`);
