import { NotionToolsService } from './notionService';
import { Tool, Category } from '../types';
import { allTools as mockTools, categories as mockCategories } from '../data/mockData';

/**
 * 数据同步服务
 * 处理从 Notion 到本地缓存的数据同步
 */
export class DataSyncService {
  private static CACHE_KEY = 'toolverse_cached_data';
  private static CACHE_TIMESTAMP_KEY = 'toolverse_cache_timestamp';
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

  // 服务器端内存缓存
  private static memoryCache: { tools: Tool[], categories: Category[] } | null = null;
  private static memoryCacheTimestamp: number = 0;

  /**
   * 获取工具数据（优先从缓存读取）
   */
  static async getTools(): Promise<Tool[]> {
    try {
      // 检查缓存是否有效
      if (this.isCacheValid()) {
        const cachedData = this.getCachedData();
        if (cachedData && cachedData.tools && cachedData.tools.length > 0) {
          console.log('Using cached tools data');
          return cachedData.tools;
        }
      }

      // 客户端通过API获取数据，服务端直接调用NotionService
      let tools: Tool[];
      if (typeof window !== 'undefined') {
        // 客户端：通过API获取工具
        console.log('Fetching tools data from API');
        const response = await fetch('/api/tools');
        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`);
        }
        tools = await response.json();
      } else {
        // 服务端：直接调用NotionService
        console.log('Fetching fresh tools data from Notion');
        tools = await NotionToolsService.getAllPublishedTools();
      }
      
      // 如果工具数量太少，使用mockData作为补充
      if (tools.length < 10) {
        console.log(`Only ${tools.length} tools, using mockData as backup`);
        tools = [...tools, ...mockTools];
        
        // 去重（基于name或id）
        const uniqueTools = tools.filter((tool, index, self) => 
          index === self.findIndex(t => t.name === tool.name || t.id === tool.id)
        );
        tools = uniqueTools;
        console.log(`Combined tools count: ${tools.length}`);
      }
      
      // 更新缓存
      this.updateCache({ tools, categories: [] });
      
      return tools;
    } catch (error) {
      console.error('Error fetching tools:', error);
      
      // 发生错误时尝试使用缓存数据
      const cachedData = this.getCachedData();
      if (cachedData && cachedData.tools && cachedData.tools.length > 0) {
        console.log('Using stale cached data due to error');
        return cachedData.tools;
      }
      
      // 如果没有缓存，返回空数组
      return [];
    }
  }

  /**
   * 获取分类数据（优先从缓存读取）
   */
  static async getCategories(): Promise<Category[]> {
    try {
      // 检查缓存是否有效
      if (this.isCacheValid()) {
        const cachedData = this.getCachedData();
        if (cachedData && cachedData.categories && cachedData.categories.length > 0) {
          console.log('Using cached categories data');
          return cachedData.categories;
        }
      }

      // 客户端通过API获取数据，服务端直接调用NotionService
      let notionCategories: any[];
      if (typeof window !== 'undefined') {
        // 客户端：通过API获取分类
        console.log('Fetching categories data from API');
        const response = await fetch('/api/categories');
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Categories API call failed');
        }
        
        notionCategories = result.data.categories || [];
      } else {      // 服务端：直接调用NotionService
      console.log('Fetching fresh categories data from Notion');
      notionCategories = await NotionToolsService.getAllCategories();
      
      // 如果Notion返回的分类数量太少，使用mockData作为补充
      if (notionCategories.length < 5) {
        console.log(`Only ${notionCategories.length} categories from Notion, using mockData as backup`);
        notionCategories = [...notionCategories, ...mockCategories];
        
        // 去重（基于name或slug）
        const uniqueCategories = notionCategories.filter((cat, index, self) => 
          index === self.findIndex(c => c.name === cat.name || c.slug === cat.slug)
        );
        notionCategories = uniqueCategories;
        console.log(`Combined categories count: ${notionCategories.length}`);
      }
      }
      
      // 获取工具数据以计算分类中的工具数量
      const allTools = await this.getTools();
      
      // 计算每个分类的工具数量
      const categories: Category[] = notionCategories.map(cat => {
        const toolCount = allTools.filter(tool => tool.category === cat.name).length;
        return {
          ...cat,
          toolCount
        };
      });
      
      // 更新缓存
      const cachedTools = this.getCachedData()?.tools || [];
      this.updateCache({ tools: cachedTools, categories });
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // 发生错误时尝试使用缓存数据
      const cachedData = this.getCachedData();
      if (cachedData && cachedData.categories && cachedData.categories.length > 0) {
        console.log('Using stale cached data due to error');
        return cachedData.categories;
      }
      
      // 如果没有缓存，返回默认分类
      return this.getDefaultCategories();
    }
  }

  /**
   * 搜索工具
   */
  static async searchTools(query: string): Promise<Tool[]> {
    try {
      // 对于搜索，直接查询 Notion API 以获取最新结果
      return await NotionToolsService.searchTools(query);
    } catch (error) {
      console.error('Error searching tools:', error);
      
      // 搜索失败时，在本地缓存中搜索
      const cachedTools = await this.getTools();
      return this.searchInLocalData(cachedTools, query);
    }
  }

  /**
   * 根据分类获取工具
   */
  static async getToolsByCategory(category: string): Promise<Tool[]> {
    try {
      return await NotionToolsService.getToolsByCategory(category);
    } catch (error) {
      console.error('Error fetching tools by category:', error);
      
      // 失败时在本地缓存中筛选
      const cachedTools = await this.getTools();
      return cachedTools.filter(tool => 
        tool.category?.toLowerCase() === category.toLowerCase()
      );
    }
  }

  /**
   * 获取单个工具
   */
  static async getToolById(id: string): Promise<Tool | null> {
    try {
      // 首先尝试从 Notion 获取最新数据
      const tool = await NotionToolsService.getToolById(id);
      if (tool) {
        return tool;
      }
    } catch (error) {
      console.error('Error fetching tool by ID:', error);
    }

    // 如果 Notion 查询失败，在本地缓存中查找
    const cachedTools = await this.getTools();
    return cachedTools.find(tool => tool.id === id) || null;
  }

  /**
   * 强制刷新缓存
   */
  static async forceRefresh(): Promise<{ tools: Tool[], categories: Category[] }> {
    try {
      console.log('Force refreshing data from Notion');
      
      const [tools, notionCategories] = await Promise.all([
        NotionToolsService.getAllPublishedTools(),
        NotionToolsService.getAllCategories()
      ]);

      const categories: Category[] = notionCategories.map(cat => ({
        ...cat,
        toolCount: 0 // 可以后续计算实际工具数量
      }));

      this.updateCache({ tools, categories });
      
      return { tools, categories };
    } catch (error) {
      console.error('Error force refreshing data:', error);
      throw error;
    }
  }

  /**
   * 检查缓存是否有效
   */
  private static isCacheValid(): boolean {
    // 服务器端检查内存缓存
    if (typeof window === 'undefined') {
      const now = Date.now();
      return this.memoryCache !== null && (now - this.memoryCacheTimestamp) < this.CACHE_DURATION;
    }
    
    // 客户端检查 localStorage 缓存
    const timestamp = localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
    if (!timestamp) return false;
    
    const cacheTime = parseInt(timestamp);
    const now = Date.now();
    
    return (now - cacheTime) < this.CACHE_DURATION;
  }

  /**
   * 获取缓存数据
   */
  private static getCachedData(): { tools: Tool[], categories: Category[] } | null {
    // 服务器端返回内存缓存
    if (typeof window === 'undefined') {
      return this.memoryCache;
    }
    
    // 客户端返回 localStorage 缓存
    try {
      const data = localStorage.getItem(this.CACHE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing cached data:', error);
      return null;
    }
  }

  /**
   * 更新缓存
   */
  private static updateCache(data: { tools: Tool[], categories: Category[] }): void {
    // 服务器端更新内存缓存
    if (typeof window === 'undefined') {
      this.memoryCache = data;
      this.memoryCacheTimestamp = Date.now();
      console.log(`Server cache updated with ${data.tools.length} tools and ${data.categories.length} categories`);
      return;
    }
    
    // 客户端更新 localStorage 缓存
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log(`Browser cache updated with ${data.tools.length} tools and ${data.categories.length} categories`);
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  }

  /**
   * 在本地数据中搜索
   */
  private static searchInLocalData(tools: Tool[], query: string): Tool[] {
    const searchTerm = query.toLowerCase();
    
    return tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.shortDescription.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      tool.category?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * 获取默认分类（备用数据）
   */
  private static getDefaultCategories(): Category[] {
    return [
      {
        id: 'writing-content',
        name: 'Writing & Content',
        slug: 'writing-content',
        description: 'AI tools for content creation and writing assistance',
        icon: '✍️',
        toolCount: 0
      },
      {
        id: 'design-art',
        name: 'Design & Art',
        slug: 'design-art',
        description: 'Creative AI tools for design and artistic work',
        icon: '🎨',
        toolCount: 0
      },
      {
        id: 'productivity',
        name: 'Productivity',
        slug: 'productivity',
        description: 'AI tools to boost your productivity and efficiency',
        icon: '⚡',
        toolCount: 0
      },
      {
        id: 'business',
        name: 'Business',
        slug: 'business',
        description: 'AI solutions for business and enterprise',
        icon: '💼',
        toolCount: 0
      },
      {
        id: 'developer-tools',
        name: 'Developer Tools',
        slug: 'developer-tools',
        description: 'AI-powered development and coding tools',
        icon: '⚙️',
        toolCount: 0
      },
      {
        id: 'data-analytics',
        name: 'Data & Analytics',
        slug: 'data-analytics',
        description: 'AI tools for data analysis and insights',
        icon: '📊',
        toolCount: 0
      }
    ];
  }

  /**
   * 获取缓存统计信息
   */
  static getCacheInfo(): {
    isValid: boolean;
    lastUpdate: string | null;
    toolsCount: number;
    categoriesCount: number;
  } {
    const isValid = this.isCacheValid();
    const timestamp = typeof window !== 'undefined' 
      ? localStorage.getItem(this.CACHE_TIMESTAMP_KEY) 
      : null;
    const cachedData = this.getCachedData();
    
    return {
      isValid,
      lastUpdate: timestamp ? new Date(parseInt(timestamp)).toISOString() : null,
      toolsCount: cachedData?.tools?.length || 0,
      categoriesCount: cachedData?.categories?.length || 0
    };
  }

  /**
   * 清除缓存
   */
  static clearCache(): void {
    // 清除服务器端内存缓存
    if (typeof window === 'undefined') {
      this.memoryCache = null;
      this.memoryCacheTimestamp = 0;
      console.log('Server cache cleared');
      return;
    }
    
    // 清除客户端 localStorage 缓存
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
    console.log('Browser cache cleared');
  }
}

export default DataSyncService;
