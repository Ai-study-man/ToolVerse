import { BlogPost, BlogCategory, BLOG_CATEGORIES, BlogFilters } from '@/types/blog';
import { BlogAnalyticsService, BlogStats } from './blogAnalyticsService';

// 模拟博客数据 - 实际项目中可以连接到CMS或数据库
const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Fal AI Review (2025): Features, Pricing, Pros & Cons, and Best Alternatives',
    slug: 'fal-ai-review-2025-complete-guide',
    excerpt: 'Looking for Fal AI? Here\'s a complete review covering its features, pricing, pros & cons, and the best alternatives to Fal AI in 2025.',
    content: `<h1>Fal AI Review (2025) – Everything You Need to Know</h1>

<p>Fal AI is an emerging AI platform designed for creators, developers, and businesses looking for fast, scalable AI solutions. In this review, we'll cover Fal AI's features, pricing, advantages, disadvantages, and the best alternatives available in 2025.</p>

<h2>What is Fal AI?</h2>

<p>Fal AI is an AI-powered tool focused on image generation and API-based automation. Unlike traditional AI tools that only serve end-users, Fal AI is developer-friendly, offering APIs that integrate easily into apps, websites, and enterprise workflows.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
  <p class="text-blue-700">👉 <strong>Want to explore more tools?</strong> Visit our <a href="/" class="text-blue-600 hover:text-blue-800 underline">AI Tools Directory Homepage</a></p>
</div>

<h2>Key Features of Fal AI</h2>

<ul class="list-disc pl-6 space-y-2">
  <li><strong>🎨 AI Image Generation</strong> – Quickly create visuals from text prompts with high-quality outputs and various artistic styles.</li>
  <li><strong>🔌 API Access</strong> – Flexible integrations for developers and startups with comprehensive documentation and easy implementation.</li>
  <li><strong>📈 Scalable Infrastructure</strong> – Supports small projects and large enterprises with reliable performance and uptime.</li>
  <li><strong>🎭 Creative Freedom</strong> – Generates different styles and formats to match your creative vision and brand requirements.</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
  <p class="text-green-700">👉 <strong>Discover more</strong> <a href="/category/ai-tools-reviews" class="text-green-600 hover:text-green-800 underline">AI Image Generator Tools</a></p>
</div>

<h2>Fal AI Pricing Plans (2025)</h2>

<div class="overflow-x-auto">
  <table class="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Plan</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Pricing</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Features</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr>
        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Free Plan</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">$0</td>
        <td class="px-6 py-4 text-gray-900">Limited credits for testing AI generation, basic image quality</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Starter Plan</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">$10–$30/mo</td>
        <td class="px-6 py-4 text-gray-900">Expanded credits, basic API access, higher resolution outputs</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Pro / Business</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-900">Custom Quote</td>
        <td class="px-6 py-4 text-gray-900">High-volume API usage, enterprise support, priority processing</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
  <p class="text-yellow-700">👉 <strong>Compare more cost-effective options</strong> in our <a href="/category/ai-comparisons" class="text-yellow-600 hover:text-yellow-800 underline">Best AI Tool Deals</a></p>
</div>

<h2>Pros & Cons of Fal AI</h2>

<h3 class="text-lg font-semibold text-green-600 mb-3">✅ Pros</h3>
<ul class="list-disc pl-6 space-y-2 mb-6">
  <li><strong>Developer-friendly API</strong> with excellent documentation and support</li>
  <li><strong>Fast and scalable AI performance</strong> suitable for production environments</li>
  <li><strong>Affordable starter pricing</strong> making it accessible for small businesses</li>
  <li><strong>High-quality image generation</strong> with various artistic styles</li>
  <li><strong>Reliable uptime</strong> and consistent performance</li>
</ul>

<h3 class="text-lg font-semibold text-red-600 mb-3">❌ Cons</h3>
<ul class="list-disc pl-6 space-y-2">
  <li><strong>Fewer templates</strong> compared to established competitors like MidJourney</li>
  <li><strong>Limited community support</strong> and smaller user base</li>
  <li><strong>Still expanding ecosystem</strong> with fewer third-party integrations</li>
  <li><strong>Learning curve</strong> for non-technical users</li>
  <li><strong>Limited customization options</strong> in the free tier</li>
</ul>

<h2>Best Alternatives to Fal AI</h2>

<div class="space-y-4">
  <div>
    <h3 class="text-lg font-semibold mb-2">1. Stable Diffusion</h3>
    <p><a href="/category/ai-tools-reviews" class="text-blue-600 hover:text-blue-800 underline">Stable Diffusion Tools</a> – Open-source, flexible, and highly customizable with extensive community support.</p>
  </div>
  
  <div>
    <h3 class="text-lg font-semibold mb-2">2. MidJourney</h3>
    <p><a href="/category/ai-tools-reviews" class="text-purple-600 hover:text-purple-800 underline">MidJourney Tools</a> – Famous for artistic, creative image styles with exceptional quality and unique aesthetics.</p>
  </div>
  
  <div>
    <h3 class="text-lg font-semibold mb-2">3. Runway ML</h3>
    <p><a href="/category/ai-tools-reviews" class="text-green-600 hover:text-green-800 underline">AI Video Tools</a> – Best for video generation and creative workflows with advanced editing capabilities.</p>
  </div>
  
  <div>
    <h3 class="text-lg font-semibold mb-2">4. DALL·E 3</h3>
    <p><a href="/category/ai-tools-reviews" class="text-red-600 hover:text-red-800 underline">DALL·E Tools</a> – Easy-to-use, integrates seamlessly with ChatGPT and offers excellent prompt understanding.</p>
  </div>
</div>

<h2>How to Get Started with Fal AI</h2>

<ol class="list-decimal pl-6 space-y-2">
  <li><strong>Step 1:</strong> Visit the official Fal AI website and create your account</li>
  <li><strong>Step 2:</strong> Verify your email and complete the onboarding process</li>
  <li><strong>Step 3:</strong> Try generating images with your free credits to test the platform</li>
  <li><strong>Step 4:</strong> Explore the API documentation if you're planning integrations</li>
  <li><strong>Step 5:</strong> Upgrade to a paid plan based on your usage requirements</li>
</ol>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
  <p class="text-blue-700">💡 <strong>Pro Tip:</strong> Start with the free plan to understand the platform capabilities before committing to a paid subscription.</p>
</div>

<h2>Use Cases for Fal AI</h2>

<ul class="list-disc pl-6 space-y-2">
  <li><strong>E-commerce Product Images</strong> – Generate product mockups and variations</li>
  <li><strong>Social Media Content</strong> – Create engaging visuals for marketing campaigns</li>
  <li><strong>App Development</strong> – Integrate AI image generation into mobile and web applications</li>
  <li><strong>Creative Projects</strong> – Design artwork, illustrations, and concept art</li>
  <li><strong>Business Presentations</strong> – Generate custom graphics and visual elements</li>
</ul>

<h2>Final Verdict</h2>

<p>Fal AI is a solid choice for developers and startups looking for a reliable AI image generation tool with flexible API access. While it still has room to grow compared to larger platforms like MidJourney and DALL·E, its scalability and affordability make it an excellent option for early adopters in 2025.</p>

<div class="bg-gray-50 p-4 rounded-lg my-4">
  <p><strong>Best for:</strong> Developers, startups, and businesses needing API-based AI image generation</p>
  <p><strong>Skip if:</strong> You need extensive templates or prefer established platforms with large communities</p>
</div>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
  <p class="text-blue-700">👉 <strong>Looking for more comparisons?</strong> Visit our <a href="/" class="text-blue-600 hover:text-blue-800 underline">AI Tools Directory Homepage</a></p>
</div>

<hr class="my-8">

<p class="text-sm text-gray-600"><em>Last updated: August 2025 | This review is based on the latest features and pricing available at the time of publication.</em></p>`,
    author: {
      name: 'AI Tools Expert',
      avatar: '/avatars/ai-expert.jpg',
      bio: 'Specialized in AI tools analysis and reviews',
      social: {
        twitter: '@aitoolsexpert',
        linkedin: 'ai-tools-expert'
      }
    },
    category: {
      id: '1',
      name: 'AI Tools Reviews',
      slug: 'ai-tools-reviews',
      description: 'In-depth reviews and comparisons of AI tools',
      color: '#2563eb',
      icon: '⭐',
      postCount: 1,
      seoKeywords: ['AI tool review', 'best AI tools', 'AI software comparison', 'artificial intelligence review']
    },
    tags: ['Fal AI', 'AI Image Generation', 'API Tools', 'Developer Tools', 'AI Review', 'Image AI'],
    publishedAt: new Date('2025-08-20'),
    updatedAt: new Date('2025-08-20'),
    readingTime: 8,
    featured: true,
    seoTitle: 'Fal AI Review (2025): Complete Guide to Features, Pricing & Alternatives',
    seoDescription: 'Looking for Fal AI? Here\'s a complete review covering its features, pricing, pros & cons, and the best alternatives to Fal AI in 2025.',
    coverImage: '/pictures/Fal AI.png',
    status: 'published',
    relatedTools: ['fal-ai', 'stable-diffusion', 'midjourney', 'dalle'],
    viewCount: 0, // 将由真实数据替换
    shareCount: 0, // 将由真实数据替换
    keywords: ['Fal AI review', 'AI image generation', 'Fal AI pricing', 'Fal AI alternatives', 'AI API tools', 'developer AI tools', 'best AI image generators 2025']
  }
];

