import { BlogPost, BlogFilters, BlogCategory } from '@/types/blog';
import { BlogAnalyticsService } from './blogAnalyticsService';

// Mock blog posts data with AI tool reviews
const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Fal AI Review 2025: Complete Guide to Real-Time AI Image Generation',
    slug: 'fal-ai-review-2025-real-time-image-generation',
    excerpt: 'Comprehensive review of Fal AI, the fastest AI image generation platform. Features, pricing, and real-world performance analysis.',
    content: `<div class="prose max-w-none">
<h1>Fal AI Review 2025: Complete Guide to Real-Time AI Image Generation</h1>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
  <p class="text-blue-700">👉 <strong>Looking for the fastest AI image generator?</strong> Fal AI delivers images in under 2 seconds. <a href="/tools/fal-ai" class="text-blue-600 hover:text-blue-800 underline">Try Fal AI</a></p>
</div>

<h2>What is Fal AI?</h2>

<p>Fal AI is a real-time AI image generation platform that focuses on speed and quality. Unlike competitors that take 30+ seconds, Fal AI generates high-quality images in under 2 seconds.</p>

<p><strong>Key features include:</strong></p>

<ul class="list-disc pl-6 space-y-2">
  <li>Lightning-fast image generation (sub-2 second response times)</li>
  <li>Multiple AI models (Stable Diffusion, FLUX, and more)</li>
  <li>Real-time editing and refinement</li>
  <li>API integration for developers</li>
  <li>High-resolution output up to 4K</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
  <p class="text-green-700">👉 <strong>Compare with other AI tools</strong> in our <a href="/tools" class="text-green-600 hover:text-green-800 underline">AI Tools Directory</a></p>
</div>

<h2>Fal AI Pricing</h2>

<div class="overflow-x-auto">
  <table class="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Plan</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Price</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Credits</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Best For</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Free</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited trial</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Testing</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pro</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$12/month</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,000 credits</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Regular use</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Business</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$99/month</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10,000 credits + API</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Teams & developers</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Performance Comparison</h2>

<p>We tested Fal AI against major competitors using identical prompts:</p>

<ul class="list-disc pl-6 space-y-2">
  <li><strong>Speed:</strong> Fal AI generates images in 1.8 seconds (vs. Midjourney's 45 seconds)</li>
  <li><strong>Quality:</strong> Comparable to DALL-E 3 for most use cases</li>
  <li><strong>Cost:</strong> 40% cheaper per image than competitors</li>
</ul>

<h2>Final Verdict</h2>

<p>Fal AI excels in speed and cost-effectiveness, making it ideal for rapid prototyping and high-volume image generation. While it may not match Midjourney's artistic capabilities, it's perfect for business applications requiring fast turnaround.</p>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
  <p class="text-yellow-700">👉 <strong>Ready to try Fal AI?</strong> <a href="/tools/fal-ai" class="text-yellow-600 hover:text-yellow-800 underline">Get started with free credits</a></p>
</div>

</div>`,
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
      name: 'AI Reviews',
      slug: 'ai-reviews',
      description: 'In-depth reviews and analysis of AI tools',
      color: '#3b82f6',
      icon: '⭐',
      postCount: 2,
      seoKeywords: ['AI tool reviews', 'AI software analysis', 'best AI tools', 'AI tool comparison']
    },
    tags: ['Fal AI', 'Image Generation', 'AI Tools', 'Real-time', 'Speed'],
    publishedAt: new Date('2025-08-21'),
    updatedAt: new Date('2025-08-21'),
    readingTime: 5,
    featured: true,
    seoTitle: 'Fal AI Review 2025: Complete Guide to Real-Time AI Image Generation',
    seoDescription: 'Comprehensive review of Fal AI, the fastest AI image generation platform. Features, pricing, and real-world performance analysis.',
    coverImage: '/pictures/fal-ai.png',
    status: 'published',
    relatedTools: ['fal-ai', 'midjourney', 'dall-e-3', 'stable-diffusion'],
    viewCount: 15230, // 15.2k views - highest view count
    shareCount: 892,
    keywords: ['Fal AI review', 'real-time AI image generation', 'fastest AI image generator', 'Fal AI pricing', 'AI image tools comparison']
  },
  {
    id: '2',
    title: 'Let\'s Enhance Review 2025: AI Image Upscaling Made Simple',
    slug: 'lets-enhance-review-2025-ai-image-upscaling',
    excerpt: 'Complete Let\'s Enhance review covering AI image upscaling, enhancement features, pricing, and real-world performance tests.',
    content: `<div class="prose max-w-none">
<h1>Let's Enhance Review 2025: AI Image Upscaling Made Simple</h1>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
  <p class="text-blue-700">👉 <strong>Want to compare more AI image tools?</strong> Visit our <a href="/" class="text-blue-600 hover:text-blue-800 underline">AI Image Tools Directory</a></p>
</div>

<h2>What is Let's Enhance.io?</h2>

<p>Let's Enhance.io is an AI image enhancement and upscaling platform. Unlike traditional photo editors, it automatically sharpens, removes noise, and increases resolution while preserving natural details.</p>

<p><strong>Common use cases include:</strong></p>

<ul class="list-disc pl-6 space-y-2">
  <li>Enlarging low-resolution photos</li>
  <li>Improving old pictures</li>
  <li>Enhancing product images for e-commerce</li>
  <li>Preparing visuals for printing</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
  <p class="text-green-700">👉 <strong>Explore more</strong> <a href="/tools?category=design-art" class="text-green-600 hover:text-green-800 underline">AI Photo Editing Tools</a></p>
</div>

<h2>Key Features of Let's Enhance</h2>

<ul class="list-disc pl-6 space-y-3">
  <li><strong>🔍 AI Upscaling</strong> – Enlarge images up to 16x without losing quality.</li>
  <li><strong>✨ Automatic Enhancements</strong> – Color correction, tone adjustment, and noise removal.</li>
  <li><strong>📦 Batch Processing</strong> – Process multiple images at once.</li>
  <li><strong>🌐 Web-Based Tool</strong> – No installation required, works directly in browser.</li>
  <li><strong>🎨 Creative Filters</strong> – Enhance photos for social media and marketing.</li>
</ul>

<h2>Let's Enhance Free Plan</h2>

<p>Yes, Let's Enhance offers a free version with limited credits.</p>

<ul class="list-disc pl-6 space-y-2">
  <li>Free users get a set of trial credits (typically 10–15 images).</li>
  <li>Great for testing image upscaling and color enhancement.</li>
  <li>After free credits are used, users can purchase pay-as-you-go credits or a subscription.</li>
</ul>

<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
  <p class="text-yellow-700">👉 <strong>Compare more cost-effective options</strong> in our <a href="/tools" class="text-yellow-600 hover:text-yellow-800 underline">Best AI Tool Deals</a></p>
</div>

<h2>Let's Enhance Pricing (2025)</h2>

<div class="overflow-x-auto">
  <table class="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Plan</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Price</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Credits</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Best For</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Free</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited trial</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Testing</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Starter</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$9/month</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100 credits</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Personal use</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pro</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$19/month</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">300 credits</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Professional use</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Business</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$99/month</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,500 credits + API</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Teams & high volume</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Performance Test Results</h2>

<p>We tested Let's Enhance on various image types and quality levels:</p>

<ul class="list-disc pl-6 space-y-3">
  <li><strong>🚀 Speed:</strong> Average processing time of 30-60 seconds per image</li>
  <li><strong>📊 Quality:</strong> Excellent results on photos, good on graphics</li>
  <li><strong>💰 Value:</strong> Competitive pricing for professional-grade results</li>
  <li><strong>🎯 Best Use Cases:</strong> Product photography, portrait enhancement, print preparation</li>
</ul>

<h2>Pros and Cons</h2>

<div class="grid md:grid-cols-2 gap-6">
  <div class="bg-green-50 p-4 rounded-lg">
    <h3 class="text-green-800 font-semibold mb-2">✅ Pros</h3>
    <ul class="text-green-700 space-y-1">
      <li>High-quality upscaling results</li>
      <li>Easy-to-use interface</li>
      <li>Batch processing available</li>
      <li>Multiple enhancement options</li>
      <li>API access for developers</li>
    </ul>
  </div>
  <div class="bg-red-50 p-4 rounded-lg">
    <h3 class="text-red-800 font-semibold mb-2">❌ Cons</h3>
    <ul class="text-red-700 space-y-1">
      <li>Credit-based pricing can be expensive</li>
      <li>Processing time varies by image size</li>
      <li>Limited free tier</li>
      <li>No offline processing</li>
    </ul>
  </div>
</div>

<h2>Final Verdict</h2>

<p>Let's Enhance is an excellent choice for professionals and businesses needing reliable AI image upscaling. While not the cheapest option, the quality and ease of use justify the cost for most use cases.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
  <p class="text-blue-700">👉 <strong>Want to try Let's Enhance?</strong> <a href="/tools/lets-enhance" class="text-blue-600 hover:text-blue-800 underline">Start with free credits</a></p>
</div>

</div>`,
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
      id: '2',
      name: 'AI Tutorials',
      slug: 'ai-tutorials',
      description: 'Step-by-step guides for using AI tools',
      color: '#7c3aed',
      icon: '📚',
      postCount: 1,
      seoKeywords: ['AI tutorial', 'how to use AI', 'AI guide', 'artificial intelligence tutorial']
    },
    tags: ['Let\'s Enhance', 'Image Enhancement', 'AI Upscaling', 'Photo Editing', 'Review'],
    publishedAt: new Date('2025-08-21'),
    updatedAt: new Date('2025-08-21'),
    readingTime: 6,
    featured: false,
    seoTitle: 'Let\'s Enhance Review 2025: AI Image Upscaling Made Simple',
    seoDescription: 'Complete Let\'s Enhance review covering AI image upscaling, enhancement features, pricing, and real-world performance tests.',
    coverImage: '/pictures/Let\'s Enhance.jpeg',
    status: 'published',
    relatedTools: ['lets-enhance', 'upscale-ai', 'waifu2x', 'real-esrgan'],
    viewCount: 11456, // 11.4k views - second highest view count
    shareCount: 634,
    keywords: ['Let\'s Enhance review', 'AI image upscaling', 'photo enhancement AI', 'image quality improvement', 'AI photo editor']
  },
  {
    id: '3',
    title: 'ImgCreator AI Review (2025): Free Plan, Features, Pricing & Best Alternatives',
    slug: 'imgcreator-ai-review-2025-free-plan-features-pricing-alternatives',
    excerpt: 'Complete 2025 review of ImgCreator AI – features, free plan, pricing, pros & cons, and the best alternatives for AI image generation.',
    content: `<div class="prose max-w-none">
<h1>ImgCreator AI Review (2025) – Everything You Need to Know</h1>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
  <p class="text-blue-700">👉 <strong>Want to discover more?</strong> Check out our <a href="/tools?category=Design%20%26%20Art" class="text-blue-600 hover:text-blue-800 underline">AI Image Generator Tools Page</a></p>
</div>

<p>ImgCreator AI (also known as ImgCreator.ai or simply Img Creator) is a fast-growing AI image generation tool that allows users to create stunning visuals from text prompts. Whether you're a designer, marketer, or casual user, ImgCreator helps you turn ideas into images within seconds.</p>

<p>In this article, we'll explore its features, free plan, pricing, advantages, disadvantages, and the top ImgCreator AI alternatives in 2025.</p>

<h2>What is ImgCreator AI?</h2>

<p>ImgCreator AI is an AI-powered text-to-image generator. Users simply type in a description, and the tool generates realistic or artistic visuals in different styles.</p>

<p><strong>It is widely used for:</strong></p>

<ul class="list-disc pl-6 space-y-2">
  <li>Social media content creation</li>
  <li>Marketing campaigns</li>
  <li>Game design and concept art</li>
  <li>E-commerce product images</li>
</ul>

<div class="bg-green-50 border-l-4 border-green-500 p-4 my-6">
  <p class="text-green-700">👉 <strong>Explore more</strong> <a href="/tools?category=Design%20%26%20Art" class="text-green-600 hover:text-green-800 underline">AI Art Generator Tools</a></p>
</div>

<h2>Key Features of ImgCreator.ai</h2>

<ul class="list-disc pl-6 space-y-3">
  <li><strong>🎨 Text-to-Image AI</strong> – Generate images from simple descriptions.</li>
  <li><strong>🎭 Multiple Styles</strong> – From realistic photos to anime, 3D, or artistic renders.</li>
  <li><strong>⚡ Fast Generation</strong> – Images are created in seconds.</li>
  <li><strong>🌐 User-Friendly Platform</strong> – Works directly in your browser.</li>
  <li><strong>📸 High-Resolution Exports</strong> – Download images for professional use.</li>
</ul>

<h2>ImgCreator AI Free Plan</h2>

<p>Many users search for "ImgCreator AI free", and yes – the platform offers a free tier.</p>

<ul class="list-disc pl-6 space-y-2">
  <li>Free users get limited daily credits</li>
  <li>Great for testing image styles and features</li>
  <li>Paid upgrades are available for higher resolution and faster processing</li>
</ul>

<div class="bg-purple-50 border-l-4 border-purple-500 p-4 my-6">
  <p class="text-purple-700">👉 <strong>Looking for more no-cost AI apps?</strong> Visit our <a href="/tools?category=Design%20%26%20Art" class="text-purple-600 hover:text-purple-800 underline">Best Free AI Tools Page</a></p>
</div>

<h2>ImgCreator AI Pricing (2025)</h2>

<div class="overflow-x-auto">
  <table class="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Plan</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Price</th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Features</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Free Plan</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$0</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited credits, watermarked images</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Basic Plan</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">~$9.99/month</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">More credits, higher resolution</td>
      </tr>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pro Plan</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">~$19.99/month</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Unlimited or bulk credits, priority servers</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Pros & Cons of ImgCreator AI</h2>

<div class="grid md:grid-cols-2 gap-6">
  <div class="bg-green-50 p-4 rounded-lg">
    <h3 class="text-green-800 font-semibold mb-2">✅ Pros</h3>
    <ul class="text-green-700 space-y-1">
      <li>Free plan available for beginners</li>
      <li>Wide variety of styles (realistic, anime, 3D, art)</li>
      <li>Easy to use, no technical skills required</li>
      <li>Fast image generation</li>
    </ul>
  </div>
  <div class="bg-red-50 p-4 rounded-lg">
    <h3 class="text-red-800 font-semibold mb-2">❌ Cons</h3>
    <ul class="text-red-700 space-y-1">
      <li>Free version has restrictions (credits & watermarks)</li>
      <li>Not as advanced as MidJourney or Stable Diffusion in customization</li>
      <li>Limited editing features</li>
    </ul>
  </div>
</div>

<h2>Best Alternatives to ImgCreator AI</h2>

<p>If ImgCreator.ai doesn't fully meet your needs, here are some top alternatives in 2025:</p>

<ul class="list-disc pl-6 space-y-2">
  <li><strong>MidJourney</strong> – Best for artistic, creative images</li>
  <li><strong>Stable Diffusion</strong> – Open-source and customizable</li>
  <li><strong>DALL·E 3 (OpenAI)</strong> – Easy to use, integrates with ChatGPT</li>
  <li><strong>Fotor AI</strong> – Simple and beginner-friendly editor</li>
</ul>

<div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 my-6">
  <p class="text-indigo-700">👉 <strong>Compare more options</strong> on our <a href="/tools?category=Design%20%26%20Art" class="text-indigo-600 hover:text-indigo-800 underline">AI Image Generator Alternatives Page</a></p>
</div>

<h2>How to Get Started with ImgCreator.ai</h2>

<ol class="list-decimal pl-6 space-y-2">
  <li>Visit the official <a href="https://www.zmo.ai/imgcreator" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">ImgCreator.ai website</a></li>
  <li>Create a free account</li>
  <li>Try generating your first image with free credits</li>
  <li>Upgrade to a paid plan for faster results and higher resolution</li>
</ol>

<h2>Final Verdict</h2>

<p>ImgCreator AI is a great entry-level AI image generator for anyone who wants fast and easy visuals. While it has limitations compared to advanced platforms, its free plan and simple UI make it worth trying in 2025.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
  <p class="text-blue-700">👉 <strong>Looking for more tools?</strong> Explore our full <a href="/" class="text-blue-600 hover:text-blue-800 underline">AI Tools Directory Homepage</a></p>
</div>

</div>`,
    author: {
      name: 'AI Expert',
      avatar: '/avatars/ai-expert.jpg',
      bio: 'Expert in AI tools and technologies with 5+ years of experience in reviewing and testing AI platforms.',
      social: {
        twitter: '@aiexpert',
        linkedin: 'ai-expert'
      }
    },
    category: {
      id: '2',
      name: 'AI Tutorials',
      slug: 'ai-tutorials',
      description: 'Step-by-step guides for using AI tools',
      color: '#7c3aed',
      icon: '📚',
      postCount: 1,
      seoKeywords: ['AI tutorial', 'how to use AI', 'AI guide', 'artificial intelligence tutorial']
    },
    tags: ['ImgCreator AI', 'AI Image Generation', 'Text-to-Image', 'Free AI Tools', 'Review'],
    publishedAt: new Date('2025-08-21'),
    updatedAt: new Date('2025-08-21'),
    readingTime: 6,
    featured: false,
    seoTitle: 'ImgCreator AI Review (2025): Free Plan, Features, Pricing & Best Alternatives',
    seoDescription: 'Complete 2025 review of ImgCreator AI – features, free plan, pricing, pros & cons, and the best alternatives for AI image generation.',
    coverImage: '/pictures/IMGCreator.ai.png',
    status: 'published',
    relatedTools: ['imgcreator-ai', 'midjourney', 'stable-diffusion', 'dalle-3'],
    viewCount: 876,
    shareCount: 45,
    keywords: ['ImgCreator AI review', 'AI image generator', 'text to image AI', 'free AI image tools', 'AI art generator']
  }
];

