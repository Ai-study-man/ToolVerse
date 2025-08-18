import { Tool, PricingTier, ContactPricing } from '../types';

/**
 * 价格数据处理器
 * 处理工具的增强价格信息
 */
export class PricingDataProcessor {
  
  /**
   * 解析和验证价格层级数据
   */
  static parsePricingTiers(pricingTiersJson: string | null): PricingTier[] | undefined {
    if (!pricingTiersJson) return undefined;
    
    try {
      const parsed = JSON.parse(pricingTiersJson);
      if (!Array.isArray(parsed)) return undefined;
      
      return parsed.map((tier: any) => ({
        name: tier.name || '',
        price: tier.price || '',
        features: Array.isArray(tier.features) ? tier.features : [],
        limits: Array.isArray(tier.limits) ? tier.limits : undefined,
        highlighted: Boolean(tier.highlighted)
      }));
    } catch (error) {
      console.error('Error parsing pricing tiers:', error);
      return undefined;
    }
  }

  /**
   * 解析联系询价数据
   */
  static parseContactPricing(contactPricingJson: string | null): ContactPricing | undefined {
    if (!contactPricingJson) return undefined;
    
    try {
      const parsed = JSON.parse(contactPricingJson);
      
      return {
        type: parsed.type || 'contact',
        description: parsed.description || '',
        priceRange: parsed.priceRange || undefined,
        contactMethod: parsed.contactMethod || undefined,
        responseTime: parsed.responseTime || undefined,
        requirements: Array.isArray(parsed.requirements) ? parsed.requirements : undefined
      };
    } catch (error) {
      console.error('Error parsing contact pricing:', error);
      return undefined;
    }
  }

  /**
   * 增强工具数据，添加详细价格信息
   */
  static enhanceToolWithPricing(tool: Tool, enhancedPricingData?: any): Tool {
    if (!enhancedPricingData) return tool;

    const enhanced = { ...tool };

    // 添加价格层级数据
    if (enhancedPricingData.pricingTiers) {
      enhanced.pricingTiers = this.parsePricingTiers(enhancedPricingData.pricingTiers);
    }

    // 添加联系询价数据
    if (enhancedPricingData.contactPricing) {
      enhanced.contactPricing = this.parseContactPricing(enhancedPricingData.contactPricing);
    }

    return enhanced;
  }

  /**
   * 生成默认的联系询价数据（用于"Contact for pricing"的工具）
   */
  static generateDefaultContactPricing(tool: Tool): ContactPricing {
    const isEnterprise = tool.name.toLowerCase().includes('enterprise') || 
                        tool.pricing.toLowerCase().includes('enterprise');
    
    if (isEnterprise) {
      return {
        type: 'quote',
        description: `${tool.name} offers enterprise-grade solutions with custom pricing based on your organization's needs and scale.`,
        contactMethod: 'Enterprise sales team or official website contact form',
        responseTime: 'Within 24-48 hours for enterprise inquiries',
        requirements: [
          'Organization size and structure',
          'Expected user count',
          'Required features and integrations',
          'Compliance and security requirements',
          'Deployment timeline'
        ]
      };
    }

    // 通用联系询价模板
    return {
      type: 'contact',
      description: `${tool.name} provides customized pricing based on your specific use case and requirements. Contact their team for detailed pricing information.`,
      contactMethod: 'Official website contact form or sales team',
      responseTime: '1-2 business days',
      requirements: [
        'Use case description',
        'Expected usage volume',
        'Team size',
        'Integration requirements'
      ]
    };
  }

  /**
   * 智能价格分析：从现有pricing字符串中提取价格区间
   */
  static analyzePricingString(pricing: string): { range?: string; type: 'free' | 'paid' | 'freemium' | 'contact' } {
    const lower = pricing.toLowerCase();
    
    // 免费
    if (lower.includes('free') && !lower.includes('$') && !lower.includes('paid')) {
      return { type: 'free' };
    }
    
    // Freemium模式
    if (lower.includes('free') && (lower.includes('$') || lower.includes('paid') || lower.includes('pro'))) {
      // 尝试提取价格区间
      const priceMatch = pricing.match(/\$\d+(?:\.\d+)?(?:\/\w+)?(?:\s*-\s*\$\d+(?:\.\d+)?(?:\/\w+)?)?/);
      if (priceMatch) {
        return { type: 'freemium', range: priceMatch[0] };
      }
      return { type: 'freemium' };
    }
    
    // 需要联系
    if (lower.includes('contact') || lower.includes('quote') || lower.includes('custom')) {
      return { type: 'contact' };
    }
    
    // 纯付费
    const priceMatch = pricing.match(/\$\d+(?:\.\d+)?(?:\/\w+)?(?:\s*-\s*\$\d+(?:\.\d+)?(?:\/\w+)?)?/);
    if (priceMatch) {
      return { type: 'paid', range: priceMatch[0] };
    }
    
    return { type: 'paid' };
  }

  /**
   * 为"Contact for pricing"的工具自动生成增强价格信息
   */
  static autoEnhanceContactPricing(tool: Tool): Tool {
    const analysis = this.analyzePricingString(tool.pricing);
    
    if (analysis.type === 'contact' && !tool.contactPricing) {
      const enhanced = { ...tool };
      enhanced.contactPricing = this.generateDefaultContactPricing(tool);
      
      // 根据工具类型生成价格区间估算
      if (tool.category === 'Enterprise' || tool.name.toLowerCase().includes('enterprise')) {
        enhanced.contactPricing.priceRange = '$500-$5,000/month per organization';
      } else if (tool.category === 'Development' || tool.category === 'Business') {
        enhanced.contactPricing.priceRange = '$50-$500/month per team';
      } else {
        enhanced.contactPricing.priceRange = '$10-$100/month per user';
      }
      
      return enhanced;
    }
    
    return tool;
  }
}

/**
 * 预定义的增强价格数据（用于演示和测试）
 */
export const ENHANCED_PRICING_DATA: { [toolName: string]: any } = {
  'ChatGPT': {
    pricingTiers: JSON.stringify([
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
    ])
  },
  
  'Notion': {
    pricingTiers: JSON.stringify([
      {
        name: 'Personal',
        price: 'Free',
        features: [
          'Unlimited pages and blocks',
          'Share with up to 10 guests',
          'Sync across devices',
          '7 day page history'
        ],
        limits: ['10 guest collaborators', '7 day page history'],
        highlighted: false
      },
      {
        name: 'Personal Pro',
        price: '$4/month',
        features: [
          'Everything in Personal',
          'Unlimited guests',
          'Unlimited page history',
          'Advanced permissions'
        ],
        limits: ['Individual use only'],
        highlighted: true
      },
      {
        name: 'Team',
        price: '$8/user/month',
        features: [
          'Everything in Personal Pro',
          'Collaborative workspace',
          'Admin tools',
          'Advanced security'
        ],
        limits: ['Team collaboration features'],
        highlighted: false
      }
    ])
  },
  
  'Figma': {
    pricingTiers: JSON.stringify([
      {
        name: 'Starter',
        price: 'Free',
        features: [
          '3 Figma files',
          '3 FigJam files',
          'Unlimited personal files',
          'Mobile app access'
        ],
        limits: ['3 project files', '30-day version history'],
        highlighted: false
      },
      {
        name: 'Professional',
        price: '$12/editor/month',
        features: [
          'Unlimited Figma files',
          'Unlimited version history',
          'Team libraries',
          'Advanced prototyping',
          'Dev Mode'
        ],
        limits: ['Per editor pricing'],
        highlighted: true
      }
    ])
  }
};
