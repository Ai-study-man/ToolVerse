/**
 * 测试所有工具的logo显示情况
 * 检查详情页和收藏夹页面的logo是否正确显示
 */

const fs = require('fs');
const path = require('path');

// 从API获取工具数据
async function fetchToolsFromAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/tools');
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ 无法从API获取工具数据:', error.message);
    return [];
  }
}

// 检查本地logo文件是否存在
function checkLocalLogoExists(logoPath) {
  if (!logoPath || !logoPath.startsWith('/logos/')) {
    return false;
  }
  
  const filePath = path.join(__dirname, 'public', logoPath);
  return fs.existsSync(filePath);
}

// 分析单个工具的logo情况
function analyzeToolLogo(tool) {
  const result = {
    name: tool.name,
    id: tool.id,
    originalLogo: tool.logo,
    issues: []
  };
  
  // 检查原始logo是否是生成的SVG
  if (tool.logo && tool.logo.includes('data:image/svg+xml')) {
    result.issues.push('使用生成的SVG而不是官方logo');
  }
  
  // 检查是否有本地logo文件
  if (tool.logo && tool.logo.startsWith('/logos/')) {
    if (!checkLocalLogoExists(tool.logo)) {
      result.issues.push(`本地logo文件不存在: ${tool.logo}`);
    } else {
      result.issues.push('✅ 本地logo文件存在');
    }
  }
  
  return result;
}

// 主测试函数
async function testLogoDisplay() {
  console.log('🔍 开始测试工具logo显示情况...\n');
  
  const tools = await fetchToolsFromAPI();
  if (tools.length === 0) {
    console.log('❌ 无法获取工具数据，请确保开发服务器正在运行');
    return;
  }
  
  console.log(`📊 找到 ${tools.length} 个工具，开始分析...\n`);
  
  const results = tools.map(analyzeToolLogo);
  
  // 统计问题
  const toolsWithIssues = results.filter(r => r.issues.some(issue => !issue.startsWith('✅')));
  const toolsWithLocalLogos = results.filter(r => r.issues.some(issue => issue.startsWith('✅')));
  
  console.log('📈 统计结果:');
  console.log(`✅ 有本地logo的工具: ${toolsWithLocalLogos.length}`);
  console.log(`❌ 有问题的工具: ${toolsWithIssues.length}`);
  console.log(`🔄 使用生成SVG的工具: ${results.filter(r => r.originalLogo?.includes('data:image/svg+xml')).length}\n`);
  
  // 显示有问题的工具
  if (toolsWithIssues.length > 0) {
    console.log('❌ 需要修复的工具:');
    toolsWithIssues.slice(0, 10).forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
      result.issues.forEach(issue => {
        if (!issue.startsWith('✅')) {
          console.log(`   - ${issue}`);
        }
      });
    });
    
    if (toolsWithIssues.length > 10) {
      console.log(`   ... 还有 ${toolsWithIssues.length - 10} 个工具需要检查`);
    }
  }
  
  // 显示有本地logo的工具
  if (toolsWithLocalLogos.length > 0) {
    console.log('\n✅ 已有本地logo的工具:');
    toolsWithLocalLogos.slice(0, 20).forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
    });
    
    if (toolsWithLocalLogos.length > 20) {
      console.log(`   ... 还有 ${toolsWithLocalLogos.length - 20} 个工具有本地logo`);
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testLogoDisplay().catch(console.error);
}

module.exports = { testLogoDisplay };
