// 测试 Today's Featured Articles 逻辑
const { getTodaysFeaturedBlogPosts, getAllBlogPosts } = require('./src/lib/blogService');

async function testTodaysArticles() {
  console.log('Testing Today\'s Featured Articles logic...\n');
  
  try {
    // 获取所有文章
    const allPosts = await getAllBlogPosts();
    console.log(`Total blog posts: ${allPosts.length}`);
    
    // 获取今天的精选文章
    const todaysPosts = await getTodaysFeaturedBlogPosts();
    console.log(`Today's featured posts: ${todaysPosts.length}`);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 检查是否有今天发布的文章
    const todaysActualPosts = allPosts.filter(post => {
      const publishDate = new Date(post.publishedAt);
      publishDate.setHours(0, 0, 0, 0);
      return publishDate.getTime() === today.getTime();
    });
    
    console.log(`\nActual posts published today: ${todaysActualPosts.length}`);
    
    if (todaysActualPosts.length > 0) {
      console.log('✅ Found posts published today:');
      todaysActualPosts.forEach(post => {
        console.log(`  - ${post.title} (${post.publishedAt.toDateString()})`);
      });
    } else {
      console.log('ℹ️  No posts published today, showing recent posts:');
      todaysPosts.forEach(post => {
        console.log(`  - ${post.title} (${post.publishedAt.toDateString()})`);
      });
    }
    
    console.log('\n=== Final displayed posts ===');
    todaysPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Published: ${post.publishedAt.toDateString()}`);
      console.log(`   Category: ${post.category.name}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error testing articles:', error);
  }
}

testTodaysArticles();
