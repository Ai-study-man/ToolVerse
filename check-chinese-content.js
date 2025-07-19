/**
 * 检查网站中的中文内容
 */

const fs = require('fs');
const path = require('path');

// 递归搜索文件中的中文字符
function searchChineseInFiles(dir, extensions = ['.tsx', '.ts', '.js']) {
  const results = [];
  
  function searchInDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        searchInDirectory(itemPath);
      } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
        try {
          const content = fs.readFileSync(itemPath, 'utf8');
          const lines = content.split('\n');
          
          lines.forEach((line, index) => {
            // 检查中文字符，但排除注释
            const chineseMatch = line.match(/[\u4e00-\u9fff]+/g);
            if (chineseMatch) {
              // 检查是否在注释中
              const trimmedLine = line.trim();
              const isComment = trimmedLine.startsWith('//') || 
                               trimmedLine.startsWith('/*') || 
                               trimmedLine.startsWith('*') ||
                               (trimmedLine.includes('/*') && trimmedLine.includes('*/'));
              
              if (!isComment) {
                results.push({
                  file: itemPath,
                  line: index + 1,
                  content: line.trim(),
                  chineseText: chineseMatch.join(' ')
                });
              }
            }
          });
        } catch (error) {
          console.error(`Error reading file ${itemPath}:`, error.message);
        }
      }
    }
  }
  
  searchInDirectory(dir);
  return results;
}

// 主函数
function checkChinese() {
  console.log('🔍 检查网站中的中文内容...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const results = searchChineseInFiles(srcDir);
  
  if (results.length === 0) {
    console.log('✅ 没有找到用户可见的中文内容！');
    return;
  }
  
  console.log(`❌ 找到 ${results.length} 个可能包含中文的位置:\n`);
  
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.file}:${result.line}`);
    console.log(`   中文: "${result.chineseText}"`);
    console.log(`   内容: ${result.content}`);
    console.log('');
  });
  
  // 按文件分组显示
  const byFile = {};
  results.forEach(result => {
    if (!byFile[result.file]) {
      byFile[result.file] = [];
    }
    byFile[result.file].push(result);
  });
  
  console.log('📄 按文件分组:');
  Object.entries(byFile).forEach(([file, items]) => {
    console.log(`\n📁 ${file}`);
    items.forEach(item => {
      console.log(`   行 ${item.line}: "${item.chineseText}"`);
    });
  });
}

// 如果直接运行此脚本
if (require.main === module) {
  checkChinese();
}

module.exports = { checkChinese };
