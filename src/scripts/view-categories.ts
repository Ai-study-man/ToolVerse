import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 缺少必要的环境变量');
  console.error('请确保 .env.local 文件中设置了:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

interface Tool {
  id: string;
  name: string;
  category: string;
  pricing: string;
  description?: string;
  website?: string;
}

async function viewCategories() {
  try {
    console.log('🔍 正在查看 Supabase 数据库中的分类情况...\n');
    
    // 1. 获取所有工具的分类
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, category, pricing')
      .order('category');
    
    if (error) {
      console.error('❌ 查询失败:', error);
      return;
    }
    
    if (!tools || tools.length === 0) {
      console.log('⚠️  数据库中没有工具数据');
      return;
    }
    
    console.log(`📊 总共找到 ${tools.length} 个工具\n`);
    
    // 2. 统计分类
    const categoryStats: Record<string, number> = {};
    const categoryExamples: Record<string, string[]> = {};
    
    tools.forEach((tool: Tool) => {
      const category = tool.category || 'Unknown';
      categoryStats[category] = (categoryStats[category] || 0) + 1;
      
      if (!categoryExamples[category]) {
        categoryExamples[category] = [];
      }
      if (categoryExamples[category].length < 3) {
        categoryExamples[category].push(tool.name);
      }
    });
    
    // 3. 按数量排序并显示
    const sortedCategories = Object.entries(categoryStats)
      .sort(([,a], [,b]) => (b as number) - (a as number));
    
    console.log('📂 当前分类统计:\n');
    sortedCategories.forEach(([category, count], index) => {
      console.log(`${index + 1}. 📂 ${category}: ${count} 个工具`);
      console.log(`   示例: ${categoryExamples[category].join(', ')}`);
      console.log('');
    });
    
    console.log(`\n📈 总分类数: ${sortedCategories.length}`);
    
    // 4. 显示一些建议的映射
    console.log('\n💡 建议的分类映射:\n');
    
    const suggestions: [string, string[]][] = [
      ['AI Writing', ['AI Writing', 'Copywriting', 'Content Generation', 'Writing Assistant']],
      ['AI Image Generation', ['Image Generation', 'Art', 'Design', 'Photo Enhancement']],
      ['AI Video', ['Video', 'Animation', 'Video Generation', 'Video Editing']],
      ['AI Chatbot', ['Chatbot', 'Conversational AI', 'Customer Service']],
      ['Productivity', ['Productivity', 'Notion', 'Task Management', 'Project Management']],
      ['Code Generation', ['Code', 'Programming', 'Development', 'Coding Assistant']],
      ['Data Analysis', ['Data', 'Analytics', 'Research', 'Business Intelligence']],
      ['AI Audio', ['Audio', 'Voice', 'Music', 'Speech', 'Podcast']],
      ['AI Translation', ['Translation', 'Language', 'Translate']],
      ['SEO & Marketing', ['SEO', 'Marketing', 'Social Media', 'Advertising']],
    ];
    
    suggestions.forEach(([targetCategory, sourcePatterns]) => {
      const matchingCategories = sortedCategories.filter(([category]) => 
        sourcePatterns.some(pattern => 
          category.toLowerCase().includes(pattern.toLowerCase()) ||
          pattern.toLowerCase().includes(category.toLowerCase())
        )
      );
      
      if (matchingCategories.length > 0) {
        console.log(`🎯 ${targetCategory}:`);
        matchingCategories.forEach(([category, count]) => {
          console.log(`   • ${category} (${count} 个工具)`);
        });
        console.log('');
      }
    });
    
  } catch (error) {
    console.error('❌ 发生错误:', error);
  }
}

// 运行脚本
viewCategories().catch(console.error);

export { viewCategories };