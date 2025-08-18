/**
 * 价格功能演示脚本
 * 创建一些具有增强价格信息的示例工具
 */

const mockToolsWithPricing = [
  {
    id: 'demo-chatgpt',
    name: 'ChatGPT',
    description: 'AI-powered conversational assistant that can help with writing, coding, analysis, and more.',
    shortDescription: 'Advanced AI chatbot for various tasks',
    logo: '/logos/chatgpt.png',
    website: 'https://chatgpt.com',
    category: 'AI Assistant',
    pricingModel: 'freemium',
    pricing: 'Free + $20/month Pro',
    rating: 4.8,
    reviewCount: 12567,
    tags: ['AI Chat', 'Writing', 'Coding', 'Analysis'],
    features: [
      'Natural language conversations',
      'Code generation and debugging',
      'Creative writing assistance',
      'Data analysis and visualization',
      'Multi-language support'
    ],
    useCases: [
      'Content creation and editing',
      'Programming assistance',
      'Research and analysis',
      'Learning and tutoring'
    ],
    createdAt: '2023-01-01',
    // 增强的价格信息
    pricingTiers: [
      {
        name: 'Free',
        price: '$0',
        features: [
          'GPT-3.5 model access',
          'Standard response speed',
          'Web interface access',
          'Basic conversation history'
        ],
        limits: ['Limited usage per day', 'No priority access during peak times'],
        highlighted: false
      },
      {
        name: 'Plus',
        price: '$20/month',
        features: [
          'GPT-4 model access',
          'Faster response times',
          'Custom instructions',
          'Extended conversation history',
          'Plugin access',
          'Advanced data analysis',
          'Priority access during peak times'
        ],
        limits: ['Up to 40 messages every 3 hours for GPT-4'],
        highlighted: true
      }
    ]
  },
  
  {
    id: 'demo-enterprise-tool',
    name: 'Enterprise AI Platform',
    description: 'Comprehensive AI platform for large organizations with custom deployment and enterprise-grade security.',
    shortDescription: 'Enterprise AI solution',
    logo: '/logos/placeholder-logo.svg',
    website: 'https://enterprise-ai.com',
    category: 'Enterprise',
    pricingModel: 'paid',
    pricing: 'Contact for pricing',
    rating: 4.6,
    reviewCount: 234,
    tags: ['Enterprise', 'Custom AI', 'Security', 'Integration'],
    features: [
      'Custom AI model training',
      'Enterprise security compliance',
      'Dedicated support',
      'API integration suite',
      'Advanced analytics dashboard'
    ],
    useCases: [
      'Large-scale content automation',
      'Customer service optimization',
      'Data analysis and insights',
      'Process automation'
    ],
    createdAt: '2023-06-01',
    // 联系询价信息
    contactPricing: {
      type: 'quote',
      description: 'Our Enterprise AI Platform offers customized solutions tailored to your organization\'s specific needs, scale, and compliance requirements.',
      priceRange: '$10,000-$100,000/month per organization',
      contactMethod: 'Enterprise sales team: enterprise@ai-platform.com or schedule a consultation',
      responseTime: 'Within 24 hours for enterprise inquiries',
      requirements: [
        'Organization size and structure',
        'Expected user count and usage volume',
        'Required integrations and APIs',
        'Compliance and security requirements',
        'Deployment preferences (cloud/on-premise)',
        'Support level requirements'
      ]
    }
  },
  
  {
    id: 'demo-freemium-tool',
    name: 'Design Assistant Pro',
    description: 'AI-powered design tool that helps create graphics, layouts, and visual content with intelligent suggestions.',
    shortDescription: 'AI design assistant',
    logo: '/logos/placeholder-logo.svg',
    website: 'https://design-assistant.com',
    category: 'Design & Art',
    pricingModel: 'freemium',
    pricing: 'Free + $12-$45/month',
    rating: 4.4,
    reviewCount: 1567,
    tags: ['Design', 'Graphics', 'AI Art', 'Templates'],
    features: [
      'AI-powered design suggestions',
      'Template library',
      'Brand consistency tools',
      'Export in multiple formats',
      'Collaboration features'
    ],
    useCases: [
      'Social media graphics',
      'Marketing materials',
      'Presentations',
      'Brand identity design'
    ],
    createdAt: '2023-09-15',
    // 分层定价
    pricingTiers: [
      {
        name: 'Free',
        price: '$0',
        features: [
          '5 designs per month',
          'Basic templates',
          'Standard resolution exports',
          'Community support'
        ],
        limits: ['5 designs per month', 'Watermarked exports', 'Basic templates only'],
        highlighted: false
      },
      {
        name: 'Pro',
        price: '$12/month',
        features: [
          'Unlimited designs',
          'Premium templates',
          'High resolution exports',
          'Brand kit access',
          'Priority support',
          'No watermarks'
        ],
        limits: ['Single user license'],
        highlighted: true
      },
      {
        name: 'Team',
        price: '$45/month',
        features: [
          'Everything in Pro',
          'Team collaboration',
          'Shared brand assets',
          'Advanced analytics',
          'Admin controls',
          'Team training sessions'
        ],
        limits: ['Up to 10 team members'],
        highlighted: false
      }
    ]
  }
];

console.log('💰 价格功能演示工具数据:');
console.log('==================================');

mockToolsWithPricing.forEach((tool, index) => {
  console.log(`\n${index + 1}. ${tool.name}`);
  console.log(`   基础定价: ${tool.pricing}`);
  
  if (tool.pricingTiers) {
    console.log(`   ✅ 分层定价: ${tool.pricingTiers.length}个层级`);
    tool.pricingTiers.forEach(tier => {
      console.log(`      - ${tier.name}: ${tier.price} (${tier.features.length}个功能)`);
    });
  }
  
  if (tool.contactPricing) {
    console.log(`   ✅ 联系询价: ${tool.contactPricing.type} - ${tool.contactPricing.priceRange}`);
  }
});

console.log('\n📋 实现指南:');
console.log('==================================');
console.log('1. 在工具详情页面添加 <PricingDisplay tool={tool} />');
console.log('2. 对于现有的"Contact for pricing"工具，会自动生成联系询价信息');
console.log('3. 可以通过Notion数据库字段添加详细价格信息');
console.log('4. 支持价格区间显示和功能对比表');

export { mockToolsWithPricing };
