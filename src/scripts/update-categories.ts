import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
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
  pricing?: string;
  description?: string;
}

// 定义分类映射
const categoryMap: Record<string, string> = {
  // AI Writing 相关
  'Writing & Content': 'AI Writing',
  'Copywriting': 'AI Writing',
  'Content Generation  Seo': 'AI Writing',
  'Content Generation & SEO': 'AI Writing',
  'Creators Toolkit': 'AI Writing',
  
  // AI Image Generation 相关
  'Image Generation': 'AI Image Generation',
  'Art  Image Generator': 'AI Image Generation',
  'Art & Image Generator': 'AI Image Generation',
  'Design & Art': 'AI Image Generation',
  'Photo  Image Editing': 'AI Image Generation',
  'Photo & Image Editing': 'AI Image Generation',
  'Logo Generator': 'AI Image Generation',
  'Avatars': 'AI Image Generation',
  
  // AI Video 相关
  'Video': 'AI Video',
  'Video Generation': 'AI Video',
  'Animation  3D Modeling': 'AI Video',
  'Animation & 3D Modeling': 'AI Video',
  
  // AI Audio 相关
  'Text To Speech': 'AI Audio',
  'Music  Audio Generation': 'AI Audio',
  'Music & Audio Generation': 'AI Audio',
  
  // AI Chatbot 相关
  'Chat Bot': 'AI Chatbot',
  'Chatbot': 'AI Chatbot',
  'Conversational AI': 'AI Chatbot',
  'AI Assistants': 'AI Chatbot',
  'Customer Service': 'AI Chatbot',
  
  // Code Generation 相关
  'Code  Database Assistant': 'Code Generation',
  'Code & Database Assistant': 'Code Generation',
  'Code Generation': 'Code Generation',
  'Programming': 'Code Generation',
  'Development': 'Code Generation',
  
  // Productivity 相关
  'Meeting Assistant': 'Productivity',
  'Email Assistant': 'Productivity',
  'Organization  Automation': 'Productivity',
  'Organization & Automation': 'Productivity',
  'Slides  Presentations': 'Productivity',
  'Slides & Presentations': 'Productivity',
  'Task Management': 'Productivity',
  'Project Management': 'Productivity',
  
  // Research & Analysis 相关
  'Research Assistant': 'Research & Analysis',
  'AI Search': 'Research & Analysis',
  'Data': 'Research & Analysis',
  'Analytics': 'Research & Analysis',
  'Business Intelligence': 'Research & Analysis',
  
  // SEO & Marketing 相关
  'SEO': 'SEO & Marketing',
  'Marketing': 'SEO & Marketing',
  'Social Media': 'SEO & Marketing',
  'Advertising': 'SEO & Marketing',
  'Social Networks  Dating': 'SEO & Marketing',
  'Social Networks & Dating': 'SEO & Marketing',
  'Ecommerce': 'SEO & Marketing',
  
  // Education & Learning 相关
  'Education  Learning': 'Education & Learning',
  'Education & Learning': 'Education & Learning',
  
  // Legal 相关
  'Legal': 'Legal',
  
  // Healthcare 相关
  'Healthcare': 'Healthcare',
  
  // Entertainment 相关
  'Gaming': 'Entertainment',
  'Fun': 'Entertainment',
  'Fashion': 'Entertainment',
  'Gift Ideas': 'Entertainment',
  'Vacation  Trip Planner': 'Entertainment',
  'Vacation & Trip Planner': 'Entertainment',
  'Reviews  Recommendations': 'Entertainment',
  'Reviews & Recommendations': 'Entertainment',
  
  // Developer Tools 相关
  'Plugins  Extensions': 'Developer Tools',
  'Plugins & Extensions': 'Developer Tools',
  
  // 通用/其他
  'AI Tools': 'Other',
  'Text': 'Other',
  'Unknown': 'Other',
  'General': 'Other',
};

interface UpdateReport {
  timestamp: string;
  totalTools: number;
  categoriesUpdated: number;
  mappings: Array<{
    originalCategory: string;
    newCategory: string;
    toolCount: number;
    tools: string[];
  }>;
  unmappedCategories: Array<{
    category: string;
    toolCount: number;
    tools: string[];
  }>;
  summary: {
    beforeCategories: number;
    afterCategories: number;
    reductionPercentage: number;
  };
}

