import { Tool, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Writing & Content',
    slug: 'writing-content',
    description: 'AI tools for content creation, writing assistance, and copywriting',
    icon: '✍️',
    toolCount: 9
  },
  {
    id: '2',
    name: 'Design & Art',
    slug: 'design-art',
    description: 'AI-powered design tools, image generation, and creative assistance',
    icon: '🎨',
    toolCount: 8
  },
  {
    id: '3',
    name: 'Development',
    slug: 'development',
    description: 'AI coding assistants, debugging tools, and development productivity',
    icon: '💻',
    toolCount: 8
  },
  {
    id: '4',
    name: 'Business & Analytics',
    slug: 'business-analytics',
    description: 'Business intelligence, data analysis, and productivity tools',
    icon: '📊',
    toolCount: 8
  },
  {
    id: '5',
    name: 'Marketing & SEO',
    slug: 'marketing-seo',
    description: 'Marketing automation, SEO optimization, and growth tools',
    icon: '📈',
    toolCount: 8
  },
  {
    id: '6',
    name: 'Video & Audio',
    slug: 'video-audio',
    description: 'Video editing, audio processing, and multimedia creation',
    icon: '🎥',
    toolCount: 8
  },
  {
    id: '7',
    name: 'Language & Translation',
    slug: 'language-translation',
    description: 'Translation tools, language processing, and multilingual AI',
    icon: '🌐',
    toolCount: 3
  }
];

export const featuredTools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'ChatGPT is an AI chatbot developed by OpenAI that can engage in conversational dialogue and assist with a wide variety of tasks including writing, analysis, math, coding, and creative projects.',
    shortDescription: 'Advanced AI chatbot for conversations and task assistance',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+R1A8L3RleHQ+PC9zdmc+',
    website: 'https://chat.openai.com',
    category: 'Writing & Content',
    subcategory: 'AI Assistant',
    pricingModel: 'freemium',
    pricing: 'Free / $20/month',
    rating: 4.8,
    reviewCount: 2547,
    tags: ['Chatbot', 'Writing', 'Analysis', 'Coding'],
    features: [
      'Natural conversation abilities',
      'Code generation and debugging',
      'Writing and editing assistance',
      'Math and analysis support',
      'Creative project help'
    ],
    createdAt: '2023-01-01'
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'Midjourney is an AI-powered image generation tool that creates stunning artwork and images from text descriptions. Perfect for designers, artists, and creative professionals.',
    shortDescription: 'AI image generation from text descriptions',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjN2MzYWVkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+TUo8L3RleHQ+PC9zdmc+',
    website: 'https://midjourney.com',
    category: 'Design & Art',
    subcategory: 'Image Generation',
    pricingModel: 'paid',
    pricing: '$10-60/month',
    rating: 4.7,
    reviewCount: 1823,
    tags: ['Image Generation', 'Art', 'Design', 'Creative'],
    features: [
      'High-quality image generation',
      'Multiple art styles',
      'Discord integration',
      'Commercial usage rights',
      'Upscaling capabilities'
    ],
    createdAt: '2023-02-15'
  },
  {
    id: '3',
    name: 'GitHub Copilot',
    description: 'GitHub Copilot is an AI coding assistant that helps developers write code faster and with fewer errors. It provides intelligent code completions and suggestions.',
    shortDescription: 'AI-powered coding assistant for developers',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjMjU2M2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+R0g8L3RleHQ+PC9zdmc+',
    website: 'https://github.com/features/copilot',
    category: 'Development',
    subcategory: 'Code Assistant',
    pricingModel: 'paid',
    pricing: '$10/month',
    rating: 4.6,
    reviewCount: 3421,
    tags: ['Coding', 'Development', 'Autocomplete', 'VS Code'],
    features: [
      'Intelligent code suggestions',
      'Multiple language support',
      'IDE integration',
      'Context-aware completions',
      'Documentation generation'
    ],
    createdAt: '2023-03-01'
  }
];

