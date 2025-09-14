const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少 Supabase 配置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 检查是否包含中文字符
function containsChinese(text) {
  if (!text) return false;
  return /[\u4e00-\u9fff]/.test(text);
}

async function checkChineseContent() {
  try {
    console.log('开始检查数据库中是否有中文内容的工具...\n');

    // 获取所有工具
    const { data: tools, error } = await supabase
      .from('tools')
      .select('*');

    if (error) {
      throw error;
    }

    const chineseTools = [];
    const allTools = tools || [];

    console.log(`总共检查 ${allTools.length} 个工具\n`);

    // 检查每个工具
    allTools.forEach(tool => {
      const issues = [];
      
      if (containsChinese(tool.name)) {
        issues.push(`名称包含中文: ${tool.name}`);
      }
      
      if (containsChinese(tool.description)) {
        issues.push(`描述包含中文: ${tool.description}`);
      }
      
      if (tool.features && Array.isArray(tool.features)) {
        tool.features.forEach((feature, index) => {
          if (containsChinese(feature)) {
            issues.push(`功能${index + 1}包含中文: ${feature}`);
          }
        });
      }
      
      if (tool.tags && Array.isArray(tool.tags)) {
        tool.tags.forEach((tag, index) => {
          if (containsChinese(tag)) {
            issues.push(`标签${index + 1}包含中文: ${tag}`);
          }
        });
      }

      if (issues.length > 0) {
        chineseTools.push({
          id: tool.id,
          name: tool.name,
          issues: issues
        });
      }
    });

    // 输出结果
    if (chineseTools.length === 0) {
      console.log('✅ 没有发现包含中文内容的工具');
    } else {
      console.log(`❌ 发现 ${chineseTools.length} 个包含中文内容的工具:\n`);
      
      chineseTools.forEach((tool, index) => {
        console.log(`${index + 1}. 工具 ID: ${tool.id}`);
        console.log(`   工具名称: ${tool.name}`);
        console.log(`   问题:`);
        tool.issues.forEach(issue => {
          console.log(`   - ${issue}`);
        });
        console.log('');
      });

      // 生成修复建议
      console.log('\n📝 修复建议:');
      console.log('1. 需要将中文描述翻译成英文');
      console.log('2. 需要将中文功能列表翻译成英文');
      console.log('3. 需要将中文标签翻译成英文');
      console.log('4. 保持工具名称的原有格式（如果原本就是中文产品名，可能需要添加英文描述）');
    }

  } catch (error) {
    console.error('❌ 检查失败:', error);
  }
}

checkChineseContent();