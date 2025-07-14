import { useCallback } from 'react';
import { 
  logAction, 
  logFavorite, 
  logUnfavorite,
  logLike,
  logRating,
  logSearch,
  logViewTool,
  logVisitWebsite,
  logFilter,
  logShare
} from '../lib/userBehaviorService';
import { ActionType, ActionMetadata } from '../lib/supabase';

/**
 * 用户行为日志记录 Hook
 * 提供便捷的行为记录方法，自动处理错误和用户ID
 */
export const useUserBehavior = (userId?: string) => {
  // 默认用户ID，在实际应用中应该从认证状态获取
  const currentUserId = userId || 'guest-user';

  // 获取当前页面标识
  const getCurrentPage = useCallback(() => {
    if (typeof window === 'undefined') return 'server';
    
    const pathname = window.location.pathname;
    if (pathname === '/') return 'homepage';
    if (pathname.startsWith('/tools/') && pathname.split('/').length === 3) return 'tool-detail-page';
    if (pathname === '/tools') return 'tools-page';
    if (pathname.startsWith('/category/')) return 'category-page';
    if (pathname === '/search') return 'search-page';
    if (pathname === '/about') return 'about-page';
    if (pathname === '/contact') return 'contact-page';
    if (pathname === '/submit') return 'submit-page';
    return 'unknown-page';
  }, []);

  // 通用行为记录方法
  const trackAction = useCallback(async (
    toolId: string | null,
    actionType: ActionType,
    metadata: ActionMetadata = {}
  ) => {
    try {
      const enrichedMetadata = {
        ...metadata,
        source_page: metadata.source_page || getCurrentPage(),
      };

      await logAction(currentUserId, toolId, actionType, enrichedMetadata);
      return true;
    } catch (error) {
      console.error(`Failed to track ${actionType}:`, error);
      return false;
    }
  }, [currentUserId, getCurrentPage]);

  // 收藏相关
  const trackFavorite = useCallback(async (toolId: string, metadata?: ActionMetadata) => {
    return trackAction(toolId, 'favorite', metadata);
  }, [trackAction]);

  const trackUnfavorite = useCallback(async (toolId: string, metadata?: ActionMetadata) => {
    return trackAction(toolId, 'unfavorite', metadata);
  }, [trackAction]);

  // 点赞相关
  const trackLike = useCallback(async (toolId: string, metadata?: ActionMetadata) => {
    return trackAction(toolId, 'like', metadata);
  }, [trackAction]);

  const trackUnlike = useCallback(async (toolId: string, metadata?: ActionMetadata) => {
    return trackAction(toolId, 'unlike', metadata);
  }, [trackAction]);

  // 评分
  const trackRating = useCallback(async (
    toolId: string, 
    rating: number, 
    metadata?: ActionMetadata
  ) => {
    return trackAction(toolId, 'rate', {
      ...metadata,
      rating_value: rating,
    });
  }, [trackAction]);

  // 搜索
  const trackSearch = useCallback(async (
    query: string, 
    resultCount?: number,
    metadata?: ActionMetadata
  ) => {
    return trackAction(null, 'search', {
      ...metadata,
      search_query: query,
      result_count: resultCount,
    });
  }, [trackAction]);

  // 访问工具详情页
  const trackViewTool = useCallback(async (
    toolId: string,
    fromSearch?: string,
    metadata?: ActionMetadata
  ) => {
    return trackAction(toolId, 'view_tool', {
      ...metadata,
      search_query: fromSearch,
    });
  }, [trackAction]);

  // 访问工具官网
  const trackVisitWebsite = useCallback(async (toolId: string, metadata?: ActionMetadata) => {
    return trackAction(toolId, 'visit_website', metadata);
  }, [trackAction]);

  // 筛选
  const trackFilter = useCallback(async (
    filterType: string,
    filterValue: string,
    metadata?: ActionMetadata
  ) => {
    const filterMetadata = {
      ...metadata,
      [`filter_${filterType}`]: filterValue,
    };
    return trackAction(null, 'filter', filterMetadata);
  }, [trackAction]);

  // 分享
  const trackShare = useCallback(async (
    toolId: string,
    platform: string,
    metadata?: ActionMetadata
  ) => {
    return trackAction(toolId, 'share', {
      ...metadata,
      share_platform: platform,
    });
  }, [trackAction]);

  // 对比工具
  const trackCompare = useCallback(async (
    toolIds: string[],
    metadata?: ActionMetadata
  ) => {
    return trackAction(toolIds[0], 'compare', {
      ...metadata,
      compare_tools: toolIds,
    });
  }, [trackAction]);

  // 返回所有跟踪方法
  return {
    // 通用方法
    trackAction,
    
    // 具体行为方法
    trackFavorite,
    trackUnfavorite,
    trackLike,
    trackUnlike,
    trackRating,
    trackSearch,
    trackViewTool,
    trackVisitWebsite,
    trackFilter,
    trackShare,
    trackCompare,
    
    // 工具方法
    getCurrentPage,
    currentUserId,
  };
};

/**
 * 批量行为记录 Hook
 * 用于处理需要批量记录的场景，如页面滚动、鼠标移动等
 */
export const useBatchBehavior = (userId?: string, batchSize = 10, flushInterval = 5000) => {
  const { trackAction } = useUserBehavior(userId);
  
  // 这里可以实现批量收集和提交的逻辑
  // 暂时返回基础的 trackAction 方法
  return {
    addToBatch: trackAction,
    flush: () => Promise.resolve(),
  };
};

/**
 * 页面访问追踪 Hook
 * 自动记录页面访问行为
 */
export const usePageTracking = (userId?: string) => {
  const { trackAction, getCurrentPage } = useUserBehavior(userId);

  const trackPageView = useCallback(async (
    pageName?: string,
    metadata?: ActionMetadata
  ) => {
    const page = pageName || getCurrentPage();
    return trackAction(null, 'view_tool', {
      ...metadata,
      page_name: page,
      view_type: 'page_view',
    });
  }, [trackAction, getCurrentPage]);

  return {
    trackPageView,
  };
};
