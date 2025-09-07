#!/usr/bin/env node

// Notion 配置向导
// 交互式配置 Notion 集成

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function configWizard() {
  console.log('🚀 Notion 集成配置向导\n');
  console.log('这个向导将帮助你配置 Notion API 集成\n');

  try {
    // 读取现有配置
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ 找到现有的 .env.local 文件\n');
    } else {
      console.log('📝 将创建新的 .env.local 文件\n');
    }

    // 获取 Notion Token
    console.log('第一步：获取 Notion Integration Token');
    console.log('1. 访问: https://www.notion.so/my-integrations');
    console.log('2. 点击 "New integration"');
    console.log('3. 创建集成并复制 token (格式: secret_xxxx 或 ntn_xxxx)\n');
    
    const token = await question('请输入你的 Notion API Token: ');
    
    if (!token.startsWith('secret_') && !token.startsWith('ntn_')) {
      console.log('⚠️ Token 格式似乎不正确，应该以 "secret_" 或 "ntn_" 开头');
    }

    // 获取数据库 ID
    console.log('\n第二步：获取数据库 ID');
    console.log('1. 在 Notion 中创建一个数据库');
    console.log('2. 复制数据库页面的 URL');
    console.log('3. 从 URL 中提取数据库 ID (32位字符)\n');
    
    const databaseId = await question('请输入数据库 ID: ');
    
    if (databaseId.length !== 32) {
      console.log('⚠️ 数据库 ID 长度应该是 32 位字符');
    }

    // 可选配置
    console.log('\n第三步：可选配置 (可以直接按回车跳过)');
    const cronSecret = await question('Cron 密钥 (用于定时任务): ') || 'default-cron-secret';
    const syncSecret = await question('同步密钥 (用于手动同步): ') || 'default-sync-secret';

    // 生成 .env.local 内容
    const config = `# AI 工具站配置
# 由配置向导自动生成

# Notion 配置 (必需)
NOTION_API_TOKEN=${token}
NOTION_TOOLS_DATABASE_ID=${databaseId}

# 同步配置
CRON_SECRET=${cronSecret}
MANUAL_SYNC_SECRET=${syncSecret}

# 其他可选配置
# OPENAI_API_KEY=sk-your-openai-key
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_KEY=your-service-key
`;

    // 保存配置
    fs.writeFileSync(envPath, config);
    console.log('\n✅ 配置已保存到 .env.local');

    // 测试配置
    console.log('\n🔍 测试配置...');
    console.log('运行以下命令测试配置:');
    console.log('npm run check-notion\n');

    const shouldTest = await question('是否现在测试配置? (y/n): ');
    
    if (shouldTest.toLowerCase() === 'y') {
      rl.close();
      
      // 运行测试
      const { spawn } = require('child_process');
      const test = spawn('npm', ['run', 'check-notion'], {
        stdio: 'inherit',
        shell: true
      });
      
      test.on('close', (code) => {
        if (code === 0) {
          console.log('\n🎉 配置完成！重启开发服务器以应用更改:');
          console.log('npm run dev');
        }
      });
    } else {
      console.log('\n📝 配置完成！接下来的步骤:');
      console.log('1. 确保在 Notion 数据库中邀请了你的集成');
      console.log('2. 在数据库中添加必要的字段');
      console.log('3. 运行 npm run check-notion 测试配置');
      console.log('4. 重启开发服务器: npm run dev');
      
      rl.close();
    }

  } catch (error) {
    console.error('❌ 配置过程中出现错误:', error.message);
    rl.close();
  }
}

// 运行配置向导
configWizard();