async function updateCategories(): Promise<void> {
  try {
    console.log('🚀 开始分类统一脚本...\n');
    
    // 1. 获取所有工具
    console.log('📊 正在从 Supabase 获取所有工具...');
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, name, category, pricing, description')
      .order('category');
    
    if (error) {
      console.error('❌ 获取工具失败:', error);
      return;
    }
    
    if (!tools || tools.length === 0) {
      console.log('⚠️  数据库中没有工具数据');
      return;
    }
    
    console.log(`✅ 成功获取 ${tools.length} 个工具\n`);
    
    // 2. 分析现有分类
    const originalCategories = new Set<string>();
    const categoryStats: Record<string, { count: number; tools: string[] }> = {};
    
    tools.forEach((tool: Tool) => {
      const category = tool.category || 'Unknown';
      originalCategories.add(category);
      
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, tools: [] };
      }
      categoryStats[category].count++;
      categoryStats[category].tools.push(tool.name);
    });
    
    console.log(`📂 原始分类数: ${originalCategories.size}`);
    
    // 3. 准备更新数据和报告
    const updateReport: UpdateReport = {
      timestamp: new Date().toISOString(),
      totalTools: tools.length,
      categoriesUpdated: 0,
      mappings: [],
      unmappedCategories: [],
      summary: {
        beforeCategories: originalCategories.size,
        afterCategories: 0,
        reductionPercentage: 0
      }
    };
    
    const updates: Array<{ id: string; newCategory: string }> = [];
    const newCategories = new Set<string>();
    
    // 4. 处理每个工具的分类映射
    tools.forEach((tool: Tool) => {
      const originalCategory = tool.category || 'Unknown';
      let newCategory = categoryMap[originalCategory];
      
      // 如果没有直接映射，尝试模糊匹配
      if (!newCategory) {
        for (const [pattern, target] of Object.entries(categoryMap)) {
          if (originalCategory.toLowerCase().includes(pattern.toLowerCase()) ||
              pattern.toLowerCase().includes(originalCategory.toLowerCase())) {
            newCategory = target;
            break;
          }
        }
      }
      
      // 如果仍然没有映射，归类为 Other
      if (!newCategory) {
        newCategory = 'Other';
      }
      
      newCategories.add(newCategory);
      
      // 如果分类有变化，添加到更新列表
      if (originalCategory !== newCategory) {
        updates.push({ id: tool.id, newCategory });
        updateReport.categoriesUpdated++;
        
        // 添加到映射报告
        let mapping = updateReport.mappings.find(m => 
          m.originalCategory === originalCategory && m.newCategory === newCategory
        );
        if (!mapping) {
          mapping = {
            originalCategory,
            newCategory,
            toolCount: 0,
            tools: []
          };
          updateReport.mappings.push(mapping);
        }
        mapping.toolCount++;
        mapping.tools.push(tool.name);
      }
    });
    
    // 5. 查找未映射的分类
    originalCategories.forEach(category => {
      if (!categoryMap[category]) {
        let found = false;
        for (const pattern of Object.keys(categoryMap)) {
          if (category.toLowerCase().includes(pattern.toLowerCase()) ||
              pattern.toLowerCase().includes(category.toLowerCase())) {
            found = true;
            break;
          }
        }
        if (!found) {
          updateReport.unmappedCategories.push({
            category,
            toolCount: categoryStats[category].count,
            tools: categoryStats[category].tools
          });
        }
      }
    });
    
    // 6. 完成报告统计
    updateReport.summary.afterCategories = newCategories.size;
    updateReport.summary.reductionPercentage = Math.round(
      ((originalCategories.size - newCategories.size) / originalCategories.size) * 100
    );
    
    console.log(`\n📈 分类统一分析:`);
    console.log(`   • 原始分类: ${originalCategories.size} 个`);
    console.log(`   • 新分类: ${newCategories.size} 个`);
    console.log(`   • 减少: ${originalCategories.size - newCategories.size} 个 (${updateReport.summary.reductionPercentage}%)`);
    console.log(`   • 需要更新的工具: ${updates.length} 个\n`);
    
    // 7. 显示映射预览
    if (updateReport.mappings.length > 0) {
      console.log('🔄 分类映射预览:');
      updateReport.mappings.forEach(mapping => {
        console.log(`   "${mapping.originalCategory}" → "${mapping.newCategory}" (${mapping.toolCount} 个工具)`);
      });
      console.log('');
    }
    
    if (updateReport.unmappedCategories.length > 0) {
      console.log('⚠️  未映射的分类 (将归为 Other):');
      updateReport.unmappedCategories.forEach(cat => {
        console.log(`   "${cat.category}" (${cat.toolCount} 个工具)`);
      });
      console.log('');
    }
    
    // 8. 确认更新
    if (updates.length === 0) {
      console.log('✅ 所有分类已经是标准格式，无需更新');
      return;
    }
    
    console.log(`⚡ 准备更新 ${updates.length} 个工具的分类...`);
    
    // 9. 批量更新数据库
    let successCount = 0;
    let errorCount = 0;
    
    for (const update of updates) {
      try {
        const { error: updateError } = await supabase
          .from('tools')
          .update({ category: update.newCategory })
          .eq('id', update.id);
        
        if (updateError) {
          console.error(`❌ 更新工具 ${update.id} 失败:`, updateError);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`❌ 更新工具 ${update.id} 出错:`, err);
        errorCount++;
      }
    }
    
    console.log(`\n📊 更新结果:`);
    console.log(`   ✅ 成功: ${successCount} 个`);
    console.log(`   ❌ 失败: ${errorCount} 个`);
    
    // 10. 生成报告文件
    const reportPath = './update_report.json';
    fs.writeFileSync(reportPath, JSON.stringify(updateReport, null, 2), 'utf-8');
    console.log(`\n📄 详细报告已保存到: ${reportPath}`);
    
    // 11. 显示最终分类统计
    console.log(`\n🎉 分类统一完成！`);
    console.log(`新的分类列表:`);
    Array.from(newCategories).sort().forEach((category, index) => {
      const count = tools.filter(tool => {
        const originalCategory = tool.category || 'Unknown';
        let mappedCategory = categoryMap[originalCategory] || 'Other';
        
        // 模糊匹配
        if (mappedCategory === 'Other' && originalCategory !== 'Unknown') {
          for (const [pattern, target] of Object.entries(categoryMap)) {
            if (originalCategory.toLowerCase().includes(pattern.toLowerCase()) ||
                pattern.toLowerCase().includes(originalCategory.toLowerCase())) {
              mappedCategory = target;
              break;
            }
          }
        }
        
        return mappedCategory === category;
      }).length;
      
      console.log(`   ${index + 1}. 📂 ${category}: ${count} 个工具`);
    });
    
  } catch (error) {
    console.error('❌ 脚本执行失败:', error);
  }
}

// 运行脚本
updateCategories().catch(console.error);

export { updateCategories };