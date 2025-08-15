#!/usr/bin/env node

// 快速检查环境配置脚本
// 运行命令: node scripts/check-env.js

const fs = require('fs');
const path = require('path');

console.log('🔍 检查 Supabase 环境配置...\n');

// 检查 .env.local 文件是否存在
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ 找不到 .env.local 文件');
  console.log('📝 请在项目根目录创建 .env.local 文件\n');
  console.log('文件内容示例:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-key\n');
  process.exit(1);
}

// 读取环境变量
require('dotenv').config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('📋 环境变量检查结果:');

// 检查 URL
if (!supabaseUrl) {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL 未设置');
} else if (supabaseUrl.includes('placeholder')) {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL 仍然是占位符');
} else if (supabaseUrl.includes('supabase.co')) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL 格式正确');
  console.log(`   ${supabaseUrl}`);
} else {
  console.log('⚠️  NEXT_PUBLIC_SUPABASE_URL 格式可能不正确');
  console.log(`   ${supabaseUrl}`);
}

// 检查匿名密钥
if (!anonKey) {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY 未设置');
} else if (anonKey.includes('placeholder')) {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY 仍然是占位符');
} else if (anonKey.startsWith('eyJ')) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY 格式正确');
  console.log(`   ${anonKey.substring(0, 20)}...`);
} else {
  console.log('⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY 格式可能不正确');
}

// 检查服务密钥
if (!serviceKey) {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY 未设置（可选）');
} else if (serviceKey.includes('placeholder')) {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY 仍然是占位符');
} else if (serviceKey.startsWith('eyJ')) {
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY 格式正确');
  console.log(`   ${serviceKey.substring(0, 20)}...`);
} else {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY 格式可能不正确');
}

const hasValidConfig = supabaseUrl && anonKey && 
                      !supabaseUrl.includes('placeholder') && 
                      !anonKey.includes('placeholder');

if (hasValidConfig) {
  console.log('\n🎉 环境配置看起来正确！');
  console.log('📝 下一步: 运行数据库测试');
  console.log('   npm run dev');
  console.log('   然后访问: http://localhost:3000/database-test');
} else {
  console.log('\n❌ 环境配置需要修复');
  console.log('📖 请参考 SUPABASE_SETUP_GUIDE.md 获取详细说明');
}

console.log('\n' + '='.repeat(50));
console.log('💡 提示: 确保重启开发服务器后再测试');
console.log('   Ctrl+C 停止服务器');
console.log('   npm run dev 重新启动');
