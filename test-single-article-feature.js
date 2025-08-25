// 测试单篇文章显示功能
// 验证：如果今天有文章则显示今天的，没有则只显示最近一篇

import { getTodaysFeaturedBlogPosts } from './src/lib/blogService.ts';

async function testSingleArticleFeature() {
  try {
    console.log('🚀 测试单篇文章显示功能...\n');
    
    const featuredPosts = await getTodaysFeaturedBlogPosts();
    
    console.log(`📊 Featured Posts 数量: ${featuredPosts.length}`);
    console.log('📝 Featured Posts 详情:');
    
    featuredPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. ${post.title}`);
      console.log(`   发布时间: ${post.publishedAt}`);
      console.log(`   作者: ${post.author.name}`);
      console.log(`   标签: ${post.tags.join(', ')}`);
    });
    
    // 检查是否只有一篇文章（当今天没有文章时）
    if (featuredPosts.length === 1) {
      console.log('\n✅ 成功：只显示一篇文章（符合预期）');
      const post = featuredPosts[0];
      const publishDate = new Date(post.publishedAt);
      const today = new Date();
      
      // 检查是否是今天的文章
      if (publishDate.toDateString() === today.toDateString()) {
        console.log('📅 这是今天发布的文章');
      } else {
        console.log('📅 这是最近发布的文章（今天没有新文章）');
      }
    } else if (featuredPosts.length > 1) {
      console.log('\n📅 今天有多篇文章发布');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testSingleArticleFeature();