export const allTools: Tool[] = [
  ...featuredTools,
  {
    id: '4',
    name: 'Jasper AI',
    description: 'Jasper is an AI writing assistant that helps create high-quality content for marketing, blogging, and business communications.',
    shortDescription: 'AI writing assistant for marketing content',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://jasper.ai',
    category: 'Writing & Content',
    subcategory: 'Content Creation',
    pricingModel: 'paid',
    pricing: '$29-59/month',
    rating: 4.5,
    reviewCount: 892,
    tags: ['Writing', 'Marketing', 'Content', 'Copywriting'],
    features: [
      'Marketing copy generation',
      'Blog post creation',
      'Social media content',
      'Email templates',
      'Brand voice training'
    ],
    createdAt: '2023-01-15'
  },
  {
    id: '5',
    name: 'Notion AI',
    description: 'Notion AI integrates artificial intelligence directly into your Notion workspace to help with writing, brainstorming, and content organization.',
    shortDescription: 'AI assistant integrated into Notion workspace',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjMjU2M2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://notion.so/ai',
    category: 'Business & Analytics',
    subcategory: 'Productivity',
    pricingModel: 'freemium',
    pricing: 'Free / $10/month',
    rating: 4.4,
    reviewCount: 1234,
    tags: ['Productivity', 'Writing', 'Organization', 'Workspace'],
    features: [
      'Writing assistance',
      'Content brainstorming',
      'Task automation',
      'Template generation',
      'Data analysis'
    ],
    createdAt: '2023-02-01'
  },
  {
    id: '6',
    name: 'Stable Diffusion',
    description: 'Stable Diffusion is an open-source AI image generation model that creates detailed images from text descriptions.',
    shortDescription: 'Open-source AI image generation model',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjNmI3Mjc5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://stability.ai',
    category: 'Design & Art',
    subcategory: 'Image Generation',
    pricingModel: 'free',
    pricing: 'Free',
    rating: 4.3,
    reviewCount: 2156,
    tags: ['Image Generation', 'Open Source', 'Art', 'Free'],
    features: [
      'Open-source model',
      'Local installation option',
      'Custom training',
      'Multiple interfaces',
      'Commercial usage'
    ],
    createdAt: '2023-01-20'
  },
  {
    id: '7',
    name: 'Copy.ai',
    description: 'Copy.ai is an AI-powered copywriting tool that helps create marketing copy, blog posts, social media content, and more in seconds.',
    shortDescription: 'AI copywriting tool for marketing content',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjNmI3Mjc5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://copy.ai',
    category: 'Writing & Content',
    subcategory: 'Copywriting',
    pricingModel: 'freemium',
    pricing: 'Free / $36/month',
    rating: 4.3,
    reviewCount: 1567,
    tags: ['Copywriting', 'Marketing', 'Content', 'Social Media'],
    features: [
      'Marketing copy templates',
      'Blog post generator',
      'Social media captions',
      'Email subject lines',
      'Product descriptions'
    ],
    createdAt: '2023-01-10'
  },
  {
    id: '8',
    name: 'Runway ML',
    description: 'Runway is a suite of AI-powered creative tools for video editing, image generation, and content creation.',
    shortDescription: 'AI-powered creative tools for video and images',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjNmI3Mjc5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://runwayml.com',
    category: 'Video & Audio',
    subcategory: 'Video Editing',
    pricingModel: 'freemium',
    pricing: 'Free / $12-35/month',
    rating: 4.6,
    reviewCount: 943,
    tags: ['Video Editing', 'AI Video', 'Creative', 'Content Creation'],
    features: [
      'AI video generation',
      'Background removal',
      'Object removal',
      'Style transfer',
      'Real-time collaboration'
    ],
    createdAt: '2023-02-10'
  },
  {
    id: '9',
    name: 'Framer AI',
    description: 'Framer AI helps designers create stunning websites with AI-powered design suggestions and automated layouts.',
    shortDescription: 'AI-powered website design tool',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjNmI3Mjc5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://framer.com',
    category: 'Design & Art',
    subcategory: 'Web Design',
    pricingModel: 'freemium',
    pricing: 'Free / $5-20/month',
    rating: 4.7,
    reviewCount: 2341,
    tags: ['Web Design', 'UI/UX', 'Prototyping', 'No-Code'],
    features: [
      'AI design suggestions',
      'Responsive layouts',
      'Interactive components',
      'Animation tools',
      'CMS integration'
    ],
    createdAt: '2023-03-05'
  },
  {
    id: '10',
    name: 'Replit AI',
    description: 'Replit AI is an intelligent coding assistant that helps developers write, debug, and explain code across multiple programming languages.',
    shortDescription: 'AI coding assistant for multiple languages',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjNmI3Mjc5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://replit.com/ai',
    category: 'Development',
    subcategory: 'Code Assistant',
    pricingModel: 'freemium',
    pricing: 'Free / $7-20/month',
    rating: 4.4,
    reviewCount: 1876,
    tags: ['Coding', 'Development', 'Debugging', 'Education'],
    features: [
      'Code generation',
      'Bug fixing',
      'Code explanation',
      'Multiple languages',
      'Real-time collaboration'
    ],
    createdAt: '2023-02-20'
  },
  {
    id: '11',
    name: 'Grammarly',
    description: 'Grammarly uses AI to help improve your writing by checking grammar, spelling, tone, and clarity across various platforms.',
    shortDescription: 'AI writing assistant for grammar and style',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjNmI3Mjc5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://grammarly.com',
    category: 'Writing & Content',
    subcategory: 'Writing Assistant',
    pricingModel: 'freemium',
    pricing: 'Free / $12-15/month',
    rating: 4.6,
    reviewCount: 5432,
    tags: ['Grammar', 'Writing', 'Editing', 'Productivity'],
    features: [
      'Grammar checking',
      'Spell checking',
      'Tone detection',
      'Plagiarism detection',
      'Browser integration'
    ],
    createdAt: '2023-01-05'
  },
  {
    id: '12',
    name: 'Canva AI',
    description: 'Canva AI offers intelligent design suggestions, automatic background removal, and AI-powered content generation for stunning visuals.',
    shortDescription: 'AI-powered design platform for everyone',
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjNmI3Mjc5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjIwIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+QUk8L3RleHQ+PC9zdmc+',
    website: 'https://canva.com',
    category: 'Design & Art',
    subcategory: 'Graphic Design',
    pricingModel: 'freemium',
    pricing: 'Free / $12-15/month',
    rating: 4.8,
    reviewCount: 8765,
    tags: ['Design', 'Graphics', 'Templates', 'Social Media'],
    features: [
      'AI design suggestions',
      'Background remover',
      'Magic resize',
      'Brand kit',
      'Team collaboration'
    ],
    createdAt: '2023-01-25'
  }
];
