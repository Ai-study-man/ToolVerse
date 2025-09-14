#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 缺少 Supabase 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabasePermissions() {
  console.log('🔍 测试数据库权限...\n');

  try {
    // 1. 测试读取权限
    console.log('📖 测试读取权限...');
    const { data: readData, error: readError } = await supabase
      .from('tools')
      .select('id, name, status')
      .limit(1);

    if (readError) {
      console.error('❌ 读取失败:', readError.message);
    } else {
      console.log('✅ 读取成功，获取到数据:', readData?.length || 0, '条');
    }

    // 2. 测试更新权限 - 先试试更新一个不存在的记录
    console.log('\n🔄 测试更新权限...');
    const { data: updateData, error: updateError } = await supabase
      .from('tools')
      .update({ status: 'active' })
      .eq('id', 'test-non-existent-id')
      .select();

    if (updateError) {
      console.error('❌ 更新失败:', updateError.message);
      console.error('   错误代码:', updateError.code);
      console.error('   错误详情:', updateError.details);
    } else {
      console.log('✅ 更新权限正常（没有匹配的记录，这是预期的）');
    }

    // 3. 测试插入权限
    console.log('\n➕ 测试插入权限...');
    const { data: insertData, error: insertError } = await supabase
      .from('tools')
      .insert([{
        id: 'test-permission-tool',
        name: 'Test Permission Tool',
        description: 'Testing database permissions',
        shortDescription: 'Test tool',
        logo: '/test.png',
        website: 'https://example.com',
        category: 'Test',
        pricingModel: 'free',
        pricing: 'Free',
        rating: 4.0,
        reviewCount: 0,
        tags: ['test'],
        features: ['test'],
        createdAt: new Date().toISOString(),
        status: 'active'
      }])
      .select();

    if (insertError) {
      console.error('❌ 插入失败:', insertError.message);
      console.error('   错误代码:', insertError.code);
      console.error('   错误详情:', insertError.details);
    } else {
      console.log('✅ 插入成功');
      
      // 如果插入成功，立即删除测试数据
      const { error: deleteError } = await supabase
        .from('tools')
        .delete()
        .eq('id', 'test-permission-tool');
      
      if (deleteError) {
        console.warn('⚠️  清理测试数据失败:', deleteError.message);
      } else {
        console.log('🧹 测试数据已清理');
      }
    }

    // 4. 检查RLS状态
    console.log('\n🔒 检查表结构和权限...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('tools')
      .select('*')
      .limit(0); // 只获取结构，不获取数据

    if (tableError) {
      console.error('❌ 获取表结构失败:', tableError.message);
    } else {
      console.log('✅ 表结构访问正常');
    }

  } catch (error: any) {
    console.error('❌ 测试过程发生异常:', error.message);
  }

  // 5. 显示环境变量信息（脱敏）
  console.log('\n📋 环境变量检查:');
  console.log(`   Supabase URL: ${supabaseUrl?.substring(0, 30)}...`);
  console.log(`   Anon Key: ${supabaseAnonKey?.substring(0, 20)}...${supabaseAnonKey?.substring(-10)}`);
}

// 运行测试
if (require.main === module) {
  testDatabasePermissions().catch(console.error);
}
