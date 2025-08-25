// Google AdSense 配置文件
export const AD_CONFIG = {
  // AdSense 客户端ID
  CLIENT_ID: 'ca-pub-4372695356377122',
  
  // 广告位配置
  AD_SLOTS: {
    // 这些是示例slot，需要在Google AdSense中创建真实的广告位
    HEADER_BANNER: '1234567890',
    CONTENT_BANNER: '3456789012', 
    SIDEBAR_BANNER: '2345678901',
    FOOTER_BANNER: '4567890123',
  },
  
  // 广告尺寸配置
  AD_SIZES: {
    LEADERBOARD: { width: 728, height: 90 },
    RECTANGLE: { width: 300, height: 250 },
    SKYSCRAPER: { width: 160, height: 600 },
    BANNER: { width: 468, height: 60 },
  },
  
  // 响应式配置
  RESPONSIVE: true,
  
  // 测试模式（开发环境）- 临时启用以便测试
  TEST_MODE: false, // 强制关闭测试模式以便调试
};

// 广告显示策略配置
export const AD_DISPLAY_RULES = {
  // 页面最少内容数量才显示广告
  MIN_TOOLS_FOR_AD: 6,
  
  // 工具列表中广告插入位置
  TOOLS_AD_POSITION: 6,
  
  // 移动端是否显示某些广告位
  MOBILE_ADS: {
    SIDEBAR: false, // 移动端不显示侧边栏广告
    HEADER: true,
    CONTENT: true,
    FOOTER: true,
  },
  
  // 广告之间的最小间距（工具数量）
  MIN_AD_SPACING: 10,
};

// 获取广告配置的辅助函数
export function getAdSlot(slotName: keyof typeof AD_CONFIG.AD_SLOTS): string {
  return AD_CONFIG.AD_SLOTS[slotName];
}

export function shouldShowAd(context: {
  totalItems?: number;
  currentPosition?: number;
  isMobile?: boolean;
  adType: keyof typeof AD_DISPLAY_RULES.MOBILE_ADS;
}): boolean {
  const { totalItems = 0, currentPosition = 0, isMobile = false, adType } = context;
  
  // 测试模式下减少广告显示
  if (AD_CONFIG.TEST_MODE && Math.random() > 0.3) {
    return false;
  }
  
  // 移动端检查
  if (isMobile && !AD_DISPLAY_RULES.MOBILE_ADS[adType]) {
    return false;
  }
  
  // 内容数量检查
  if (totalItems < AD_DISPLAY_RULES.MIN_TOOLS_FOR_AD) {
    return false;
  }
  
  return true;
}