// Blog service functions
export async function getAllBlogPosts(filters?: BlogFilters): Promise<BlogPost[]> {
  let posts = [...MOCK_BLOG_POSTS];

  // 获取真实的统计数据
  const blogIds = posts.map(post => post.id);
  const statsMap = await BlogAnalyticsService.getMultipleBlogStats(blogIds);

  // 更新统计数据
  posts = posts.map(post => {
    const stats = statsMap.get(post.id);
    if (stats) {
      return {
        ...post,
        viewCount: stats.viewCount,
        shareCount: stats.shareCount
      };
    }
    return post;
  });

  if (filters) {
    if (filters.category) {
      posts = posts.filter(post => post.category.slug === filters.category);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      posts = posts.filter(post => 
        post.tags.some(tag => 
          filters.tags!.some(filterTag => 
            tag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }
    
    if (filters.featured !== undefined) {
      posts = posts.filter(post => post.featured === filters.featured);
    }
    
    if (filters.dateRange) {
      posts = posts.filter(post => 
        post.publishedAt >= filters.dateRange!.start && 
        post.publishedAt <= filters.dateRange!.end
      );
    }
  }

  // Sort posts
  if (filters?.sortBy) {
    if (filters.sortBy === 'latest') {
      posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    } else if (filters.sortBy === 'popular') {
      posts.sort((a, b) => b.viewCount - a.viewCount);
    } else if (filters.sortBy === 'trending') {
      posts.sort((a, b) => b.shareCount - a.shareCount);
    }
  } else {
    // Default sort by publish date
    posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllBlogPosts();
  const post = allPosts.find(post => post.slug === slug);
  
  if (!post) return null;

  // 获取真实的统计数据
  const stats = await BlogAnalyticsService.getBlogStats(post.id);
  
  return {
    ...post,
    viewCount: stats.viewCount,
    shareCount: stats.shareCount
  };
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  return getAllBlogPosts({ category: categorySlug });
}

export async function getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
}

export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    post.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  );
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return BLOG_CATEGORIES;
}

export async function getBlogCategory(slug: string): Promise<BlogCategory | null> {
  return BLOG_CATEGORIES.find(category => category.slug === slug) || null;
}

// 获取特色文章
export async function getFeaturedBlogPosts(limit: number = 6): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  
  // 先获取标记为featured的文章
  const featuredPosts = allPosts
    .filter(post => post.featured && post.status === 'published')
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  
  // 如果featured文章不够，补充最新的文章
  if (featuredPosts.length < limit) {
    const latestPosts = allPosts
      .filter(post => !post.featured && post.status === 'published')
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit - featuredPosts.length);
    
    return [...featuredPosts, ...latestPosts];
  }
  
  return featuredPosts.slice(0, limit);
}

// 相关文章推荐
export async function getRelatedPosts(
  currentPostId: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  const currentPost = allPosts.find(post => post.id === currentPostId);
  
  if (!currentPost) return [];
  
  // 优先选择同类别的文章
  const sameCategoryPosts = allPosts
    .filter(post => 
      post.id !== currentPostId && 
      post.category.id === currentPost.category.id &&
      post.status === 'published'
    )
    .slice(0, limit);
  
  // 如果同类别文章不够，补充其他文章
  if (sameCategoryPosts.length < limit) {
    const otherPosts = allPosts
      .filter(post => 
        post.id !== currentPostId && 
        post.category.id !== currentPost.category.id &&
        post.status === 'published'
      )
      .slice(0, limit - sameCategoryPosts.length);
    
    return [...sameCategoryPosts, ...otherPosts];
  }
  
  return sameCategoryPosts;
}

// Utility functions
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function generateBlogPostSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown formatting
  const plainText = content
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/`([^`]+)`/g, '$1') // Remove code
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength - 3) + '...';
}