import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Notion 客户端配置
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

// Notion 数据库ID
const TOOLS_DATABASE_ID = process.env.NOTION_TOOLS_DATABASE_ID || '';

// Notion 属性映射到我们的 Tool 接口
export interface NotionToolProperties {
  Name: { title: Array<{ plain_text: string }> };
  '简介': { rich_text: Array<{ plain_text: string }> };
  '详细描述': { rich_text: Array<{ plain_text: string }> };
  '网址': { url: string };
  '标签': { multi_select: Array<{ name: string }> };
  '适用场景': { multi_select: Array<{ name: string }> };
  '价格模式': { select: { name: string } };
  '具体价格': { rich_text: Array<{ plain_text: string }> };
  '评分': { number: number };
  '评论数': { number: number };
  '分类': { select: { name: string } };
  '子分类': { select: { name: string } };
  '功能特点': { rich_text: Array<{ plain_text: string }> };
  '官方Logo': { files: Array<{ file?: { url: string }; external?: { url: string } }> };
  '状态': { status: { name: string } };
  '创建时间': { created_time: string };
  '更新时间': { last_edited_time: string };
}

// 工具状态枚举
export type ToolStatus = '进行中' | '未开始' | '已完成' | 'Under Review';

// 价格模式枚举
export type PricingModel = 'free' | 'freemium' | 'paid' | 'subscription' | 'one-time';

// 定价信息中文到英文的翻译映射
const pricingTranslations: { [key: string]: string } = {
  '免费': 'Free',
  '免费版': 'Free',
  '完全免费': 'Free',
  '免费使用': 'Free',
  '开源免费': 'Open Source Free',
  '免费版 + 付费计划': 'Free + Paid Plans',
  '免费版 + Pro版收费': 'Free + Pro Pricing',
  '免费版 + API收费': 'Free + API Pricing',
  '免费版 + Gemini Pro API收费': 'Free + Gemini Pro API Pricing',
  '免费版 + ChatGPT Plus付费': 'Free + ChatGPT Plus Paid',
  '免费版 + $19/月 Pro版': 'Free + $19/month Pro',
  '免费版 + $19/月专业版': 'Free + $19/month Professional',
  '免费版 + $9-19/月': 'Free + $9-19/month',
  '免费版 + Pro版': 'Free + Pro Version',
  '免费版 + $5-15/月': 'Free + $5-15/month',
  '免费版 + $8-18/月': 'Free + $8-18/month',
  '免费版 + $19.99-73.50/月': 'Free + $19.99-73.50/month',
  '免费版 + $8-16/月': 'Free + $8-16/month',
  '免费版 + $8.33-20/月': 'Free + $8.33-20/month',
  '免费版 + $9.99/月 Plus版': 'Free + $9.99/month Plus',
  '免费版 + $20/月 Pro版': 'Free + $20/month Pro',
  '免费版 + API付费使用': 'Free + Paid API Usage',
  '免费版 + $6.99-22.99/月': 'Free + $6.99-22.99/month',
  '免费版 + $5-99/月': 'Free + $5-99/month',
  '免费版 + $12-24/月': 'Free + $12-24/month',
  '免费版 + $19-99/月': 'Free + $19-99/month',
  '免费版 + $15-35/月': 'Free + $15-35/month',
  '免费版 + $299-999/月': 'Free + $299-999/month',
  '免费版 + $49-99/月': 'Free + $49-99/month',
  '免费版 + $0.99-9.99/月': 'Free + $0.99-9.99/month',
  '免费版 + $12/月 Pro版': 'Free + $12/month Pro',
  '免费版 + $7-20/月': 'Free + $7-20/month',
  '免费版 + $12-45/月': 'Free + $12-45/month',
  '免费版 + Creative Cloud 订阅': 'Free + Creative Cloud Subscription',
  '免费版 + $10-48/月': 'Free + $10-48/month',
  '免费版 + $12.99/月 Pro版': 'Free + $12.99/month Pro',
  '免费版 + $24.99/月': 'Free + $24.99/month',
  '免费版 + $9-29/月': 'Free + $9-29/month',
  '免费版 + $8.33-19.95/月': 'Free + $8.33-19.95/month',
  '免费版 + $16-79/月': 'Free + $16-79/month',
  '免费版 + $12-15/月': 'Free + $12-15/month',
  '免费版 + $36/月 Pro版': 'Free + $36/month Pro',
  '免费版 + $20/月 Plus版': 'Free + $20/month Plus',
  '免费个人版 + 企业版': 'Free Personal + Enterprise',
  '开源免费 + 企业版': 'Open Source Free + Enterprise',
  '免费试用': 'Free Trial',
  '免费试用 + 付费计划': 'Free Trial + Paid Plans',
  '免费试用版': 'Free Trial',
  '免费试用 + $15-35/月': 'Free Trial + $15-35/month',
  '基础免费 + 高级付费': 'Basic Free + Premium Paid',
  '基础版免费': 'Basic Free',
  '付费': 'Paid',
  '订阅制': 'Subscription',
  '按需付费': 'Pay-as-you-go',
  '按积分收费，$10起': 'Credit-based pricing, starting from $10',
  '通过Google Cloud API': 'Through Google Cloud API',
  '一次性付费': 'One-time Payment',
  '$19-34/月': '$19-34/month',
  '$19-99/月': '$19-99/month',
  '$30-90/月': '$30-90/month',
  '$39-599/月': '$39-599/month',
  '$299-999/月': '$299-999/month',
  '$14.99-114.99/月': '$14.99-114.99/month',
  '$170-650/月': '$170-650/month',
  '$119.95-449.95/月': '$119.95-449.95/month',
  '$149-599/月': '$149-599/month',
  '$59-239/月': '$59-239/month',
  '$30-70/月': '$30-70/month',
  '$70-150/月': '$70-150/month',
  '$39-125/月': '$39-125/month',
  '$10/月个人版': '$10/month Personal',
  '$10/月 AI 插件': '$10/month AI Add-on',
  '$20-96/次性付费': '$20-96 One-time Payment',
  '$10-60/月订阅制': '$10-60/month Subscription',
  '企业定价': 'Enterprise Pricing',
  '联系销售': 'Contact Sales',
  '联系销售定价': 'Contact Sales for Pricing',
  '价格面议': 'Contact for Pricing'
};

