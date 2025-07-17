// 生产环境API测试脚本
// 在浏览器控制台运行以验证API是否正常工作

async function testProductionAPI() {
  console.log('🔍 Testing Production API...');
  
  try {
    // 测试工具API
    console.log('📋 Testing /api/tools...');
    const toolsResponse = await fetch('/api/tools');
    const toolsData = await toolsResponse.json();
    console.log('✅ Tools API Response:', {
      status: toolsResponse.status,
      count: toolsData.length,
      first3: toolsData.slice(0, 3).map(t => ({ name: t.name, id: t.id }))
    });
    
    // 测试分类API
    console.log('📂 Testing /api/categories...');
    const categoriesResponse = await fetch('/api/categories');
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categories API Response:', {
      status: categoriesResponse.status,
      success: categoriesData.success,
      count: categoriesData.data?.categories?.length || 0,
      categories: categoriesData.data?.categories?.map(c => c.name) || []
    });
    
    // 如果有工具，测试第一个工具的详情
    if (toolsData.length > 0) {
      const firstTool = toolsData[0];
      console.log(`🔍 Testing tool detail for: ${firstTool.name} (ID: ${firstTool.id})`);
      
      // 模拟访问工具详情页的数据获取
      console.log('📄 Tool details:', {
        name: firstTool.name,
        description: firstTool.description,
        category: firstTool.category,
        website: firstTool.website,
        logo: firstTool.logo || 'No logo',
        features: firstTool.features?.length || 0,
        tags: firstTool.tags?.length || 0
      });
    }
    
    console.log('🎉 All API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
    console.log('🔧 Possible issues:');
    console.log('  1. Notion API token not configured in Vercel');
    console.log('  2. Database ID incorrect');
    console.log('  3. Network connectivity issues');
  }
}

// 自动运行测试
testProductionAPI();
