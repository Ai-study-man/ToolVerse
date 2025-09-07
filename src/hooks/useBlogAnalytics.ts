import { useCallback } from 'react';
import { BlogAnalyticsService } from '@/lib/blogAnalyticsService';

/**
 * 博客分析跟踪 Hook
 */
export function useBlogAnalytics(userId?: string) {
  
  /**
   * 跟踪博客浏览
   */
  const trackBlogView = useCallback(async (
    blogId: string,
    metadata?: {
      source?: string;
      referrer?: string;
      user_agent?: string;
    }
  ) => {
    try {
      const success = await BlogAnalyticsService.trackBlogView(
        blogId,
        userId,
        {
          source: metadata?.source || 'unknown',
          referrer: metadata?.referrer || document.referrer || 'direct',
          user_agent: metadata?.user_agent || navigator.userAgent
        }
      );
      
      if (success) {
        console.log(`📊 Blog view tracked: ${blogId}`);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to track blog view:', error);
      return false;
    }
  }, [userId]);

  /**
   * 跟踪博客分享
   */
  const trackBlogShare = useCallback(async (
    blogId: string,
    platform: 'twitter' | 'linkedin' | 'facebook' | 'copy' | 'email',
    metadata?: {
      source?: string;
      url?: string;
    }
  ) => {
    try {
      const success = await BlogAnalyticsService.trackBlogShare(
        blogId,
        platform,
        userId,
        {
          source: metadata?.source || 'share-button',
          user_agent: navigator.userAgent
        }
      );
      
      if (success) {
        console.log(`📤 Blog share tracked: ${blogId} on ${platform}`);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to track blog share:', error);
      return false;
    }
  }, [userId]);

  /**
   * 获取博客统计
   */
  const getBlogStats = useCallback(async (blogId: string) => {
    try {
      return await BlogAnalyticsService.getBlogStats(blogId);
    } catch (error) {
      console.error('Failed to get blog stats:', error);
      return {
        viewCount: 0,
        shareCount: 0,
        lastUpdated: new Date()
      };
    }
  }, []);

  /**
   * 分享到Twitter
   */
  const shareToTwitter = useCallback(async (
    blogId: string,
    title: string,
    url?: string
  ) => {
    const shareUrl = url || window.location.href;
    const text = `Check out this article: ${title}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    
    // 跟踪分享
    await trackBlogShare(blogId, 'twitter', { source: 'twitter-button', url: shareUrl });
    
    // 打开Twitter分享窗口
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  }, [trackBlogShare]);

  /**
   * 分享到LinkedIn
   */
  const shareToLinkedIn = useCallback(async (
    blogId: string,
    title: string,
    url?: string
  ) => {
    const shareUrl = url || window.location.href;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    
    // 跟踪分享
    await trackBlogShare(blogId, 'linkedin', { source: 'linkedin-button', url: shareUrl });
    
    // 打开LinkedIn分享窗口
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
  }, [trackBlogShare]);

  /**
   * 复制链接
   */
  const copyLink = useCallback(async (
    blogId: string,
    url?: string
  ) => {
    const shareUrl = url || window.location.href;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      
      // 跟踪分享
      await trackBlogShare(blogId, 'copy', { source: 'copy-button', url: shareUrl });
      
      return true;
    } catch (error) {
      console.error('Failed to copy link:', error);
      return false;
    }
  }, [trackBlogShare]);

  return {
    trackBlogView,
    trackBlogShare,
    getBlogStats,
    shareToTwitter,
    shareToLinkedIn,
    copyLink
  };
}
