// 测试今天的文章显示逻辑
const fs = require('fs');
const path = require('path');

// 模拟blog数据
const mockBlogPosts = [
  {
    title: 'Fal AI Review 2025: Complete Guide to Real-Time AI Image...',
    publishedAt: new Date('2025-08-21'),
    featured: true
  },
  {
    title: 'Top 10 AI Tools You Should Try in August 2025',
    publishedAt: new Date('2025-08-24'),
    featured: true
  },
  {
    title: 'QuizGPT: The Hidden ChatGPT Flashcard Mode That Beats Traditional Study Tools',
    publishedAt: new Date('2025-08-25'),
    featured: true
  }
];

function getTodaysFeaturedBlogPosts() {
  const posts = mockBlogPosts;
  const today = new Date('2025-08-25'); // 当前日期
  today.setHours(0, 0, 0, 0);
  
  console.log('📅 Today:', today.toDateString());
  console.log('📝 All posts:');
  posts.forEach(post => {
    console.log(`   - ${post.title.substring(0, 50)}... (${post.publishedAt.toDateString()})`);
  });
  
  // 首先尝试获取今天发布的文章
  const todaysPosts = posts.filter(post => {
    const publishDate = new Date(post.publishedAt);
    publishDate.setHours(0, 0, 0, 0);
    return publishDate.getTime() === today.getTime();
  });
  
  console.log(`\n🎯 Today's posts found: ${todaysPosts.length}`);
  todaysPosts.forEach(post => {
    console.log(`   ✅ ${post.title.substring(0, 50)}...`);
  });
  
  // 如果今天有发布的文章，只返回今天的文章
  if (todaysPosts.length > 0) {
    console.log('\n🔄 Returning today\'s posts only');
    return todaysPosts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  
  // 如果今天没有发布文章，只返回最近的一篇文章
  console.log('\n🔄 No posts today, returning most recent post');
  return posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 1);
}

console.log('🚀 Testing getTodaysFeaturedBlogPosts logic...\n');
const result = getTodaysFeaturedBlogPosts();

console.log('\n📊 Final result:');
result.forEach((post, index) => {
  console.log(`${index + 1}. ${post.title.substring(0, 50)}... (${post.publishedAt.toDateString()})`);
});

console.log(`\n✅ Total articles returned: ${result.length}`);
