// 简化版SEO检查工具 - 检查网站SEO优化状态
const http = require('http');

// 检查本地开发服务器的SEO状态
async function checkLocalSEO() {
  console.log('🔍 检查本地网站SEO状态...\n');
  
  const paths = [
    { path: '', name: '首页' },
    { path: '/tools', name: '工具页面' },
    { path: '/categories', name: '分类页面' },
    { path: '/sitemap.xml', name: '站点地图' },
    { path: '/robots.txt', name: '机器人文件' }
  ];
  
  for (const { path, name } of paths) {
    try {
      console.log(`📄 检查 ${name} (${path || '/'}):`);
      
      const url = `http://localhost:3000${path}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const content = await response.text();
        
        // 基本检查
        const hasTitle = content.includes('<title>');
        const hasDescription = content.includes('name="description"');
        const hasKeywords = content.includes('name="keywords"');
        const hasOG = content.includes('property="og:');
        const hasTwitter = content.includes('name="twitter:');
        const hasCanonical = content.includes('rel="canonical"');
        const hasStructuredData = content.includes('application/ld+json');
        
        console.log(`   ✅ 状态: ${response.status}`);
        console.log(`   📝 标题标签: ${hasTitle ? '✅' : '❌'}`);
        console.log(`   📄 描述标签: ${hasDescription ? '✅' : '❌'}`);
        console.log(`   🔑 关键词标签: ${hasKeywords ? '✅' : '❌'}`);
        console.log(`   📊 Open Graph: ${hasOG ? '✅' : '❌'}`);
        console.log(`   🐦 Twitter Cards: ${hasTwitter ? '✅' : '❌'}`);
        console.log(`   🔗 Canonical URL: ${hasCanonical ? '✅' : '❌'}`);
        console.log(`   📋 结构化数据: ${hasStructuredData ? '✅' : '❌'}`);
        
        // 特殊检查
        if (path === '/sitemap.xml') {
          const hasTool = content.includes('/tools/');
          const hasCategory = content.includes('/categories');
          console.log(`   🛠️ 工具页面链接: ${hasTool ? '✅' : '❌'}`);
          console.log(`   📂 分类页面链接: ${hasCategory ? '✅' : '❌'}`);
        }
        
        if (path === '/robots.txt') {
          const hasSitemap = content.includes('Sitemap:');
          const hasUserAgent = content.includes('User-agent:');
          console.log(`   🤖 User-agent规则: ${hasUserAgent ? '✅' : '❌'}`);
          console.log(`   🗺️ Sitemap链接: ${hasSitemap ? '✅' : '❌'}`);
        }
        
      } else {
        console.log(`   ❌ 状态: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ 错误: ${error.message}`);
    }
    
    console.log(''); // 空行分隔
  }
  
  console.log('📈 SEO检查完成！');
  console.log('\n💡 SEO优化建议:');
  console.log('   1. 确保所有页面都有完整的meta标签');
  console.log('   2. 添加结构化数据提高搜索引擎理解');
  console.log('   3. 优化图片alt标签和文件名');
  console.log('   4. 提高页面加载速度');
  console.log('   5. 定期更新内容保持网站活跃度');
}

// 检查网站性能
async function checkPerformance() {
  console.log('\n⚡ 检查网站性能...');
  
  const start = Date.now();
  try {
    const response = await fetch('http://localhost:3000');
    const end = Date.now();
    const loadTime = end - start;
    
    console.log(`📊 首页加载时间: ${loadTime}ms`);
    console.log(`📏 响应大小: ${response.headers.get('content-length') || '未知'} bytes`);
    
    if (loadTime < 1000) {
      console.log('✅ 加载速度优秀');
    } else if (loadTime < 3000) {
      console.log('⚠️ 加载速度一般，建议优化');
    } else {
      console.log('❌ 加载速度较慢，需要优化');
    }
  } catch (error) {
    console.log(`❌ 性能检查失败: ${error.message}`);
  }
}

// 主函数
async function main() {
  console.log('🚀 ToolVerse SEO & 性能检查工具');
  console.log('=' .repeat(40));
  
  await checkLocalSEO();
  await checkPerformance();
  
  console.log('\n🎯 检查完成！建议结合Google PageSpeed Insights进行深度分析。');
}

// 运行检查
main().catch(console.error);