// 翻译定价信息
function translatePricing(chinesePricing: string): string {
  try {
    if (!chinesePricing || typeof chinesePricing !== 'string') {
      return 'Contact for pricing';
    }
    return pricingTranslations[chinesePricing] || chinesePricing;
  } catch (error) {
    console.error('Error translating pricing:', error);
    return chinesePricing || 'Contact for pricing';
  }
}

// Notion工具数据转换为应用工具数据
export function transformNotionToolToAppTool(page: PageObjectResponse): any {
  const properties = page.properties as unknown as NotionToolProperties;
  
  // 安全获取属性值的辅助函数
  const getTitle = (prop: any) => prop?.title?.[0]?.plain_text || '';
  const getRichText = (prop: any) => prop?.rich_text?.map((t: any) => t.plain_text).join(' ') || '';
  const getSelect = (prop: any) => prop?.select?.name || '';
  const getStatus = (prop: any) => prop?.status?.name || '';
  const getMultiSelect = (prop: any) => prop?.multi_select?.map((s: any) => s.name) || [];
  const getNumber = (prop: any) => prop?.number || 0;
  const getUrl = (prop: any) => prop?.url || '';
  const getFiles = (prop: any) => prop?.files?.[0]?.file?.url || prop?.files?.[0]?.external?.url || '';

  // 处理功能特点，转换为数组
  const featuresText = getRichText(properties['功能特点']);
  const features = featuresText 
    ? featuresText.split('\n').filter((f: string) => f.trim()).map((f: string) => f.replace(/^[-•*]\s*/, ''))
    : [];

  // 处理适用场景
  const useCases = getMultiSelect(properties['适用场景']);

  // 生成工具ID（使用Notion页面ID或基于名称生成）
  const toolId = page.id.replace(/-/g, '');

  // 获取Logo URL，如果没有则使用默认SVG
  const logoUrl = getFiles(properties['官方Logo']);
  const toolName = getTitle(properties.Name);
  const firstLetter = toolName.charAt(0).toUpperCase();
  const defaultLogo = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='gradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%232563eb'/%3E%3Cstop offset='100%25' stop-color='%237c3aed'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='12' fill='url(%23gradient)'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='28' font-weight='bold' fill='white'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;

  return {
    id: toolId,
    name: getTitle(properties.Name),
    shortDescription: getRichText(properties['简介']),
    description: getRichText(properties['详细描述']) || getRichText(properties['简介']),
    website: getUrl(properties['网址']),
    logo: logoUrl || defaultLogo,
    category: getSelect(properties['分类']),
    subcategory: getSelect(properties['子分类']) || undefined,
    tags: getMultiSelect(properties['标签']),
    useCases: useCases,
    features: features,
    pricingModel: getSelect(properties['价格模式']).toLowerCase() as PricingModel || 'freemium',
    pricing: translatePricing(getRichText(properties['具体价格'])) || 'Contact for pricing',
    rating: getNumber(properties['评分']) || 4.0,
    reviewCount: getNumber(properties['评论数']) || 0,
    status: getStatus(properties['状态']) as ToolStatus || '进行中',
    createdAt: properties['创建时间']?.created_time || new Date().toISOString(),
    updatedAt: properties['更新时间']?.last_edited_time || new Date().toISOString(),
    
    // 兼容现有接口的字段
    featured: false, // 可以后续通过Notion属性控制
    verified: getStatus(properties['状态']) === '进行中',
  };
}

/**
 * Notion API 服务类
 */
export class NotionToolsService {
  
