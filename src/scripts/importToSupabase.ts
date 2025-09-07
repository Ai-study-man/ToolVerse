import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase 数据导入脚本
// 将爬取的 AI 工具数据导入到 Supabase 数据库

interface ImportConfig {
  inputFile: string;
  batchSize: number;
  skipDuplicates: boolean;
  validateData: boolean;
}

interface ImportStats {
  total: number;
  imported: number;
  skipped: number;
  errors: number;
  duplicates: number;
}

class SupabaseImporter {
  private supabase: any;
  private config: ImportConfig;
  private stats: ImportStats = {
    total: 0,
    imported: 0,
    skipped: 0,
    errors: 0,
    duplicates: 0
  };

  constructor(config: ImportConfig) {
    this.config = config;
    
    // 初始化 Supabase 客户端
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase 配置不完整：缺少 URL 或 Service Key');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // 主导入方法
  async import(): Promise<ImportStats> {
    console.log('🚀 开始导入 AI 工具数据到 Supabase...');
    
    try {
      // 1. 读取数据文件
      const data = await this.readDataFile();
      this.stats.total = data.tools.length;
      
      console.log(`📊 准备导入 ${this.stats.total} 个工具`);
      
      // 2. 验证数据格式
      if (this.config.validateData) {
        await this.validateData(data.tools);
      }
      
      // 3. 检查重复数据
      if (this.config.skipDuplicates) {
        data.tools = await this.filterDuplicates(data.tools);
      }
      
      // 4. 批量导入
      await this.batchImport(data.tools);
      
      // 5. 打印统计信息
      this.printStats();
      
      console.log('✅ 数据导入完成');
      return this.stats;
      
    } catch (error) {
      console.error('❌ 数据导入失败:', error);
      throw error;
    }
  }

  // 读取数据文件
  private async readDataFile(): Promise<any> {
    console.log(`📖 读取数据文件: ${this.config.inputFile}`);
    
    if (!fs.existsSync(this.config.inputFile)) {
      throw new Error(`数据文件不存在: ${this.config.inputFile}`);
    }
    
    try {
      const content = fs.readFileSync(this.config.inputFile, 'utf8');
      const data = JSON.parse(content);
      
      if (!data.tools || !Array.isArray(data.tools)) {
        throw new Error('数据文件格式错误：缺少 tools 数组');
      }
      
      return data;
    } catch (error) {
      throw new Error(`读取数据文件失败: ${error}`);
    }
  }

  // 验证数据格式
  private async validateData(tools: any[]): Promise<void> {
    console.log('🔍 验证数据格式...');
    
    const requiredFields = ['name', 'description', 'link'];
    const validPricingModels = ['free', 'freemium', 'paid'];
    
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      
      // 检查必需字段
      for (const field of requiredFields) {
        if (!tool[field]) {
          console.warn(`⚠️ 工具 ${i + 1} 缺少必需字段: ${field}`);
          this.stats.errors++;
        }
      }
      
      // 验证定价模式
      if (tool.pricing && !validPricingModels.includes(tool.pricing)) {
        console.warn(`⚠️ 工具 ${i + 1} 定价模式无效: ${tool.pricing}`);
      }
      
      // 验证评分范围
      if (tool.rating && (tool.rating < 0 || tool.rating > 5)) {
        console.warn(`⚠️ 工具 ${i + 1} 评分超出范围: ${tool.rating}`);
      }
      
      // 验证 URL 格式
      if (tool.link && !this.isValidUrl(tool.link)) {
        console.warn(`⚠️ 工具 ${i + 1} URL 格式无效: ${tool.link}`);
      }
    }
    
    console.log(`✅ 数据验证完成，发现 ${this.stats.errors} 个问题`);
  }

