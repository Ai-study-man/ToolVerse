const http = require('http');

async function testAPI() {
  try {
    console.log('🔍 测试API端点...');
    
    // 测试工具API
    const toolsPromise = new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/tools', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const tools = JSON.parse(data);
            resolve(tools);
          } catch (err) {
            reject(err);
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Timeout')));
    });

    // 测试分类API
    const categoriesPromise = new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/api/categories', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const categories = JSON.parse(data);
            resolve(categories);
          } catch (err) {
            reject(err);
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Timeout')));
    });

    const [tools, categories] = await Promise.all([toolsPromise, categoriesPromise]);
    
    console.log(`📊 工具数量: ${tools.length}`);
    console.log(`📂 分类数量: ${categories.length}`);
    
    if (tools.length > 0) {
      console.log('\n📝 前5个工具:');
      tools.slice(0, 5).forEach((tool, index) => {
        console.log(`   ${index + 1}. ${tool.name} (${tool.category}) - Status: ${tool.status}`);
      });
    }
    
    if (categories.length > 0) {
      console.log('\n📂 所有分类:');
      categories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.toolCount} 工具)`);
      });
    }
    
  } catch (error) {
    console.error('❌ API测试失败:', error.message);
  }
}

testAPI();
