#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 快速测试配置
const TEST_CONFIG = {
  TIMEOUT: 5000,
  TEST_COUNT: 5, // 只测试前5个工具
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 快速检查单个网站
async function quickCheckWebsite(url: string): Promise<{ status: 'active' | 'inactive'; error?: string; statusCode?: number }> {
  try {
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    console.log(`🔍 检查: ${normalizedUrl}`);

    // 先尝试HEAD请求，如果失败再用GET
    let response;
    try {
      response = await axios.head(normalizedUrl, {
        timeout: TEST_CONFIG.TIMEOUT,
        headers: {
          'User-Agent': TEST_CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
        },
        validateStatus: function (status) {
          return true;
        },
        maxRedirects: 5,
      });
    } catch (headError: any) {
      // HEAD失败，尝试GET请求
      console.log(`🔄 HEAD请求失败，尝试GET: ${normalizedUrl}`);
      response = await axios.get(normalizedUrl, {
        timeout: TEST_CONFIG.TIMEOUT,
        headers: {
          'User-Agent': TEST_CONFIG.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
        },
        validateStatus: function (status) {
          return true;
        },
        maxRedirects: 5,
        maxContentLength: 1024 * 1024, // 限制1MB，只需要检查连通性
      });
    }

    // 判断状态
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ 成功: ${normalizedUrl} (${response.status})`);
      return { status: 'active', statusCode: response.status };
    } else if (response.status >= 300 && response.status < 400) {
      console.log(`✅ 重定向: ${normalizedUrl} (${response.status}) - 网站正常`);
      return { status: 'active', statusCode: response.status };
    } else if (response.status === 403) {
      console.log(`⚠️  被保护: ${normalizedUrl} (403) - 可能有反爬虫保护，但网站存在`);
      return { status: 'active', error: '403 - 被反爬虫保护', statusCode: response.status };
    } else if (response.status === 404) {
      console.log(`❌ 失败: ${normalizedUrl} (404) - 页面不存在`);
      return { status: 'inactive', error: `HTTP ${response.status}`, statusCode: response.status };
    } else if (response.status >= 500) {
      console.log(`❌ 失败: ${normalizedUrl} (${response.status}) - 服务器错误`);
      return { status: 'inactive', error: `HTTP ${response.status}`, statusCode: response.status };
    } else {
      console.log(`❌ 失败: ${normalizedUrl} (${response.status})`);
      return { status: 'inactive', error: `HTTP ${response.status}`, statusCode: response.status };
    }

  } catch (error: any) {
    console.log(`❌ 错误: ${url} - ${error.message}`);
    
    if (error.code === 'ECONNABORTED') {
      return { status: 'inactive', error: '请求超时', statusCode: 0 };
    } else if (error.code === 'ECONNRESET') {
      return { status: 'inactive', error: '连接被重置', statusCode: 0 };
    } else if (error.code === 'ENOTFOUND') {
      return { status: 'inactive', error: '域名不存在', statusCode: 0 };
    } else {
      return { status: 'inactive', error: error.message || 'Unknown error', statusCode: error.response?.status || 0 };
    }
  }
}

// 快速测试函数
async function quickTest() {
  console.log('🚀 开始快速死链检测测试...\n');

  try {
    // 获取前几个工具进行测试
    console.log(`📥 获取前 ${TEST_CONFIG.TEST_COUNT} 个工具...`);
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, website')
      .not('website', 'is', null)
      .limit(TEST_CONFIG.TEST_COUNT);

    if (error) {
      throw new Error(`获取数据失败: ${error.message}`);
    }

    if (!tools || tools.length === 0) {
      console.log('⚠️  没有找到包含网站链接的工具');
      return;
    }

    console.log(`📋 找到 ${tools.length} 个工具进行快速测试\n`);

    // 逐个检查
    let activeCount = 0;
    let inactiveCount = 0;

    for (const tool of tools) {
      console.log(`\n📝 工具: ${tool.name}`);
      if (!tool.website) {
        console.log('⚠️  没有网站链接');
        inactiveCount++;
        continue;
      }

      const result = await quickCheckWebsite(tool.website);
      if (result.status === 'active') {
        activeCount++;
      } else {
        inactiveCount++;
      }

      // 短暂延迟
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n📊 快速测试结果:');
    console.log(`✅ 正常: ${activeCount} 个`);
    console.log(`❌ 失效: ${inactiveCount} 个`);
    console.log(`📈 成功率: ${((activeCount / tools.length) * 100).toFixed(1)}%`);

    console.log('\n💡 如果测试结果正常，可以运行完整检测：');
    console.log('   npm run check-dead-links');

  } catch (error: any) {
    console.error('❌ 测试过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 运行快速测试
if (require.main === module) {
  quickTest().catch(console.error);
}
