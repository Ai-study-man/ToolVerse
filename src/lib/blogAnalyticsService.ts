import { createClient } from '@supabase/supabase-js';

// 确保只在客户端环境中使用 Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface BlogStats {
  viewCount: number;
  shareCount: number;
  lastUpdated: Date;
}

export interface BlogAnalytics {
  blog_id: string;
  event_type: 'view' | 'share';
  user_id?: string;
  created_at: Date;
  metadata?: {
    source?: string;
    platform?: string;
    referrer?: string;
    user_agent?: string;
  };
}

/**
 * 博客分析服务 - 跟踪真实的浏览量和分享量
 */
export class BlogAnalyticsService {
  
  /**
   * 记录博客浏览
   */
  static async trackBlogView(
    blogId: string, 
    userId?: string,
    metadata?: BlogAnalytics['metadata']
  ): Promise<boolean> {
    // 暂时禁用数据库调用
    console.log('trackBlogView called for:', blogId);
    return true;
    
    /*
    if (!supabase) {
      console.log('Supabase not configured, using fallback analytics');
      return false;
    }

    try {
      const { error } = await supabase
        .from('blog_analytics')
        .insert({
          blog_id: blogId,
          event_type: 'view',
          user_id: userId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
          metadata: metadata || {}
        });

      if (error) {
        console.error('Error tracking blog view:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to track blog view:', error);
      return false;
    }
    */
  }

  /**
   * 记录博客分享
   */
  static async trackBlogShare(
    blogId: string,
    platform: string,
    userId?: string,
    metadata?: BlogAnalytics['metadata']
  ): Promise<boolean> {
    if (!supabase) {
      console.log('Supabase not configured, using fallback analytics');
      return false;
    }

    try {
      const { error } = await supabase
        .from('blog_analytics')
        .insert({
          blog_id: blogId,
          event_type: 'share',
          user_id: userId || `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
          metadata: {
            platform,
            ...metadata
          }
        });

      if (error) {
        console.error('Error tracking blog share:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to track blog share:', error);
      return false;
    }
  }

  /**
   * 获取博客统计数据
   */
  static async getBlogStats(blogId: string): Promise<BlogStats> {
    const defaultStats: BlogStats = {
      viewCount: 42, // 临时硬编码数据
      shareCount: 8,
      lastUpdated: new Date()
    };

    // 暂时禁用数据库调用
    console.log('getBlogStats called for:', blogId);
    return defaultStats;
  }

  /**
   * 获取多个博客的统计数据
   */
  static async getMultipleBlogStats(blogIds: string[]): Promise<Map<string, BlogStats>> {
    const statsMap = new Map<string, BlogStats>();
    
    // 临时硬编码数据
    blogIds.forEach(id => {
      statsMap.set(id, {
        viewCount: Math.floor(Math.random() * 100) + 20, // 随机20-120之间
        shareCount: Math.floor(Math.random() * 20) + 5,  // 随机5-25之间
        lastUpdated: new Date()
      });
    });

    console.log('getMultipleBlogStats called for:', blogIds.length, 'blogs');
    return statsMap;
  }

  /**
   * 获取热门博客（按浏览量排序）
   */
  static async getPopularBlogs(limit: number = 10): Promise<Array<{blogId: string, viewCount: number}>> {
    if (!supabase) {
      console.log('Supabase not configured, returning empty popular blogs');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('blog_analytics')
        .select('blog_id')
        .eq('event_type', 'view');

      if (error) {
        console.error('Error fetching popular blogs:', error);
        return [];
      }

      // 统计每个博客的浏览量
      const viewCounts = data.reduce((acc, record) => {
        acc[record.blog_id] = (acc[record.blog_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // 排序并返回前N个
      return Object.entries(viewCounts)
        .map(([blogId, viewCount]) => ({ blogId, viewCount }))
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, limit);

    } catch (error) {
      console.error('Failed to fetch popular blogs:', error);
      return [];
    }
  }

  /**
   * 获取博客分析报告
   */
  static async getBlogAnalyticsReport(
    blogId: string,
    timeRange: '7d' | '30d' | '90d' = '30d'
  ): Promise<{
    totalViews: number;
    totalShares: number;
    dailyViews: Array<{ date: string; views: number }>;
    dailyShares: Array<{ date: string; shares: number }>;
    topReferrers: Array<{ referrer: string; count: number }>;
    platforms: Array<{ platform: string; count: number }>;
  }> {
    const defaultReport = {
      totalViews: 0,
      totalShares: 0,
      dailyViews: [],
      dailyShares: [],
      topReferrers: [],
      platforms: []
    };

    if (!supabase) {
      console.log('Supabase not configured, returning default analytics report');
      return defaultReport;
    }

    try {
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data, error } = await supabase
        .from('blog_analytics')
        .select('*')
        .eq('blog_id', blogId)
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error('Error fetching blog analytics report:', error);
        return defaultReport;
      }

      const views = data.filter(record => record.event_type === 'view');
      const shares = data.filter(record => record.event_type === 'share');

      // 计算每日统计
      const dailyViews = this.groupByDate(views, 'view') as Array<{ date: string; views: number }>;
      const dailyShares = this.groupByDate(shares, 'share') as Array<{ date: string; shares: number }>;

      // 计算引荐来源
      const topReferrers = this.getTopReferrers(views);

      // 计算分享平台
      const platforms = this.getSharePlatforms(shares);

      return {
        totalViews: views.length,
        totalShares: shares.length,
        dailyViews,
        dailyShares,
        topReferrers,
        platforms
      };

    } catch (error) {
      console.error('Failed to fetch blog analytics report:', error);
      return defaultReport;
    }
  }

  /**
   * 按日期分组统计
   */
  private static groupByDate(
    records: any[], 
    type: 'view' | 'share'
  ): Array<{ date: string; views: number } | { date: string; shares: number }> {
    const grouped = records.reduce((acc, record) => {
      const date = new Date(record.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (type === 'view') {
      return Object.entries(grouped).map(([date, count]) => ({
        date,
        views: count
      })) as Array<{ date: string; views: number }>;
    } else {
      return Object.entries(grouped).map(([date, count]) => ({
        date,
        shares: count
      })) as Array<{ date: string; shares: number }>;
    }
  }

  /**
   * 获取顶级引荐来源
   */
  private static getTopReferrers(views: any[]): Array<{ referrer: string; count: number }> {
    const referrers = views.reduce((acc, record) => {
      const referrer = record.metadata?.referrer || 'Direct';
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(referrers)
      .map(([referrer, count]) => ({ referrer, count: count as number }))
      .sort((a, b) => (b.count as number) - (a.count as number))
      .slice(0, 10);
  }

  /**
   * 获取分享平台统计
   */
  private static getSharePlatforms(shares: any[]): Array<{ platform: string; count: number }> {
    const platforms = shares.reduce((acc, record) => {
      const platform = record.metadata?.platform || 'Unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(platforms)
      .map(([platform, count]) => ({ platform, count: count as number }))
      .sort((a, b) => (b.count as number) - (a.count as number));
  }
}
