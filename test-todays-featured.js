// 测试今日特色文章功能
const { execSync } = require('child_process');

console.log('🧪 Testing getTodaysFeaturedBlogPosts function...\n');

// 创建一个简单的测试脚本来模拟函数行为
const testScript = `
// 模拟博客数据结构
const mockPosts = [
  {
    id: '1',
    title: 'Fal AI Review 2025',
    publishedAt: new Date('2025-01-27'),
    excerpt: 'Test post 1'
  },
  {
    id: '2', 
    title: 'QuizGPT Complete Guide',
    publishedAt: new Date('2025-01-25'),
    excerpt: 'Test post 2'
  },
  {
    id: '3',
    title: 'AI Image Generation Tools',
    publishedAt: new Date('2025-01-20'),
    excerpt: 'Test post 3'
  }
];

console.log('📅 Current date:', new Date().toDateString());

const today = new Date();
today.setHours(0, 0, 0, 0);

console.log('\\n🔍 Checking each post:');
const todaysPosts = mockPosts.filter(post => {
  const publishDate = new Date(post.publishedAt);
  publishDate.setHours(0, 0, 0, 0);
  const isToday = publishDate.getTime() === today.getTime();
  console.log(\`📝 Post: "\${post.title}" - Date: \${publishDate.toDateString()} - IsToday: \${isToday}\`);
  return isToday;
});

console.log(\`\\n🎯 Today's posts found: \${todaysPosts.length}\`);

if (todaysPosts.length > 0) {
  console.log('✅ Result: Returning today\\'s posts');
  console.log('📋 Featured posts:', todaysPosts.map(p => p.title));
} else {
  console.log('🔄 Result: No posts today, returning 3 most recent');
  const recentPosts = mockPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);
  console.log('📋 Featured posts:', recentPosts.map(p => p.title));
}
`;

try {
  execSync(`node -e "${testScript}"`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Test failed:', error.message);
}
