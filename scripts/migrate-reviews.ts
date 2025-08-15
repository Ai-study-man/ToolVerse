import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('缺少 Supabase 配置信息');
  console.error('请确保 .env.local 文件中包含以下变量:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

// 使用服务角色密钥创建管理员客户端
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('开始运行数据库迁移...');
    
    // 读取SQL迁移文件
    const sqlFilePath = path.join(process.cwd(), 'database', 'create_reviews_table.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      console.error(`找不到SQL文件: ${sqlFilePath}`);
      process.exit(1);
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    // 将SQL文件按分号分割成多个语句
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`准备执行 ${statements.length} 个SQL语句...`);
    
    // 逐个执行SQL语句
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim().length === 0) continue;
      
      console.log(`执行语句 ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabase.rpc('execute_sql', { 
        sql_statement: statement 
      });
      
      if (error) {
        // 尝试直接执行，如果 execute_sql 函数不存在
        console.log('尝试直接执行SQL...');
        const directResult = await supabase
          .from('_migration_temp')
          .select('1')
          .limit(1);
        
        // 如果表不存在，先创建基础表
        if (statement.toLowerCase().includes('create table reviews')) {
          console.log('创建 reviews 表...');
          // 由于 Supabase 的限制，我们需要手动创建表
          console.log('请手动在 Supabase 控制台中运行以下SQL:');
          console.log('='.repeat(80));
          console.log(sqlContent);
          console.log('='.repeat(80));
          console.log('或者使用 Supabase CLI: supabase db push');
          
          return;
        }
      }
    }
    
    console.log('数据库迁移完成！');
    
    // 验证表是否创建成功
    console.log('验证表结构...');
    const { data, error: selectError } = await supabase
      .from('reviews')
      .select('*')
      .limit(0);
    
    if (selectError) {
      console.error('验证失败:', selectError);
    } else {
      console.log('✅ reviews 表创建成功');
    }
    
    // 检查统计视图
    const { data: statsData, error: statsError } = await supabase
      .from('review_stats')
      .select('*')
      .limit(0);
    
    if (statsError) {
      console.error('统计视图验证失败:', statsError);
    } else {
      console.log('✅ review_stats 视图创建成功');
    }
    
  } catch (error) {
    console.error('迁移失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  runMigration();
}
