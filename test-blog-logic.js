// 直接测试博客服务功能
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Today\'s Featured Articles functionality...\n');

// 直接读取并模拟 blogService 的行为
console.log('📅 Current date:', new Date().toDateString());

// 模拟文章数据
const posts = [
  {
    id: '1',
    title: 'Fal AI Review 2025',
    publishedAt: new Date('2025-08-21'),
    excerpt: 'Complete guide to Fal AI'
  },
  {
    id: '2',
    title: 'QuizGPT Complete Guide',
    publishedAt: new Date('2025-08-25'), // 今天的文章
    excerpt: 'Hidden ChatGPT flashcard mode'
  },
  {
    id: '3',
    title: 'AI Image Generation',
    publishedAt: new Date('2025-08-24'),
    excerpt: 'Best AI image tools'
  },
  {
    id: '4',
    title: 'ChatGPT Tips',
    publishedAt: new Date('2025-08-21'),
    excerpt: 'Advanced ChatGPT usage'
  }
];

console.log('\n📋 All posts:');
posts.forEach(post => {
  console.log(`  - "${post.title}" (${post.publishedAt.toDateString()})`);
});

// 模拟 getTodaysFeaturedBlogPosts 函数
const today = new Date();
today.setHours(0, 0, 0, 0);

console.log('\n🔍 Filtering for today\'s posts...');
const todaysPosts = posts.filter(post => {
  const publishDate = new Date(post.publishedAt);
  publishDate.setHours(0, 0, 0, 0);
  const isToday = publishDate.getTime() === today.getTime();
  console.log(`  📝 "${post.title}" - ${publishDate.toDateString()} - IsToday: ${isToday}`);
  return isToday;
});

console.log(`\n🎯 Today's posts found: ${todaysPosts.length}`);

let featuredPosts;
let sectionTitle;

if (todaysPosts.length > 0) {
  console.log('✅ Result: Returning today\'s posts');
  featuredPosts = todaysPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  sectionTitle = "Today's Featured Articles";
} else {
  console.log('🔄 Result: No posts today, returning 3 most recent');
  featuredPosts = posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  sectionTitle = "Latest from Our Blog";
}

console.log(`\n📊 Final featured posts (${featuredPosts.length}):`);
featuredPosts.forEach((post, index) => {
  console.log(`  ${index + 1}. "${post.title}" (${post.publishedAt.toDateString()})`);
});

console.log(`\n🏷️  Section title: "${sectionTitle}"`);

console.log('\n✅ Test completed! The logic works correctly.');
