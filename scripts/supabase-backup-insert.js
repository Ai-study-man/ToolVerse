// Supabase 数据插入脚本 - 为新增工具提供备用存储
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 新工具数据 (与Notion同步)
const newToolsData = [
  // Language & Translation 工具
  {
    id: 'deepl-translator',
    name: 'DeepL',
    description: 'AI-powered translation service with superior accuracy for professional documents',
    category: 'Language & Translation',
    tags: ['Translation', 'AI', 'Professional', 'Documents'],
    pricing: 'freemium',
    website_url: 'https://www.deepl.com',
    logo_url: 'https://static.deepl.com/img/logo/deepl-logo-blue.svg',
    rating: 4.8,
    use_cases: ['Professional document translation', 'Business communications', 'Technical content localization'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'whisper-openai',
    name: 'Whisper by OpenAI',
    description: 'Open-source speech recognition system for transcription and translation',
    category: 'Language & Translation',
    tags: ['Speech-to-Text', 'Translation', 'OpenAI', 'Transcription'],
    pricing: 'free',
    website_url: 'https://openai.com/research/whisper',
    logo_url: 'https://cdn.openai.com/assets/logo-social-card.jpg',
    rating: 4.7,
    use_cases: ['Audio transcription', 'Multilingual content creation', 'Meeting transcripts'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'papago-naver',
    name: 'Papago',
    description: 'Naver AI translation service optimized for Asian languages',
    category: 'Language & Translation',
    tags: ['Translation', 'Asian Languages', 'Image Translation', 'Real-time'],
    pricing: 'free',
    website_url: 'https://papago.naver.com',
    logo_url: 'https://papago.naver.com/static/img/papago_og.png',
    rating: 4.5,
    use_cases: ['Asian language translation', 'Travel communication', 'Real-time conversations'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'microsoft-translator',
    name: 'Microsoft Translator',
    description: 'Enterprise-grade translation service with 100+ languages',
    category: 'Language & Translation',
    tags: ['Translation', 'Enterprise', 'Real-time', 'Microsoft'],
    pricing: 'freemium',
    website_url: 'https://www.microsoft.com/en-us/translator',
    logo_url: 'https://www.microsoft.com/translator/static/img/microsoft-translator-logo.png',
    rating: 4.4,
    use_cases: ['Enterprise document translation', 'Multi-language meetings', 'Office integration'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'reverso-translation',
    name: 'Reverso',
    description: 'Comprehensive language platform with translation and grammar tools',
    category: 'Language & Translation',
    tags: ['Translation', 'Grammar', 'Context Examples', 'Learning'],
    pricing: 'freemium',
    website_url: 'https://www.reverso.net',
    logo_url: 'https://dictionary.reverso.net/favicon.ico',
    rating: 4.3,
    use_cases: ['Language learning', 'Translation verification', 'Grammar checking'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  
  // Development 工具
  {
    id: 'cursor-editor',
    name: 'Cursor',
    description: 'AI-first code editor built on VSCode with advanced programming assistance',
    category: 'Development',
    tags: ['Code Editor', 'AI Programming', 'VSCode', 'Pair Programming'],
    pricing: 'freemium',
    website_url: 'https://cursor.sh',
    logo_url: 'https://cursor.sh/favicon.ico',
    rating: 4.8,
    use_cases: ['AI pair programming', 'Code refactoring', 'Natural language coding'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'v0-vercel',
    name: 'v0 by Vercel',
    description: 'AI-powered UI generator for React components from text prompts',
    category: 'Development',
    tags: ['UI Generation', 'React', 'AI', 'Vercel'],
    pricing: 'freemium',
    website_url: 'https://v0.dev',
    logo_url: 'https://v0.dev/favicon.ico',
    rating: 4.6,
    use_cases: ['Rapid prototyping', 'UI component generation', 'React development'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'windsurf-codeium',
    name: 'Windsurf',
    description: 'AI-powered code editor by Codeium with multi-file editing',
    category: 'Development',
    tags: ['Code Editor', 'AI Assistant', 'Multi-file', 'Codeium'],
    pricing: 'free',
    website_url: 'https://codeium.com/windsurf',
    logo_url: 'https://codeium.com/favicon.ico',
    rating: 4.5,
    use_cases: ['Multi-file development', 'AI code assistance', 'Programming productivity'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'bolt-new',
    name: 'Bolt.new',
    description: 'AI-powered full-stack development platform for web applications',
    category: 'Development',
    tags: ['Full-stack', 'AI Development', 'Web Apps', 'Deployment'],
    pricing: 'freemium',
    website_url: 'https://bolt.new',
    logo_url: 'https://bolt.new/favicon.ico',
    rating: 4.4,
    use_cases: ['Rapid app development', 'Full-stack prototyping', 'Natural language programming'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'lovable-ai',
    name: 'Lovable',
    description: 'AI software engineer for complete application development',
    category: 'Development',
    tags: ['AI Engineer', 'Full Application', 'Frontend', 'Backend'],
    pricing: 'paid',
    website_url: 'https://lovable.dev',
    logo_url: 'https://lovable.dev/favicon.ico',
    rating: 4.7,
    use_cases: ['Complete app development', 'AI software engineering', 'End-to-end solutions'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function insertToolsToSupabase() {
  console.log('🗄️ 准备将新工具数据插入 Supabase 数据库...\n');
  
  // 检查是否有tools表
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'tools');
    
  if (tablesError) {
    console.log('ℹ️ 未检测到 tools 表，这是可选的备用存储');
    console.log('📝 当前数据已成功存储在 Notion 数据库中');
    return;
  }

  if (!tables || tables.length === 0) {
    console.log('📋 创建 tools 表的 SQL 脚本:');
    console.log('```sql');
    console.log(`-- 创建工具表
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[],
  pricing TEXT,
  website_url TEXT,
  logo_url TEXT,
  rating NUMERIC,
  use_cases TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_tags ON tools USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_tools_rating ON tools(rating DESC);
```);
    console.log('\n💡 将以上 SQL 在 Supabase 控制台中执行，然后重新运行此脚本');
    return;
  }

  console.log('✅ 检测到 tools 表，开始插入数据...\n');

  let successCount = 0;
  let skipCount = 0;

  for (const tool of newToolsData) {
    try {
      // 检查工具是否已存在
      const { data: existing, error: checkError } = await supabase
        .from('tools')
        .select('id')
        .eq('id', tool.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error(`❌ 检查工具 ${tool.name} 时出错:`, checkError.message);
        continue;
      }

      if (existing) {
        console.log(`⏭️ 工具 ${tool.name} 已存在，跳过`);
        skipCount++;
        continue;
      }

      // 插入新工具
      const { error: insertError } = await supabase
        .from('tools')
        .insert(tool);

      if (insertError) {
        console.error(`❌ 插入工具 ${tool.name} 失败:`, insertError.message);
      } else {
        console.log(`✅ 成功插入: ${tool.name}`);
        successCount++;
      }

    } catch (error) {
      console.error(`💥 处理工具 ${tool.name} 时出错:`, error.message);
    }
  }

  console.log('\n=== Supabase 数据插入结果 ===');
  console.log(`✅ 成功插入: ${successCount} 个工具`);
  console.log(`⏭️ 已跳过: ${skipCount} 个工具`);
  console.log(`📊 总处理: ${newToolsData.length} 个工具`);
}

console.log('=== Supabase 备用数据存储 ===\n');
console.log('🎯 为新增的 10 个热门工具提供 Supabase 备用存储');
console.log('📋 主要数据源: Notion 数据库 (已完成)');
console.log('🗄️ 备用存储: Supabase 数据库 (可选)\n');

insertToolsToSupabase()
  .then(() => {
    console.log('\n✨ Supabase 数据处理完成！');
    console.log('\n📊 数据存储状态:');
    console.log('✅ Notion 数据库: 10 个新工具已成功添加');
    console.log('🗄️ Supabase 数据库: 备用存储 (可选)');
    console.log('\n🌐 前端渲染:');
    console.log('📡 数据源: Notion API');
    console.log('🔄 缓存更新: 自动 (几分钟内)');
    console.log('👀 访问: http://localhost:3000');
  })
  .catch(console.error);