  // 过滤重复数据
  private async filterDuplicates(tools: any[]): Promise<any[]> {
    console.log('🔄 检查重复数据...');
    
    try {
      // 获取现有工具的名称和链接
      const { data: existingTools, error } = await this.supabase
        .from('crawled_tools')
        .select('name, link')
        .eq('status', 'approved');
      
      if (error) {
        console.warn('获取现有数据失败，跳过重复检查:', error);
        return tools;
      }
      
      const existingKeys = new Set(
        existingTools.map((tool: any) => `${tool.name}-${tool.link}`)
      );
      
      const filteredTools = tools.filter(tool => {
        const key = `${tool.name}-${tool.link}`;
        if (existingKeys.has(key)) {
          this.stats.duplicates++;
          return false;
        }
        return true;
      });
      
      console.log(`🗑️ 过滤了 ${this.stats.duplicates} 个重复工具`);
      return filteredTools;
      
    } catch (error) {
      console.warn('重复检查失败，继续导入:', error);
      return tools;
    }
  }

  // 批量导入数据
  private async batchImport(tools: any[]): Promise<void> {
    console.log(`📦 开始批量导入，批次大小: ${this.config.batchSize}`);
    
    for (let i = 0; i < tools.length; i += this.config.batchSize) {
      const batch = tools.slice(i, i + this.config.batchSize);
      const batchNum = Math.floor(i / this.config.batchSize) + 1;
      const totalBatches = Math.ceil(tools.length / this.config.batchSize);
      
      console.log(`📋 导入批次 ${batchNum}/${totalBatches} (${batch.length} 个工具)`);
      
      try {
        // 转换数据格式
        const formattedBatch = batch.map(tool => this.formatToolForSupabase(tool));
        
        // 插入到 Supabase
        const { error } = await this.supabase
          .from('crawled_tools')
          .insert(formattedBatch);
        
        if (error) {
          console.error(`❌ 批次 ${batchNum} 导入失败:`, error);
          this.stats.errors += batch.length;
        } else {
          console.log(`✅ 批次 ${batchNum} 导入成功`);
          this.stats.imported += batch.length;
        }
        
      } catch (error) {
        console.error(`❌ 批次 ${batchNum} 处理失败:`, error);
        this.stats.errors += batch.length;
      }
      
      // 添加延迟避免 API 限流
      if (i + this.config.batchSize < tools.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // 格式化工具数据以匹配 Supabase 表结构
  private formatToolForSupabase(tool: any): any {
    return {
      name: tool.name || '',
      description: tool.description || '',
      tags: tool.tags || [],
      link: tool.link || '',
      use_case: tool.use_case || [],
      model_used: tool.model_used || null,
      pricing: tool.pricing || null,
      category: tool.category || null,
      logo: tool.logo || null,
      rating: tool.rating || null,
      source: tool.source || 'unknown',
      crawled_at: tool.crawled_at || new Date().toISOString(),
      status: 'pending', // 默认为待审核状态
      imported_at: new Date().toISOString()
    };
  }

  // 验证 URL 格式
  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // 打印统计信息
  private printStats(): void {
    console.log('\n📊 导入统计:');
    console.log(`总计: ${this.stats.total} 个工具`);
    console.log(`成功导入: ${this.stats.imported} 个`);
    console.log(`跳过重复: ${this.stats.duplicates} 个`);
    console.log(`错误: ${this.stats.errors} 个`);
    console.log(`成功率: ${((this.stats.imported / this.stats.total) * 100).toFixed(1)}%`);
  }

  // 获取统计信息
  getStats(): ImportStats {
    return { ...this.stats };
  }
}

// 主执行函数
async function main() {
  const inputFile = process.argv[2] || path.join(process.cwd(), 'data', 'crawled-tools.json');
  
  const config: ImportConfig = {
    inputFile,
    batchSize: 10,
    skipDuplicates: true,
    validateData: true
  };

  console.log('🔧 导入配置:');
  console.log(`输入文件: ${config.inputFile}`);
  console.log(`批次大小: ${config.batchSize}`);
  console.log(`跳过重复: ${config.skipDuplicates}`);
  console.log(`验证数据: ${config.validateData}\n`);

  const importer = new SupabaseImporter(config);
  
  try {
    const stats = await importer.import();
    
    if (stats.errors > 0) {
      console.log(`\n⚠️ 导入完成，但有 ${stats.errors} 个错误`);
      process.exit(1);
    } else {
      console.log('\n🎉 导入完全成功！');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('\n💥 导入过程中发生严重错误:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

export { SupabaseImporter, type ImportConfig, type ImportStats };
