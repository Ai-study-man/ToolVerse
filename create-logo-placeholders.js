// 为缺失的logo创建占位符SVG文件
const fs = require('fs');
const path = require('path');

const missingLogos = [
  { name: 'Worldtune', filename: 'worldtune.png', letter: 'W', color: '#FF6B6B' },
  { name: 'Stable Diffusion', filename: 'stable-diffusion.png', letter: 'S', color: '#4ECDC4' },
  { name: 'Leonardo AI', filename: 'leonardo-ai.png', letter: 'L', color: '#45B7D1' },
  { name: 'Looka', filename: 'looka.png', letter: 'L', color: '#96CEB4' },
  { name: 'CodeT5', filename: 'codet5.png', letter: 'C', color: '#FECA57' },
  { name: 'Codeium', filename: 'codeium.png', letter: 'C', color: '#FF9FF3' },
  { name: 'Notion AI', filename: 'notion-ai.png', letter: 'N', color: '#54A0FF' },
  { name: 'MonkeyLearn', filename: 'monkeylearn.png', letter: 'M', color: '#5F27CD' },
  { name: 'Dataiku', filename: 'dataiku.png', letter: 'D', color: '#00D2D3' },
  { name: 'Semrush AI', filename: 'semrush-ai.png', letter: 'S', color: '#FF6B6B' },
  { name: 'ContentKing', filename: 'contentking.png', letter: 'C', color: '#FFD93D' },
  { name: 'Perplexity AI', filename: 'perplexity-ai.png', letter: 'P', color: '#6C5CE7' },
  { name: 'Playground AI', filename: 'playground-ai.png', letter: 'P', color: '#A29BFE' },
  { name: 'Otter.ai', filename: 'otter-ai.png', letter: 'O', color: '#FD79A8' },
  { name: 'Motion', filename: 'motion.png', letter: 'M', color: '#FDCB6E' },
  { name: 'Reclaim.ai', filename: 'reclaim-ai.png', letter: 'R', color: '#E17055' },
  { name: 'Krisp', filename: 'krisp.png', letter: 'K', color: '#00B894' },
  { name: 'Windsurf', filename: 'windsurf.png', letter: 'W', color: '#0984E3' },
  { name: 'Code T5+', filename: 'code-t5-plus.png', letter: 'C', color: '#E84393' },
  { name: 'Sourcegraph Cody', filename: 'sourcegraph-cody.png', letter: 'S', color: '#00CEC9' }
];

const logosDir = path.join(__dirname, 'public', 'logos');

console.log('🎨 创建官方logo占位符文件...\n');

missingLogos.forEach(tool => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="gradient-${tool.letter.toLowerCase()}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${tool.color}" />
      <stop offset="100%" stop-color="${tool.color}CC" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#gradient-${tool.letter.toLowerCase()})" />
  <text x="32" y="42" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="bold" fill="white">${tool.letter}</text>
  <!-- 占位符Logo - 请替换为官方Logo -->
  <rect x="2" y="2" width="60" height="60" rx="14" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1" stroke-dasharray="4,4" />
</svg>`;

  // 创建SVG文件（以.svg结尾）
  const svgFilename = tool.filename.replace('.png', '.svg');
  const svgPath = path.join(logosDir, svgFilename);
  
  try {
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ 创建占位符: ${svgFilename}`);
  } catch (error) {
    console.log(`❌ 创建失败: ${svgFilename} - ${error.message}`);
  }
});

console.log('\n📝 注意事项:');
console.log('• 这些是临时占位符，请替换为真实的官方logo');
console.log('• 占位符使用SVG格式，支持透明背景');
console.log('• 添加真实logo时，请使用原计划的文件名（如.png）');
console.log('• 真实logo文件会自动覆盖这些占位符的使用');

console.log('\n🔧 更新logo映射以使用SVG占位符...');

// 输出更新的映射配置建议
console.log('\n📋 临时使用SVG占位符的映射:');
missingLogos.forEach(tool => {
  const svgFilename = tool.filename.replace('.png', '.svg');
  console.log(`'${tool.name}': '/logos/${svgFilename}',`);
});
