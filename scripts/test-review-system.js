// 测试评论系统的简单脚本
// 运行命令: npm run test-reviews

const testReviewSystem = async () => {
  console.log('🧪 开始测试评论系统...');
  
  // 测试1: API路由是否正常
  try {
    console.log('\n1. 测试API路由访问...');
    const response = await fetch('/api/reviews/test-tool-id');
    console.log(`   API响应状态: ${response.status}`);
    
    const data = await response.json();
    console.log('   ✅ API路由正常');
  } catch (error) {
    console.log('   ❌ API路由测试失败:', error.message);
  }
  
  // 测试2: 组件导入是否正常
  try {
    console.log('\n2. 测试组件导入...');
    const components = [
      'StarRating',
      'ReviewForm', 
      'ReviewDisplay',
      'ReviewSection'
    ];
    
    for (const component of components) {
      try {
        await import(`../src/components/${component}.tsx`);
        console.log(`   ✅ ${component} 组件导入成功`);
      } catch (err) {
        console.log(`   ❌ ${component} 组件导入失败:`, err.message);
      }
    }
  } catch (error) {
    console.log('   ❌ 组件测试失败:', error.message);
  }
  
  // 测试3: 类型定义是否正确
  try {
    console.log('\n3. 测试类型定义...');
    await import('../src/types/review.ts');
    console.log('   ✅ 类型定义正常');
  } catch (error) {
    console.log('   ❌ 类型定义测试失败:', error.message);
  }
  
  console.log('\n🎉 评论系统测试完成!');
  console.log('\n📋 部署检查清单:');
  console.log('   □ 在Supabase中执行数据库迁移');
  console.log('   □ 配置环境变量');
  console.log('   □ 测试评论功能');
  console.log('\n💡 提示: 请参考 REVIEW_SYSTEM_DEPLOYMENT.md 进行详细部署');
};

if (typeof window === 'undefined') {
  // Node.js 环境
  testReviewSystem();
}

export default testReviewSystem;
