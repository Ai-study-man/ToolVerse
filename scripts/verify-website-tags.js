import fetch from 'node-fetch';

async function verifyTagTranslations() {
  try {
    console.log('🔍 验证网站标签翻译...');
    
    // 直接访问API端点
    const response = await fetch('http://localhost:3001/api/tools');
    const tools = await response.json();
    
    console.log(`📊 从网站API获取到 ${tools.length} 个工具\n`);
    
    let allTags = new Set();
    let chineseTags = new Set();
    
    tools.forEach((tool, index) => {
      if (index < 5) {
        console.log(`工具 ${tool.name}:`);
        console.log(`  标签: ${tool.tags.join(', ')}`);
        console.log('');
      }
      
      tool.tags.forEach(tag => {
        allTags.add(tag);
        // 检测是否包含中文字符
        if (/[\u4e00-\u9fff]/.test(tag)) {
          chineseTags.add(tag);
        }
      });
    });
    
    console.log('📈 网站标签统计:');
    console.log(`总标签数: ${allTags.size}`);
    console.log(`中文标签数: ${chineseTags.size}`);
    
    if (chineseTags.size > 0) {
      console.log('\n❌ 仍有中文标签未翻译:');
      [...chineseTags].forEach(tag => {
        console.log(`  - ${tag}`);
      });
    } else {
      console.log('\n🎉 所有标签都已翻译成英文！');
    }
    
    // 检查新添加的工具
    const featuredTools = ['Chatsimple', 'Frase', 'Murf AI'];
    console.log('\n🔍 检查新添加的工具:');
    
    featuredTools.forEach(toolName => {
      const tool = tools.find(t => t.name === toolName);
      if (tool) {
        console.log(`✅ ${toolName}: ${tool.tags.join(', ')}`);
      } else {
        console.log(`❌ ${toolName}: 未找到`);
      }
    });
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.log('请确保开发服务器在 http://localhost:3001 运行');
  }
}

verifyTagTranslations();
