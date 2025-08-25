// 浏览器兼容性和AdSense加载检查工具
console.log('🔍 浏览器兼容性检查...');

// 检查当前环境
console.log('📊 环境信息:', {
  userAgent: navigator.userAgent,
  language: navigator.language,
  onLine: navigator.onLine,
  cookieEnabled: navigator.cookieEnabled
});

// 检查AdSense脚本加载
function checkAdSenseScript() {
  console.log('\n🎯 检查AdSense脚本加载...');
  
  const adsenseScript = document.querySelector('script[src*="googlesyndication.com"]');
  if (adsenseScript) {
    console.log('✅ AdSense脚本标签存在:', adsenseScript.src);
    
    // 检查脚本是否加载成功
    if (window.adsbygoogle) {
      console.log('✅ adsbygoogle对象已加载');
      console.log('📊 adsbygoogle数组长度:', window.adsbygoogle.length);
    } else {
      console.log('❌ adsbygoogle对象未找到');
    }
  } else {
    console.log('❌ AdSense脚本标签未找到');
  }
}

// 检查广告容器
function checkAdContainers() {
  console.log('\n📦 检查广告容器...');
  
  const adContainers = document.querySelectorAll('.adsbygoogle');
  console.log(`找到 ${adContainers.length} 个广告容器`);
  
  adContainers.forEach((container, index) => {
    console.log(`容器 ${index + 1}:`, {
      client: container.getAttribute('data-ad-client'),
      slot: container.getAttribute('data-ad-slot'),
      format: container.getAttribute('data-ad-format'),
      style: container.style.display,
      dimensions: `${container.offsetWidth}x${container.offsetHeight}`
    });
  });
}

// 检查网络连接
function checkNetworkConnectivity() {
  console.log('\n🌐 检查网络连接...');
  
  // 测试Google服务连接
  const testUrls = [
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    'https://www.google-analytics.com/analytics.js'
  ];
  
  testUrls.forEach(url => {
    fetch(url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => console.log('✅', url, '- 连接正常'))
      .catch(err => console.log('❌', url, '- 连接失败:', err.message));
  });
}

// 检查广告拦截器
function checkAdBlocker() {
  console.log('\n🚫 检查广告拦截器...');
  
  // 创建测试元素
  const testDiv = document.createElement('div');
  testDiv.innerHTML = '&nbsp;';
  testDiv.className = 'adsbox';
  testDiv.style.position = 'absolute';
  testDiv.style.left = '-9999px';
  document.body.appendChild(testDiv);
  
  setTimeout(() => {
    if (testDiv.offsetHeight === 0) {
      console.log('❌ 检测到广告拦截器');
    } else {
      console.log('✅ 未检测到广告拦截器');
    }
    document.body.removeChild(testDiv);
  }, 100);
}

// 检查控制台错误
function checkConsoleErrors() {
  console.log('\n🐛 监听新的控制台错误...');
  
  const originalError = console.error;
  console.error = function(...args) {
    if (args[0] && args[0].toString().includes('adsbygoogle')) {
      console.log('🚨 AdSense相关错误:', ...args);
    }
    originalError.apply(console, args);
  };
}

// 执行所有检查
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runChecks);
} else {
  runChecks();
}

function runChecks() {
  checkAdSenseScript();
  checkAdContainers();
  checkNetworkConnectivity();
  checkAdBlocker();
  checkConsoleErrors();
  
  console.log('\n💡 如果广告仍未显示，请尝试：');
  console.log('1. 禁用所有浏览器扩展');
  console.log('2. 清除浏览器缓存和Cookie');
  console.log('3. 使用隐私模式访问');
  console.log('4. 检查AdSense账户状态');
  console.log('5. 使用真实的广告位ID（非示例ID）');
}
