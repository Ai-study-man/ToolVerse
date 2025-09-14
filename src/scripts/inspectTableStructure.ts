#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTableStructure() {
  console.log('🔍 检查数据库表结构...\n');

  try {
    // 获取第一条记录来查看实际字段
    const { data: sample, error: sampleError } = await supabase
      .from('tools')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('❌ 获取样本数据失败:', sampleError.message);
      return;
    }

    if (!sample || sample.length === 0) {
      console.log('⚠️  表中没有数据');
      return;
    }

    const firstRecord = sample[0];
    console.log('📋 实际表字段:');
    Object.keys(firstRecord).forEach((key, index) => {
      const value = firstRecord[key];
      const type = typeof value;
      const preview = type === 'string' && value.length > 50 
        ? value.substring(0, 47) + '...' 
        : value;
      
      console.log(`   ${index + 1}. ${key}: ${type} = ${preview}`);
    });

    // 检查是否有status字段
    console.log('\n🔍 特别检查status字段:');
    if ('status' in firstRecord) {
      console.log(`✅ status字段存在，值: ${firstRecord.status}`);
    } else {
      console.log('❌ status字段不存在');
    }

    // 检查是否有createdAt字段
    console.log('\n🔍 特别检查时间字段:');
    const timeFields = ['createdAt', 'created_at', 'lastUpdated', 'last_updated', 'updatedAt', 'updated_at'];
    let foundTimeFields = [];
    
    timeFields.forEach(field => {
      if (field in firstRecord) {
        foundTimeFields.push(field);
        console.log(`✅ ${field}字段存在，值: ${firstRecord[field]}`);
      }
    });
    
    if (foundTimeFields.length === 0) {
      console.log('❌ 没有找到时间相关字段');
    }

    // 统计字段总数
    console.log(`\n📊 总字段数: ${Object.keys(firstRecord).length}`);

  } catch (error: any) {
    console.error('❌ 检查过程发生异常:', error.message);
  }
}

// 运行检查
if (require.main === module) {
  inspectTableStructure().catch(console.error);
}
