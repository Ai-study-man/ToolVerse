'use client';

import { useEffect, useRef, useState } from 'react';
import { AD_CONFIG, getAdSlot, shouldShowAd } from '../lib/adConfig';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  adType?: 'HEADER' | 'CONTENT' | 'SIDEBAR' | 'FOOTER';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '',
  style = {},
  adType = 'CONTENT'
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [shouldShow, setShouldShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 检测移动端
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // 检查是否应该显示广告
    const showAd = shouldShowAd({
      isMobile: window.innerWidth < 768,
      adType: adType as keyof typeof import('../lib/adConfig').AD_DISPLAY_RULES.MOBILE_ADS
    });
    
    setShouldShow(showAd);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [adType]);

  useEffect(() => {
    if (!shouldShow) return;
    
    try {
      // 确保 adsbygoogle 已加载
      if (window.adsbygoogle && adRef.current) {
        // 推送广告到 AdSense
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, [shouldShow]);

  // 如果不应该显示广告，返回 null
  if (!shouldShow) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          ...style
        }}
        data-ad-client={AD_CONFIG.CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
        data-ad-test={AD_CONFIG.TEST_MODE ? "on" : undefined}
      />
    </div>
  );
}

// 预定义的广告位组件
export function HeaderBanner() {
  return (
    <AdBanner
      slot={getAdSlot('HEADER_BANNER')}
      format="horizontal"
      className="mb-6"
      style={{ minHeight: '90px' }}
      adType="HEADER"
    />
  );
}

export function SidebarBanner() {
  return (
    <AdBanner
      slot={getAdSlot('SIDEBAR_BANNER')}
      format="vertical"
      className="sticky top-4"
      style={{ minHeight: '250px', width: '300px' }}
      adType="SIDEBAR"
    />
  );
}

export function ContentBanner() {
  return (
    <AdBanner
      slot={getAdSlot('CONTENT_BANNER')}
      format="rectangle"
      className="my-8 mx-auto"
      style={{ minHeight: '250px' }}
      adType="CONTENT"
    />
  );
}

export function FooterBanner() {
  return (
    <AdBanner
      slot={getAdSlot('FOOTER_BANNER')}
      format="horizontal"
      className="mt-6"
      style={{ minHeight: '90px' }}
      adType="FOOTER"
    />
  );
}
