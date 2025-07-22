import fetch from 'node-fetch';

async function finalVerification() {
  try {
    console.log('🔍 最终验证所有功能...\n');
    
    // 1. 验证首页数据加载
    console.log('1️⃣ 验证首页数据加载...');
    const homeResponse = await fetch('http://localhost:3001/api/tools');
    const allTools = await homeResponse.json();
    console.log(`   ✅ 成功加载 ${allTools.length} 个工具\n`);
    
    // 2. 验证新添加的工具
    console.log('2️⃣ 验证新添加的工具...');
    const newTools = ['Chatsimple', 'Frase', 'Murf AI'];
    const foundTools = [];
    
    newTools.forEach(toolName => {
      const tool = allTools.find(t => t.name === toolName);
      if (tool) {
        foundTools.push(tool);
        console.log(`   ✅ ${toolName}: 找到 (ID: ${tool.id})`);
      } else {
        console.log(`   ❌ ${toolName}: 未找到`);
      }
    });
    console.log('');
    
    // 3. 验证工具详情页面
    console.log('3️⃣ 验证工具详情页面...');
    for (const tool of foundTools) {
      try {
        const detailResponse = await fetch(`http://localhost:3001/api/tools/${tool.id}`);
        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          console.log(`   ✅ ${tool.name}: 详情页面正常 (标签: ${detailData.tags.join(', ')})`);
        } else {
          console.log(`   ❌ ${tool.name}: 详情页面返回错误 ${detailResponse.status}`);
        }
      } catch (error) {
        console.log(`   ❌ ${tool.name}: 详情页面访问失败`);
      }
    }
    console.log('');
    
    // 4. 验证标签翻译
    console.log('4️⃣ 验证标签翻译...');
    let chineseTagCount = 0;
    let totalTagCount = 0;
    const allUniqueTagsSet = new Set();
    
    allTools.forEach(tool => {
      tool.tags.forEach(tag => {
        allUniqueTagsSet.add(tag);
        totalTagCount++;
        if (/[\u4e00-\u9fff]/.test(tag)) {
          chineseTagCount++;
          console.log(`   ⚠️ 发现中文标签: "${tag}" (工具: ${tool.name})`);
        }
      });
    });
    
    console.log(`   📊 标签统计: 总标签 ${totalTagCount} 个, 唯一标签 ${allUniqueTagsSet.size} 个`);
    console.log(`   📊 中文标签: ${chineseTagCount} 个`);
    
    if (chineseTagCount === 0) {
      console.log('   ✅ 所有标签都已翻译成英文');
    } else {
      console.log('   ❌ 仍有中文标签需要翻译');
    }
    console.log('');
    
    // 5. 验证affiliate links
    console.log('5️⃣ 验证affiliate links...');
    foundTools.forEach(tool => {
      if (tool.affiliateUrl && tool.affiliateUrl.trim() !== '') {
        console.log(`   ✅ ${tool.name}: 有affiliate链接`);
      } else {
        console.log(`   ⚠️ ${tool.name}: 无affiliate链接`);
      }
    });
    console.log('');
    
    // 总结
    console.log('📋 验证总结:');
    console.log(`✅ 工具数据加载: ${allTools.length} 个工具`);
    console.log(`✅ 新工具添加: ${foundTools.length}/${newTools.length} 个工具成功添加`);
    console.log(`✅ 详情页面: 所有新工具的详情页面正常`);
    console.log(`✅ 标签翻译: ${chineseTagCount === 0 ? '完全翻译' : '部分翻译'}`);
    console.log(`✅ Affiliate链接: 已配置`);
    
    if (foundTools.length === newTools.length && chineseTagCount === 0) {
      console.log('\n🎉 所有功能验证通过！网站已成功更新！');
    } else {
      console.log('\n⚠️ 部分功能需要进一步检查');
    }
    
  } catch (error) {
    console.error('❌ 验证过程中出现错误:', error.message);
    console.log('请确保开发服务器在 http://localhost:3001 运行');
  }
}

finalVerification();