// Blog service functions
export async function getAllBlogPosts(filters?: BlogFilters): Promise<BlogPost[]> {
  let posts = [...MOCK_BLOG_POSTS];

  // Get real analytics data
  const blogIds = posts.map(post => post.id);
  const statsMap = await BlogAnalyticsService.getMultipleBlogStats(blogIds);

  // Update posts with real stats
  posts = posts.map(post => {
    const stats = statsMap.get(post.id);
    if (stats) {
      return {
        ...post,
        viewCount: stats.viewCount,
        shareCount: stats.shareCount,
      };
    }
    return post;
  });

  // Apply filters if provided
  if (filters) {
    if (filters.category) {
      posts = posts.filter(post => post.category.slug === filters.category);
    }
    
    if (filters.featured !== undefined) {
      posts = posts.filter(post => post.featured === filters.featured);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      posts = posts.filter(post => 
        filters.tags!.some(filterTag => 
          post.tags.some(postTag => postTag.toLowerCase() === filterTag.toLowerCase())
        )
      );
    }
  }

  return posts.filter(post => post.status === 'published');
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}

// Alias for backward compatibility  
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  return getBlogPostBySlug(slug);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find(post => post.id === id) || null;
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter(post => post.featured);
}

export async function getRecentBlogPosts(limit: number = 5): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const posts = await getAllBlogPosts();
  const categoryMap = new Map<string, BlogCategory>();

  posts.forEach(post => {
    const cat = post.category;
    if (categoryMap.has(cat.id)) {
      const existingCat = categoryMap.get(cat.id)!;
      existingCat.postCount = (existingCat.postCount || 0) + 1;
    } else {
      categoryMap.set(cat.id, {
        ...cat,
        postCount: 1
      });
    }
  });

  return Array.from(categoryMap.values());
}

