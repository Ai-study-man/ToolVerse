// 创建缺失logo文件的占位符和说明
const fs = require('fs');
const path = require('path');

const missingLogos = [
  { name: 'Worldtune', filename: 'worldtune.png' },
  { name: 'Stable Diffusion', filename: 'stable-diffusion.png' },
  { name: 'Leonardo AI', filename: 'leonardo-ai.png' },
  { name: 'Looka', filename: 'looka.png' },
  { name: 'CodeT5', filename: 'codet5.png' },
  { name: 'Codeium', filename: 'codeium.png' }, // 已有codium-ai.png但建议标准命名
  { name: 'Notion AI', filename: 'notion-ai.png' },
  { name: 'MonkeyLearn', filename: 'monkeylearn.png' },
  { name: 'Dataiku', filename: 'dataiku.png' },
  { name: 'Semrush AI', filename: 'semrush-ai.png' },
  { name: 'ContentKing', filename: 'contentking.png' },
  { name: 'Perplexity AI', filename: 'perplexity-ai.png' },
  { name: 'Playground AI', filename: 'playground-ai.png' },
  { name: 'Otter.ai', filename: 'otter-ai.png' },
  { name: 'Motion', filename: 'motion.png' },
  { name: 'Reclaim.ai', filename: 'reclaim-ai.png' },
  { name: 'Krisp', filename: 'krisp.png' },
  { name: 'Windsurf', filename: 'windsurf.png' },
  { name: 'Code T5+', filename: 'code-t5-plus.png' },
  { name: 'Sourcegraph Cody', filename: 'sourcegraph-cody.png' }
];

const logosDir = path.join(__dirname, 'public', 'logos');

console.log('📋 缺失官方logo的AI工具列表:\n');

missingLogos.forEach((tool, index) => {
  console.log(`${index + 1}. ${tool.name}`);
  console.log(`   建议文件名: ${tool.filename}`);
  console.log(`   官网: 请从 ${tool.name} 官网下载logo`);
  console.log('');
});

console.log('\n📁 请将这些工具的官方logo文件添加到以下目录:');
console.log(`${logosDir}\n`);

console.log('💡 下载官方logo的建议:');
console.log('1. 访问各个工具的官方网站');
console.log('2. 查找 Press Kit 或 Brand Assets 页面');
console.log('3. 下载PNG或SVG格式的logo');
console.log('4. 重命名为建议的文件名');
console.log('5. 放入logos目录');

console.log('\n🔗 常见的官方logo下载地址模式:');
console.log('• [工具官网]/press');
console.log('• [工具官网]/brand');
console.log('• [工具官网]/assets');
console.log('• [工具官网]/media-kit');

// 创建一个README文件说明缺失的logo
const readmeContent = `# 缺失官方Logo的AI工具

以下工具需要添加官方logo文件：

${missingLogos.map((tool, i) => `${i + 1}. **${tool.name}** → \`${tool.filename}\``).join('\n')}

## 如何添加官方Logo

1. 访问工具的官方网站
2. 查找 "Press Kit"、"Brand Assets" 或 "Media Kit" 页面
3. 下载PNG或SVG格式的官方logo
4. 重命名为上述建议的文件名
5. 将文件放入 \`public/logos/\` 目录

## 注意事项

- 优先使用PNG格式（透明背景）
- 文件大小建议控制在200KB以内
- 尺寸建议为64x64px或更高分辨率
- 使用官方正式版本的logo，避免非官方设计

更新logo文件后，系统会自动使用新的官方logo替换当前的临时logo。
`;

fs.writeFileSync(path.join(__dirname, 'MISSING_LOGOS.md'), readmeContent);
console.log('\n✅ 已创建 MISSING_LOGOS.md 说明文件');
