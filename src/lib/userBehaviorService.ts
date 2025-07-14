import { supabase, ActionType, ActionMetadata, UserBehaviorLog, DatabaseError } from './supabase';

/**
 * 用户行为日志记录服务
 * 统一处理所有用户行为的数据收集和分析
 */
export class UserBehaviorService {
  /**
   * 记录用户行为日志
   * @param userId 用户ID
   * @param toolId 工具ID (可选，搜索行为时可为null)
   * @param actionType 行为类型
   * @param metadata 行为元数据
   * @returns Promise<boolean> 记录是否成功
   */
  static async logAction(
    userId: string,
    toolId: string | null,
    actionType: ActionType,
    metadata: ActionMetadata = {}
  ): Promise<boolean> {
    try {
      // 如果没有配置Supabase，直接返回true（静默处理）
      if (!supabase) {
        console.log('Supabase not configured, skipping behavior logging');
        return true;
      }

      // 自动添加通用元数据
      const enrichedMetadata: ActionMetadata = {
        ...metadata,
        device_type: this.getDeviceType(),
        user_agent: this.getUserAgent(),
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId(),
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      };

      const logEntry = {
        user_id: userId,
        tool_id: toolId,
        action_type: actionType,
        metadata: enrichedMetadata,
        timestamp: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_behavior_logs')
        .insert([logEntry]);

      if (error) {
        console.error('Failed to log user behavior:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error logging user behavior:', error);
      return false;
    }
  }

  /**
   * 记录收藏行为
   */
  static async logFavorite(userId: string, toolId: string, sourcePage?: string): Promise<boolean> {
    return this.logAction(userId, toolId, 'favorite', {
      source_page: sourcePage,
    });
  }

  /**
   * 记录取消收藏行为
   */
  static async logUnfavorite(userId: string, toolId: string, sourcePage?: string): Promise<boolean> {
    return this.logAction(userId, toolId, 'unfavorite', {
      source_page: sourcePage,
    });
  }

  /**
   * 记录点赞行为
   */
  static async logLike(userId: string, toolId: string, sourcePage?: string): Promise<boolean> {
    return this.logAction(userId, toolId, 'like', {
      source_page: sourcePage,
    });
  }

  /**
   * 记录评分行为
   */
  static async logRating(
    userId: string, 
    toolId: string, 
    ratingValue: number, 
    sourcePage?: string
  ): Promise<boolean> {
    return this.logAction(userId, toolId, 'rate', {
      source_page: sourcePage,
      rating_value: ratingValue,
    });
  }

  /**
   * 记录搜索行为
   */
  static async logSearch(
    userId: string, 
    searchQuery: string, 
    sourcePage?: string,
    resultCount?: number
  ): Promise<boolean> {
    return this.logAction(userId, null, 'search', {
      source_page: sourcePage,
      search_query: searchQuery,
      result_count: resultCount,
    });
  }

  /**
   * 记录访问工具详情页行为
   */
  static async logViewTool(
    userId: string, 
    toolId: string, 
    sourcePage?: string,
    searchQuery?: string
  ): Promise<boolean> {
    return this.logAction(userId, toolId, 'view_tool', {
      source_page: sourcePage,
      search_query: searchQuery,
    });
  }

  /**
   * 记录访问工具官网行为
   */
  static async logVisitWebsite(
    userId: string, 
    toolId: string, 
    sourcePage?: string
  ): Promise<boolean> {
    return this.logAction(userId, toolId, 'visit_website', {
      source_page: sourcePage,
    });
  }

  /**
   * 记录筛选行为
   */
  static async logFilter(
    userId: string,
    filterType: string,
    filterValue: string,
    sourcePage?: string
  ): Promise<boolean> {
    const metadata: ActionMetadata = {
      source_page: sourcePage,
    };

    // 根据筛选类型设置不同的元数据字段
    if (filterType === 'category') {
      metadata.filter_category = filterValue;
    } else if (filterType === 'pricing') {
      metadata.filter_pricing = filterValue;
    } else {
      metadata[`filter_${filterType}`] = filterValue;
    }

    return this.logAction(userId, null, 'filter', metadata);
  }

  /**
   * 记录分享行为
   */
  static async logShare(
    userId: string,
    toolId: string,
    platform: string,
    sourcePage?: string
  ): Promise<boolean> {
    return this.logAction(userId, toolId, 'share', {
      source_page: sourcePage,
      share_platform: platform,
    });
  }

  /**
   * 获取用户行为历史
   */
  static async getUserBehaviorHistory(
    userId: string,
    actionType?: ActionType,
    limit: number = 50
  ): Promise<UserBehaviorLog[]> {
    try {
      // 如果没有配置Supabase，返回空数组
      if (!supabase) {
        console.log('Supabase not configured, returning empty behavior history');
        return [];
      }

      let query = supabase
        .from('user_behavior_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (actionType) {
        query = query.eq('action_type', actionType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch user behavior history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user behavior history:', error);
      return [];
    }
  }

  /**
   * 获取工具的行为统计
   */
  static async getToolBehaviorStats(toolId: string): Promise<{
    views: number;
    favorites: number;
    likes: number;
    ratings: number;
    website_visits: number;
  }> {
    try {
      // 如果没有配置Supabase，返回默认统计
      if (!supabase) {
        console.log('Supabase not configured, returning default tool stats');
        return { views: 0, favorites: 0, likes: 0, ratings: 0, website_visits: 0 };
      }

      const { data, error } = await supabase
        .from('user_behavior_logs')
        .select('action_type')
        .eq('tool_id', toolId);

      if (error) {
        console.error('Failed to fetch tool behavior stats:', error);
        return { views: 0, favorites: 0, likes: 0, ratings: 0, website_visits: 0 };
      }

      const stats = {
        views: 0,
        favorites: 0,
        likes: 0,
        ratings: 0,
        website_visits: 0,
      };

      data?.forEach(log => {
        switch (log.action_type) {
          case 'view_tool':
            stats.views++;
            break;
          case 'favorite':
            stats.favorites++;
            break;
          case 'like':
            stats.likes++;
            break;
          case 'rate':
            stats.ratings++;
            break;
          case 'visit_website':
            stats.website_visits++;
            break;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching tool behavior stats:', error);
      return { views: 0, favorites: 0, likes: 0, ratings: 0, website_visits: 0 };
    }
  }

  // 工具方法
  private static getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private static getUserAgent(): string {
    return typeof window !== 'undefined' ? navigator.userAgent : '';
  }

  private static getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }
}

// 导出便捷的日志记录函数
export const logAction = UserBehaviorService.logAction.bind(UserBehaviorService);
export const logFavorite = UserBehaviorService.logFavorite.bind(UserBehaviorService);
export const logUnfavorite = UserBehaviorService.logUnfavorite.bind(UserBehaviorService);
export const logLike = UserBehaviorService.logLike.bind(UserBehaviorService);
export const logRating = UserBehaviorService.logRating.bind(UserBehaviorService);
export const logSearch = UserBehaviorService.logSearch.bind(UserBehaviorService);
export const logViewTool = UserBehaviorService.logViewTool.bind(UserBehaviorService);
export const logVisitWebsite = UserBehaviorService.logVisitWebsite.bind(UserBehaviorService);
export const logFilter = UserBehaviorService.logFilter.bind(UserBehaviorService);
export const logShare = UserBehaviorService.logShare.bind(UserBehaviorService);