  /**
   * 获取所有已发布的工具（包括所有状态的工具以确保最大数据覆盖）
   */
  static async getAllPublishedTools() {
    try {
      // 首先尝试获取所有工具，不过滤状态
      const response = await notion.databases.query({
        database_id: TOOLS_DATABASE_ID,
        sorts: [
          {
            timestamp: 'last_edited_time',
            direction: 'descending'
          }
        ],
        page_size: 100  // 增加页面大小以获取更多工具
      });

      console.log(`Found ${response.results.length} total tools in Notion database`);

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(transformNotionToolToAppTool);

    } catch (error) {
      console.error('Error fetching tools from Notion:', error);
      throw error;
    }
  }

  /**
   * 获取所有工具（包括未发布的）
   */
  static async getAllTools() {
    try {
      const response = await notion.databases.query({
        database_id: TOOLS_DATABASE_ID,
        sorts: [
          {
            timestamp: 'last_edited_time',
            direction: 'descending'
          }
        ],
        page_size: 100
      });

      console.log(`Found ${response.results.length} total tools (all statuses) in Notion database`);

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(transformNotionToolToAppTool);

    } catch (error) {
      console.error('Error fetching all tools from Notion:', error);
      throw error;
    }
  }

  /**
   * 根据分类获取工具
   */
  static async getToolsByCategory(category: string) {
    try {
      const response = await notion.databases.query({
        database_id: TOOLS_DATABASE_ID,
        filter: {
          and: [
            {
              property: '状态',
              status: {
                equals: '进行中'
              }
            },
            {
              property: '分类',
              select: {
                equals: category
              }
            }
          ]
        },
        sorts: [
          {
            property: '评分',
            direction: 'descending'
          }
        ]
      });

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(transformNotionToolToAppTool);

    } catch (error) {
      console.error('Error fetching tools by category from Notion:', error);
      throw error;
    }
  }

  /**
   * 搜索工具
   */
  static async searchTools(query: string) {
    try {
      const response = await notion.databases.query({
        database_id: TOOLS_DATABASE_ID,
        filter: {
          and: [
            {
              property: '状态',
              status: {
                equals: '进行中'
              }
            },
            {
              or: [
                {
                  property: 'Name',
                  title: {
                    contains: query
                  }
                },
                {
                  property: '简介',
                  rich_text: {
                    contains: query
                  }
                },
                {
                  property: '标签',
                  multi_select: {
                    contains: query
                  }
                }
              ]
            }
          ]
        }
      });

      return response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .map(transformNotionToolToAppTool);

    } catch (error) {
      console.error('Error searching tools in Notion:', error);
      throw error;
    }
  }

  /**
   * 获取单个工具详情
   */
  static async getToolById(id: string) {
    try {
      console.log(`获取工具详情，原始ID: ${id}`);
      
      // 将简化的ID转换回Notion页面ID格式
      const notionId = `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20, 32)}`;
      console.log(`转换后的Notion ID: ${notionId}`);
      
      const page = await notion.pages.retrieve({ page_id: notionId });
      console.log(`成功获取Notion页面`);
      
      if ('properties' in page) {
        const tool = transformNotionToolToAppTool(page as PageObjectResponse);
        console.log(`成功转换工具数据: ${tool.name}`);
        return tool;
      }
      
      console.log('页面没有properties属性');
      return null;
    } catch (error: any) {
      console.error('Error fetching tool by ID from Notion:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status
      });
      return null;
    }
  }

  /**
   * 获取所有分类
   */
  static async getAllCategories() {
    try {
      // 获取所有工具，不过滤状态
      const response = await notion.databases.query({
        database_id: TOOLS_DATABASE_ID,
        sorts: [
          {
            timestamp: 'last_edited_time',
            direction: 'descending'
          }
        ]
      });

      const categoryCount = new Map<string, number>();
      
      response.results
        .filter((page): page is PageObjectResponse => 'properties' in page)
        .forEach(page => {
          const properties = page.properties as unknown as NotionToolProperties;
          const category = properties['分类']?.select?.name;
          if (category) {
            categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
          }
        });

      // 定义类别图标映射
      const categoryIcons: { [key: string]: string } = {
        'Writing & Content': '✍️',
        'Design & Art': '🎨',
        'Development': '💻',
        'Business & Analytics': '📊',
        'Marketing & SEO': '📈',
        'Video & Audio': '🎥',
        'Language & Translation': '🌐',
        'Image Generation': '🖼️',
        'Productivity': '⚡',
        'Code Development': '⌨️',
        'Conversational AI': '💬'
      };

      return Array.from(categoryCount.entries()).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
        description: `Discover ${name} tools`,
        icon: categoryIcons[name] || '🔧',
        toolCount: count
      }));

    } catch (error) {
      console.error('Error fetching categories from Notion:', error);
      throw error;
    }
  }

  /**
   * 获取数据库结构信息
   */
  static async getDatabaseSchema() {
    try {
      const database = await notion.databases.retrieve({
        database_id: TOOLS_DATABASE_ID
      });
      
      return database.properties;
    } catch (error) {
      console.error('Error fetching database schema:', error);
      throw error;
    }
  }
}

export default NotionToolsService;
