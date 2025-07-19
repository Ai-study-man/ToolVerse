// 检查工具描述中的中文内容
const fs = require('fs');
const path = require('path');

// 检查中文字符的正则表达式
const chineseRegex = /[\u4e00-\u9fff]+/g;

async function checkToolDescriptions() {
  try {
    // 1. 检查 mockData.ts
    const mockDataPath = path.join(__dirname, 'src', 'data', 'mockData.ts');
    if (fs.existsSync(mockDataPath)) {
      const mockData = fs.readFileSync(mockDataPath, 'utf8');
      console.log('📄 检查 mockData.ts 中的中文描述...\n');
      
      // 提取工具数据部分
      const toolsSection = mockData.match(/export const tools: Tool\[\] = \[([\s\S]*?)\];/);
      if (toolsSection) {
        const toolsContent = toolsSection[1];
        const chineseMatches = toolsContent.match(chineseRegex);
        
        if (chineseMatches) {
          console.log('❌ 在 mockData.ts 中发现中文内容:');
          // 按工具分组显示
          const tools = toolsContent.split(/},\s*{/).map(tool => tool.trim());
          tools.forEach((tool, index) => {
            const chineseInTool = tool.match(chineseRegex);
            if (chineseInTool) {
              // 提取工具名称
              const nameMatch = tool.match(/name:\s*['"`]([^'"`]+)['"`]/);
              const name = nameMatch ? nameMatch[1] : `工具 ${index + 1}`;
              
              console.log(`\n🔸 ${name}:`);
              chineseInTool.forEach(chineseText => {
                // 找到包含中文的完整行
                const lines = tool.split('\n');
                lines.forEach(line => {
                  if (line.includes(chineseText)) {
                    console.log(`   ${line.trim()}`);
                  }
                });
              });
            }
          });
        } else {
          console.log('✅ mockData.ts 中未发现中文内容');
        }
      }
    }

    // 2. 检查其他可能包含工具数据的文件
    console.log('\n📄 检查其他数据文件...\n');
    
    const dataFiles = [
      'src/lib/dataSyncService.ts',
      'src/components/CategoryShowcase.tsx',
      'src/components/HomePage.tsx'
    ];
    
    dataFiles.forEach(filePath => {
      const fullPath = path.join(__dirname, filePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const chineseMatches = content.match(chineseRegex);
        
        if (chineseMatches && chineseMatches.length > 0) {
          console.log(`❌ ${filePath} 中发现中文内容:`);
          // 显示包含中文的行
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (chineseRegex.test(line)) {
              console.log(`   第${index + 1}行: ${line.trim()}`);
            }
          });
        } else {
          console.log(`✅ ${filePath} 中未发现中文内容`);
        }
      } else {
        console.log(`⚠️  ${filePath} 文件不存在`);
      }
    });

  } catch (error) {
    console.error('检查过程中出现错误:', error);
  }
}

// 运行检查
checkToolDescriptions();
