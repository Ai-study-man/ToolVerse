// 手动测试getBlogFunctionResult
import { getTodaysFeaturedBlogPosts } from './src/lib/blogService.ts';

async function testBlogFunction() {
  try {
    console.log('🚀 手动测试 getTodaysFeaturedBlogPosts...\n');
    
    const result = await getTodaysFeaturedBlogPosts();
    
    console.log(`📊 返回的文章数量: ${result.length}`);
    console.log('📝 返回的文章:');
    
    result.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   发布时间: ${post.publishedAt}`);
      console.log(`   作者: ${post.author.name}`);
    });
    
    // 检查今天的日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(`\n📅 今天的日期: ${today.toDateString()}`);
    
    // 检查是否有今天的文章
    const todayPosts = result.filter(post => {
      const publishDate = new Date(post.publishedAt);
      publishDate.setHours(0, 0, 0, 0);
      return publishDate.getTime() === today.getTime();
    });
    
    console.log(`\n✅ 今天的文章数量: ${todayPosts.length}`);
    if (todayPosts.length > 0) {
      console.log('🎯 应该显示: Today\'s Featured Article');
    } else {
      console.log('🎯 应该显示: Latest from Our Blog');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

testBlogFunction();
