// 测试价格提取功能的独立脚本
import * as cheerio from 'cheerio';

// 价格相关关键词
const PRICING_KEYWORDS = [
  'pricing', 'plans', 'subscription', 'subscribe', 'free', 'trial', 'demo',
  'cost', 'price', 'buy', 'purchase', 'payment', 'billing', 'upgrade',
  'premium', 'pro', 'basic', 'starter', 'enterprise', 'business',
  'freemium', 'forever free', 'no credit card', 'cancel anytime'
];

// 价格正则表达式
const PRICE_PATTERNS = [
  /\$\d+(?:\.\d{2})?(?:\/(?:month|mo|year|yr|week|day|user|seat))?/gi,
  /\$\d+(?:\.\d{2})?\s*(?:per|\/)\s*(?:month|mo|year|yr|week|day|user|seat)/gi,
  /\d+(?:\.\d{2})?\s*USD(?:\/(?:month|mo|year|yr))?/gi,
  /(?:monthly|yearly|annual)\s*:\s*\$\d+(?:\.\d{2})?/gi
];

// 免费相关关键词
const FREE_INDICATORS = [
  'free forever', 'always free', 'completely free', 'totally free',
  'free plan', 'free tier', 'free version', 'no cost', 'zero cost',
  'free to use', 'free trial', '100% free'
];

// 价格推断结果接口
interface PricingResult {
  pricing: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
  foundPrices: string[];
  foundKeywords: string[];
}

// 从HTML中提取价格信息
function extractPricing(html: string, url: string): PricingResult {
  const $ = cheerio.load(html);
  const text = $.text().toLowerCase();
  
  // 查找价格
  const foundPrices: string[] = [];
  PRICE_PATTERNS.forEach(pattern => {
    const matches = html.match(pattern) || [];
    foundPrices.push(...matches);
  });

  // 去重价格
  const uniquePrices = Array.from(new Set(foundPrices));

  // 查找关键词
  const foundKeywords = PRICING_KEYWORDS.filter(keyword => 
    text.includes(keyword.toLowerCase())
  );

  // 检查免费指示器
  const freeIndicators = FREE_INDICATORS.filter(indicator =>
    text.includes(indicator.toLowerCase())
  );

  // 推断价格
  let pricing = 'unknown';
  let confidence: 'high' | 'medium' | 'low' = 'low';
  let reason = '未找到明确的价格信息';

  // 优先检查freemium模式（有免费版本且有付费价格）
  if (freeIndicators.length > 0 && uniquePrices.length > 0) {
    pricing = 'freemium';
    confidence = 'high';
    reason = `找到免费版本和付费价格(${uniquePrices[0]})，推断为freemium模式`;
  } else if (uniquePrices.length > 0) {
    // 找到明确价格
    const firstPrice = uniquePrices[0];
    
    if (firstPrice.includes('/mo') || firstPrice.includes('/month')) {
      pricing = firstPrice.replace(/\/mo$/, '/month');
      confidence = 'high';
      reason = `找到明确的月付价格: ${firstPrice}`;
    } else if (firstPrice.includes('/yr') || firstPrice.includes('/year')) {
      pricing = firstPrice.replace(/\/yr$/, '/year');
      confidence = 'high';
      reason = `找到明确的年付价格: ${firstPrice}`;
    } else {
      pricing = firstPrice;
      confidence = 'medium';
      reason = `找到价格但不确定周期: ${firstPrice}`;
    }
  } else if (foundKeywords.includes('trial') && (foundKeywords.includes('free') || freeIndicators.length > 0)) {
    // 有试用且有免费信息
    pricing = 'trial';
    confidence = 'medium';
    reason = `找到试用和免费相关信息`;
  } else if (foundKeywords.includes('trial') && !foundKeywords.includes('free') && freeIndicators.length === 0) {
    // 只有试用，没有免费
    pricing = 'trial';
    confidence = 'medium';
    reason = `主要找到试用相关信息，无免费选项`;
  } else if (freeIndicators.length > 0 && (text.includes('pro') || text.includes('premium') || text.includes('upgrade') || text.includes('paid'))) {
    // 有免费版本但也提到了付费版本（但没找到具体价格）
    pricing = 'freemium';
    confidence = 'medium';
    reason = `找到免费版本和付费选项提及，推断为freemium模式`;
  } else if (freeIndicators.length > 0 || foundKeywords.includes('free')) {
    // 只有免费
    pricing = 'free';
    confidence = 'medium';
    reason = `主要找到免费相关信息`;
  }

  // 降低不确定情况的置信度
  if (foundKeywords.length === 0 && uniquePrices.length === 0) {
    confidence = 'low';
    reason = '未找到任何价格或关键词信息';
  }

  return {
    pricing,
    confidence,
    reason,
    foundPrices: uniquePrices,
    foundKeywords
  };
}

// 测试用例
const testCases = [
  {
    name: "明确月付价格",
    html: `<html><body><h1>Pricing</h1><p>Our service costs $29/month for unlimited access.</p></body></html>`,
    expected: "$29/month"
  },
  {
    name: "年付价格",
    html: `<html><body><div class="pricing">$199/year for premium plan</div></body></html>`,
    expected: "$199/year"
  },
  {
    name: "免费增值模式",
    html: `<html><body><p>Start with our free plan, upgrade to Pro for $19/mo</p></body></html>`,
    expected: "freemium"
  },
  {
    name: "纯免费",
    html: `<html><body><h2>100% Free Forever</h2><p>No credit card required</p></body></html>`,
    expected: "free"
  },
  {
    name: "试用版本",
    html: `<html><body><p>Free trial available, contact sales for pricing</p></body></html>`,
    expected: "trial"
  },
  {
    name: "无价格信息",
    html: `<html><body><h1>About Us</h1><p>We are a great company with amazing products.</p></body></html>`,
    expected: "unknown"
  }
];

function runTests() {
  console.log('🧪 开始测试价格提取功能...\n');
  
  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    console.log(`测试 ${index + 1}: ${testCase.name}`);
    
    const result = extractPricing(testCase.html, 'https://example.com');
    
    console.log(`  预期结果: ${testCase.expected}`);
    console.log(`  实际结果: ${result.pricing}`);
    console.log(`  置信度: ${result.confidence}`);
    console.log(`  推断原因: ${result.reason}`);
    console.log(`  找到的价格: ${result.foundPrices.join(', ') || '无'}`);
    console.log(`  找到的关键词: ${result.foundKeywords.join(', ') || '无'}`);
    
    if (result.pricing === testCase.expected) {
      console.log(`  ✅ 通过`);
      passed++;
    } else {
      console.log(`  ❌ 失败`);
      failed++;
    }
    console.log('');
  });

  console.log(`📊 测试结果: ${passed} 通过, ${failed} 失败`);
  
  if (failed === 0) {
    console.log('🎉 所有测试通过！');
  } else {
    console.log('⚠️  有测试失败，请检查价格提取逻辑');
  }
}

// 运行测试
runTests();