// SEO检查和验证工具
// 用于验证网站SEO优化的实施效果

import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

interface SEOCheckResult {
  url: string;
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonical?: string;
  structuredData?: any[];
  h1Tags?: string[];
  metaRobots?: string;
  issues: string[];
  score: number;
}

class SEOChecker {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async checkPage(path: string = ''): Promise<SEOCheckResult> {
    const url = `${this.baseUrl}${path}`;
    const issues: string[] = [];
    
    try {
      console.log(`🔍 检查页面SEO: ${url}`);
      
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // 基本meta标签检查
      const title = document.querySelector('title')?.textContent;
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content');
      
      // Open Graph检查
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      
      // Twitter Cards检查
      const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
      
      // Canonical URL检查
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      
      // H1标签检查
      const h1Tags = Array.from(document.querySelectorAll('h1')).map(h1 => h1.textContent || '');
      
      // Meta robots检查
      const metaRobots = document.querySelector('meta[name="robots"]')?.getAttribute('content');
      
      // 结构化数据检查
      const structuredDataScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      const structuredData = structuredDataScripts.map(script => {
        try {
          return JSON.parse(script.textContent || '');
        } catch {
          return null;
        }
      }).filter(Boolean);

      // 检查问题
      if (!title || title.length < 30) {
        issues.push('标题缺失或过短（建议30-60字符）');
      }
      if (!description || description.length < 120) {
        issues.push('描述缺失或过短（建议120-160字符）');
      }
      if (!keywords) {
        issues.push('关键词标签缺失');
      }
      if (!ogTitle) {
        issues.push('Open Graph标题缺失');
      }
      if (!ogDescription) {
        issues.push('Open Graph描述缺失');
      }
      if (!ogImage) {
        issues.push('Open Graph图片缺失');
      }
      if (!twitterCard) {
        issues.push('Twitter Card缺失');
      }
      if (!canonical) {
        issues.push('Canonical URL缺失');
      }
      if (h1Tags.length === 0) {
        issues.push('H1标签缺失');
      } else if (h1Tags.length > 1) {
        issues.push('多个H1标签（建议只有一个）');
      }
      if (structuredData.length === 0) {
        issues.push('结构化数据缺失');
      }

      // 计算SEO得分
      const totalChecks = 10;
      const passedChecks = totalChecks - issues.length;
      const score = Math.round((passedChecks / totalChecks) * 100);

      return {
        url,
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
        canonical,
        structuredData,
        h1Tags,
        metaRobots,
        issues,
        score
      };
    } catch (error) {
      console.error(`检查页面失败: ${url}`, error);
      return {
        url,
        issues: [`页面访问失败: ${error.message}`],
        score: 0
      };
    }
  }

  async checkMultiplePages(paths: string[]): Promise<SEOCheckResult[]> {
    const results: SEOCheckResult[] = [];
    
    for (const path of paths) {
      const result = await this.checkPage(path);
      results.push(result);
      
      // 显示结果
      console.log(`\n📊 ${path || '首页'} SEO检查结果:`);
      console.log(`📈 SEO得分: ${result.score}/100`);
      console.log(`📝 标题: ${result.title?.substring(0, 60)}...`);
      console.log(`📄 描述: ${result.description?.substring(0, 80)}...`);
      console.log(`🔗 结构化数据: ${result.structuredData?.length || 0} 个`);
      
      if (result.issues.length > 0) {
        console.log(`⚠️  发现问题:`);
        result.issues.forEach(issue => console.log(`   - ${issue}`));
      } else {
        console.log(`✅ 未发现SEO问题`);
      }
    }
    
    return results;
  }

  generateReport(results: SEOCheckResult[]): void {
    console.log('\n🎯 SEO优化报告');
    console.log('='.repeat(50));
    
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    console.log(`📊 平均SEO得分: ${Math.round(avgScore)}/100`);
    
    const allIssues = results.flatMap(r => r.issues);
    const issueCount = allIssues.reduce((acc, issue) => {
      acc[issue] = (acc[issue] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    if (Object.keys(issueCount).length > 0) {
      console.log('\n🔍 常见问题:');
      Object.entries(issueCount)
        .sort(([,a], [,b]) => b - a)
        .forEach(([issue, count]) => {
          console.log(`   ${count}x - ${issue}`);
        });
    }
    
    console.log('\n📈 优化建议:');
    if (avgScore < 70) {
      console.log('   - 网站SEO需要大幅改进');
      console.log('   - 重点关注基础meta标签和结构化数据');
    } else if (avgScore < 90) {
      console.log('   - SEO优化良好，但仍有改进空间');
      console.log('   - 细化描述和关键词优化');
    } else {
      console.log('   - SEO优化优秀！');
      console.log('   - 继续保持并定期更新内容');
    }
  }
}

// 主函数
async function runSEOCheck() {
  const checker = new SEOChecker();
  
  const pagesToCheck = [
    '',                    // 首页
    '/tools',              // 工具列表
    '/categories',         // 分类页面
    '/submit',             // 提交页面
    '/tools/chatgpt',      // 示例工具页（如果存在）
  ];
  
  console.log('🚀 开始SEO检查...\n');
  
  const results = await checker.checkMultiplePages(pagesToCheck);
  checker.generateReport(results);
  
  console.log('\n✅ SEO检查完成！');
}

// 如果直接运行此文件
if (require.main === module) {
  runSEOCheck().catch(console.error);
}

export { SEOChecker, runSEOCheck };
