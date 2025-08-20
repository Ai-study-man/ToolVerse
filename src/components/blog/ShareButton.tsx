'use client';

import React from 'react';

interface ShareButtonProps {
  platform: 'twitter' | 'linkedin' | 'copy';
  blogId: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * 分享按钮客户端组件
 */
export default function ShareButton({ platform, blogId, title, className, children }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.handleBlogShare) {
        // @ts-ignore
        window.handleBlogShare(platform, title);
      } else {
        // 降级处理：直接分享而不跟踪
        const shareUrl = window.location.href;
        
        switch (platform) {
          case 'twitter':
            const text = `Check out this article: ${title}`;
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank', 'width=550,height=420');
            break;
          case 'linkedin':
            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
            window.open(linkedinUrl, '_blank', 'width=550,height=420');
            break;
          case 'copy':
            await navigator.clipboard.writeText(shareUrl);
            // 显示复制成功提示
            const notification = document.createElement('div');
            notification.textContent = 'Link copied to clipboard!';
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
            document.body.appendChild(notification);
            setTimeout(() => {
              notification.style.opacity = '0';
              setTimeout(() => notification.remove(), 300);
            }, 2000);
            break;
        }
      }
    } catch (error) {
      console.error('Failed to handle share:', error);
    }
  };

  if (platform === 'copy') {
    return (
      <button onClick={handleShare} className={className}>
        {children}
      </button>
    );
  }

  return (
    <a href="#" onClick={(e) => { e.preventDefault(); handleShare(); }} className={className}>
      {children}
    </a>
  );
}
