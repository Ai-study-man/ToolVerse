// 批量更新mockData.ts中的logo路径
const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src/data/mockData.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// 工具名称到logo文件的映射
const logoMappings = {
  'GitHub Copilot': '/logos/Blackbox.png', // 或者用合适的GitHub logo
  'Notion AI': '/logos/notion-ai.svg',
  'Grammarly': '/logos/grammarly.svg',
  'Jasper': '/logos/jasper-ai.png',
  'Copy.ai': '/logos/Copy.ai_idhj7Th-aL_0.svg',
  'Writesonic': '/logos/Writesonic.jpeg',
  'Rytr': '/logos/Rytr.jpeg',
  'ContentBot': '/logos/ContentBot.jpeg',
  'Synthesia': '/logos/synthesia.png',
  'Pictory': '/logos/pictory-ai.jpeg',
  'Murf AI': '/logos/murf-ai.jpeg',
  'Descript': '/logos/descript.jpeg',
  'Runway ML': '/logos/runway-ml.jpeg',
  'Claude': '/logos/claude.svg',
  'Perplexity': '/logos/perplexity-ai.svg',
  'Character.AI': '/logos/character-ai.png'
};

// 查找并替换base64 logo
const base64Pattern = /logo: 'data:image\/svg\+xml;base64,[^']+'/g;

// 先找到所有使用base64的工具
const lines = content.split('\n');
let currentTool = null;
let toolLogos = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // 查找工具名称
  if (line.includes("name: '")) {
    const nameMatch = line.match(/name: '([^']+)'/);
    if (nameMatch) {
      currentTool = nameMatch[1];
    }
  }
  
  // 查找base64 logo
  if (line.includes("logo: 'data:image/svg+xml;base64,") && currentTool) {
    toolLogos.push({
      name: currentTool,
      lineNumber: i,
      originalLine: line
    });
    currentTool = null;
  }
}

console.log('Found tools with base64 logos:');
toolLogos.forEach(tool => {
  console.log(`- ${tool.name} (line ${tool.lineNumber + 1})`);
});

// 更新已知工具的logo
toolLogos.forEach(tool => {
  if (logoMappings[tool.name]) {
    const newLogoLine = tool.originalLine.replace(
      /logo: 'data:image\/svg\+xml;base64,[^']+'/,
      `logo: '${logoMappings[tool.name]}'`
    );
    content = content.replace(tool.originalLine, newLogoLine);
    console.log(`✅ Updated ${tool.name} logo`);
  } else {
    console.log(`⚠️  No logo mapping found for ${tool.name}`);
  }
});

// 写回文件
fs.writeFileSync(mockDataPath, content);
console.log('✅ Logo updates completed!');
