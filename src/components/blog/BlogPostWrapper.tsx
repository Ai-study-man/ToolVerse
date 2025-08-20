'use client';

import React, { useEffect, useState } from 'react';
import { useBlogAnalytics } from '@/hooks/useBlogAnalytics';

interface BlogPostWrapperProps {
  blogId: string;
  initialViewCount: number;
  initialShareCount: number;
  children: React.ReactNode;
}

/**
 * 博客文章客户端包装器
 * 负责跟踪浏览和分享行为
 */
export default function BlogPostWrapper({ 
  blogId, 
  initialViewCount, 
  initialShareCount, 
  children 
}: BlogPostWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [shareCount, setShareCount] = useState(initialShareCount);
  
  const {
    trackBlogView,
    trackBlogShare,
    getBlogStats,
    shareToTwitter,
    shareToLinkedIn,
    copyLink
  } = useBlogAnalytics();

  // 确保组件已挂载
  useEffect(() => {
    setMounted(true);
  }, []);

  // 在组件挂载时跟踪浏览量
  useEffect(() => {
    if (!mounted) return;
    
    const trackView = async () => {
      try {
        // 跟踪博客浏览
        await trackBlogView(blogId, {
          source: 'blog-post-page',
          referrer: typeof window !== 'undefined' ? document.referrer || 'direct' : 'direct'
        });

        // 获取最新统计数据
        const stats = await getBlogStats(blogId);
        if (stats) {
          setViewCount(stats.viewCount);
          setShareCount(stats.shareCount);
        }
      } catch (error) {
        console.error('Failed to track blog view:', error);
      }
    };

    trackView();
  }, [blogId, mounted, trackBlogView, getBlogStats]);

  // 暴露分享函数到全局作用域
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    // @ts-ignore
    window.handleBlogShare = async (platform: string, title?: string) => {
      try {
        switch (platform) {
          case 'twitter':
            await shareToTwitter(blogId, title || 'Check out this article');
            break;
          case 'linkedin':
            await shareToLinkedIn(blogId, title || 'Check out this article');
            break;
          case 'copy':
            const success = await copyLink(blogId);
            if (success) {
              // 显示复制成功提示
              const notification = document.createElement('div');
              notification.textContent = 'Link copied to clipboard!';
              notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity';
              document.body.appendChild(notification);
              setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
              }, 2000);
            }
            break;
          default:
            // 其他平台的直接分享跟踪
            await trackBlogShare(blogId, platform as any);
        }

        // 更新分享计数
        const updatedStats = await getBlogStats(blogId);
        if (updatedStats) {
          setShareCount(updatedStats.shareCount);
        }
      } catch (error) {
        console.error('Failed to handle blog share:', error);
      }
    };

    // 暴露实时统计数据
    // @ts-ignore
    window.getBlogStats = () => ({ viewCount, shareCount });

    return () => {
      // @ts-ignore
      delete window.handleBlogShare;
      // @ts-ignore
      delete window.getBlogStats;
    };
  }, [blogId, mounted, viewCount, shareCount, shareToTwitter, shareToLinkedIn, copyLink, trackBlogShare, getBlogStats]);

  if (!mounted) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <>
      {/* 注入实时统计数据到页面 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.realTimeBlogStats = {
              viewCount: ${viewCount},
              shareCount: ${shareCount}
            };
          `
        }}
      />
      {children}
    </>
  );
}
