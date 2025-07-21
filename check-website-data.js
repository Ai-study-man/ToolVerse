// 直接测试网站前端数据
const puppeteer = require('puppeteer');

async function checkWebsiteData() {
  let browser;
  try {
    console.log('启动浏览器...');
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    console.log('导航到首页...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2' });
    
    // 等待类别卡片加载
    await page.waitForSelector('[data-testid="category-card"], .category-card, [class*="category"]', { timeout: 10000 });
    
    console.log('获取类别数据...');
    const categories = await page.evaluate(() => {
      // 尝试多种选择器来找到类别卡片
      const cards = document.querySelectorAll('[data-testid="category-card"], .category-card, [class*="category"]');
      const results = [];
      
      cards.forEach(card => {
        const nameElement = card.querySelector('h3, h2, [class*="name"], [class*="title"]');
        const countElement = card.querySelector('[class*="count"], [class*="tool"]');
        
        if (nameElement) {
          const name = nameElement.textContent || '';
          let count = 0;
          
          if (countElement) {
            const countText = countElement.textContent || '';
            const countMatch = countText.match(/(\d+)/);
            count = countMatch ? parseInt(countMatch[1]) : 0;
          }
          
          if (name.toLowerCase().includes('image generation') || name.toLowerCase().includes('image')) {
            results.push({ name, count, element: card.outerHTML.substring(0, 200) + '...' });
          }
        }
      });
      
      return results;
    });
    
    console.log('\n🔍 找到的 Image Generation 相关类别:');
    categories.forEach(cat => {
      console.log(`📋 ${cat.name}: ${cat.count} 个工具`);
      console.log(`HTML: ${cat.element}`);
      console.log('');
    });
    
    if (categories.length === 0) {
      console.log('❌ 未找到 Image Generation 类别，可能页面结构不同');
      
      // 获取所有可能的类别文本
      const allText = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('*')).map(el => el.textContent).filter(text => 
          text && (text.includes('Image') || text.includes('10') || text.includes('Generation'))
        ).slice(0, 20);
      });
      
      console.log('🔍 找到包含相关关键词的文本:');
      allText.forEach(text => console.log(`- ${text}`));
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

checkWebsiteData();
