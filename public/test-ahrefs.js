/**
 * Ahrefs Analytics 安装验证脚本
 * 用于检查 Ahrefs Analytics 是否正确加载和运行
 */

// 检查 Ahrefs Analytics 安装状态
function checkAhrefsInstallation() {
  console.log('🔍 开始检查 Ahrefs Analytics 安装状态...\n');
  
  // 1. 检查脚本是否加载
  const ahrefsScript = document.querySelector('script[src*="analytics.ahrefs.com"]');
  
  if (ahrefsScript) {
    console.log('✅ Ahrefs Analytics 脚本已找到');
    
    // 检查data-key属性
    const dataKey = ahrefsScript.getAttribute('data-key');
    if (dataKey === 'Y3EhGUnu3K8A0krIGV1Rdg') {
      console.log('✅ 数据键值配置正确:', dataKey);
    } else {
      console.warn('⚠️ 数据键值可能有误:', dataKey);
    }
    
    // 检查async属性
    if (ahrefsScript.hasAttribute('async')) {
      console.log('✅ async 属性已设置');
    } else {
      console.log('ℹ️ async 属性未设置（可选）');
    }
    
    // 检查脚本是否已加载完成
    if (ahrefsScript.readyState === 'complete' || ahrefsScript.readyState === 'loaded') {
      console.log('✅ 脚本已加载完成');
    } else {
      console.log('⏳ 脚本正在加载中...');
    }
  } else {
    console.error('❌ 未找到 Ahrefs Analytics 脚本');
    return false;
  }
  
  // 2. 检查网络请求
  checkNetworkRequests();
  
  // 3. 检查控制台错误
  checkConsoleErrors();
  
  // 4. 生成安装报告
  generateInstallationReport();
  
  return true;
}

function checkNetworkRequests() {
  console.log('\n🌐 检查网络请求...');
  
  // 监听网络请求
  const originalFetch = window.fetch;
  const originalXHR = window.XMLHttpRequest;
  
  let ahrefsRequests = [];
  
  // 拦截fetch请求
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('ahrefs.com')) {
      ahrefsRequests.push({
        type: 'fetch',
        url: url,
        timestamp: new Date().toISOString()
      });
      console.log('📤 Ahrefs fetch 请求:', url);
    }
    return originalFetch.apply(this, args);
  };
  
  // 检查现有的请求
  if (window.performance && window.performance.getEntriesByType) {
    const resourceEntries = window.performance.getEntriesByType('resource');
    const ahrefsResources = resourceEntries.filter(entry => 
      entry.name.includes('ahrefs.com')
    );
    
    if (ahrefsResources.length > 0) {
      console.log('✅ 发现 Ahrefs 相关资源请求:');
      ahrefsResources.forEach(resource => {
        console.log(`   📁 ${resource.name} (${resource.duration.toFixed(2)}ms)`);
      });
    } else {
      console.log('ℹ️ 暂未发现 Ahrefs 相关网络请求');
    }
  }
}

function checkConsoleErrors() {
  console.log('\n🔍 检查控制台错误...');
  
  // 监听错误
  const originalError = console.error;
  let ahrefsErrors = [];
  
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.toLowerCase().includes('ahrefs')) {
      ahrefsErrors.push({
        message: message,
        timestamp: new Date().toISOString()
      });
    }
    return originalError.apply(this, args);
  };
  
  // 检查现有错误
  if (ahrefsErrors.length === 0) {
    console.log('✅ 未发现 Ahrefs 相关错误');
  } else {
    console.warn('⚠️ 发现 Ahrefs 相关错误:');
    ahrefsErrors.forEach(error => {
      console.warn(`   ${error.timestamp}: ${error.message}`);
    });
  }
}

function generateInstallationReport() {
  console.log('\n📋 安装状态报告:');
  
  const report = {
    timestamp: new Date().toISOString(),
    domain: window.location.hostname,
    url: window.location.href,
    ahrefsConfig: {
      scriptFound: !!document.querySelector('script[src*="analytics.ahrefs.com"]'),
      dataKey: document.querySelector('script[src*="analytics.ahrefs.com"]')?.getAttribute('data-key'),
      expectedKey: 'Y3EhGUnu3K8A0krIGV1Rdg',
      asyncEnabled: !!document.querySelector('script[src*="analytics.ahrefs.com"]')?.hasAttribute('async')
    },
    pageInfo: {
      title: document.title,
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    },
    recommendations: []
  };
  
  // 添加建议
  if (!report.ahrefsConfig.scriptFound) {
    report.recommendations.push('请检查脚本是否正确添加到<head>标签中');
  }
  
  if (report.ahrefsConfig.dataKey !== report.ahrefsConfig.expectedKey) {
    report.recommendations.push('请检查data-key属性是否正确');
  }
  
  if (report.recommendations.length === 0) {
    report.recommendations.push('安装配置正确，请等待数据收集开始');
  }
  
  console.log('📊 详细报告:');
  console.table(report.ahrefsConfig);
  
  console.log('\n💡 建议:');
  report.recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`);
  });
  
  console.log('\n✅ 验证步骤:');
  console.log('   1. 在 Ahrefs 控制台中点击"重新检查安装"');
  console.log('   2. 等待 5-10 分钟后检查数据收集状态');
  console.log('   3. 确保网站有实际访问量');
  
  return report;
}

// 页面加载完成后自动运行检查
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAhrefsInstallation);
  } else {
    // 延迟检查，确保脚本有时间加载
    setTimeout(checkAhrefsInstallation, 1000);
  }
}

// 导出函数供手动调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkAhrefsInstallation };
}

// 全局函数，可在浏览器控制台中调用
window.checkAhrefs = checkAhrefsInstallation;

// 定期检查（可选）
setInterval(() => {
  const script = document.querySelector('script[src*="analytics.ahrefs.com"]');
  if (script && !script.dataset.checked) {
    console.log('🔄 定期检查 Ahrefs Analytics 状态...');
    checkAhrefsInstallation();
    script.dataset.checked = 'true';
  }
}, 5000);