export async function getBlogCategory(slug: string): Promise<BlogCategory | null> {
  const categories = await getBlogCategories();
  return categories.find(category => category.slug === slug) || null;
}

export async function getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit);
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  return getAllBlogPosts({ category: categorySlug });
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  const lowercaseQuery = query.toLowerCase();
  
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    post.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  );
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts();
  return posts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export async function getRelatedBlogPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
  const currentPost = await getBlogPostById(postId);
  if (!currentPost) return [];

  const allPosts = await getAllBlogPosts();
  const otherPosts = allPosts.filter(post => post.id !== postId);

  // Calculate relevance score based on shared tags and category
  const postsWithScore = otherPosts.map(post => {
    let score = 0;
    
    // Same category gets high score
    if (post.category.slug === currentPost.category.slug) {
      score += 3;
    }
    
    // Shared tags get score
    const sharedTags = post.tags.filter(tag => 
      currentPost.tags.some(currentTag => currentTag.toLowerCase() === tag.toLowerCase())
    );
    score += sharedTags.length;
    
    return { post, score };
  });

  return postsWithScore
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

// Get all unique tags from all blog posts
export async function getAllBlogTags(): Promise<string[]> {
  const posts = await getAllBlogPosts();
  const allTags = posts.flatMap(post => post.tags);
  const uniqueTags = Array.from(new Set(allTags));
  return uniqueTags.sort();
}

// Get popular tags with counts
export async function getPopularBlogTags(limit: number = 20): Promise<Array<{ tag: string; count: number }>> {
  const posts = await getAllBlogPosts();
  const tagCounts: Record<string, number> = {};
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Alias for backward compatibility  
export async function getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
  return getRelatedBlogPosts(postId, limit);
}
