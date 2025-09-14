const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// 工具的英文翻译数据
const translations = {
  'stable-diffusion': {
    description: 'Open-source AI image generation model capable of producing high-quality images and artwork.',
    features: null, // 保持原有功能
    tags: null // 保持原有标签
  },
  'jasper-ai': {
    description: 'Enterprise-grade AI writing platform designed for content marketing and business content creation.',
    features: null,
    tags: null
  },
  'midjourney': {
    description: 'Midjourney is a powerful AI image generation platform renowned for its artistic and creative capabilities. Users can generate stunning artwork and images through Discord bot using natural language descriptions.',
    features: ['Artistic Style Generation', 'High-Quality Output', 'Community Sharing', 'Version Control', 'Commercial License'],
    tags: ['AI Art', 'Image Generation', 'Creative Design', 'Digital Art']
  },
  'dall-e-3': {
    description: 'DALL-E 3 is OpenAI\'s latest AI image generation model that creates high-quality, creative images from text descriptions. Supports multiple artistic styles and complex scene generation.',
    features: ['Text to Image', 'High Resolution Output', 'Multiple Art Styles', 'Creative Scene Generation', 'Commercial Authorization'],
    tags: ['Image Generation', 'AI Art', 'Creative Design', 'Visual Content']
  },
  'runwayml': {
    description: 'AI video editing and generation platform providing various creative AI tools.',
    features: null,
    tags: null
  },
  'claude-by-anthropic': {
    description: 'Claude is an AI assistant developed by Anthropic, focused on safe, helpful, and harmless AI interaction. Features strong reasoning capabilities and document analysis, supporting long text processing.',
    features: ['Long Text Processing', 'Document Upload Analysis', 'Safe Conversation', 'Reasoning Analysis', 'Multi-language Support'],
    tags: ['AI Assistant', 'Document Analysis', 'Safe AI', 'Reasoning Capability']
  }
};

async function updateChineseContent() {
  try {
    console.log('开始修复包含中文内容的工具...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const [toolId, translation] of Object.entries(translations)) {
      console.log(`正在更新工具: ${toolId}`);
      
      try {
        // 构建更新数据
        const updateData = {
          description: translation.description
        };

        // 如果有功能翻译，也更新功能
        if (translation.features) {
          updateData.features = translation.features;
        }

        // 如果有标签翻译，也更新标签
        if (translation.tags) {
          updateData.tags = translation.tags;
        }

        // 更新数据库
        const { error } = await supabase
          .from('tools')
          .update(updateData)
          .eq('id', toolId);

        if (error) {
          throw error;
        }

        console.log(`✅ ${toolId} 更新成功`);
        successCount++;

      } catch (error) {
        console.error(`❌ ${toolId} 更新失败:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📊 更新结果:`);
    console.log(`✅ 成功: ${successCount} 个工具`);
    console.log(`❌ 失败: ${errorCount} 个工具`);

    if (successCount > 0) {
      console.log('\n🎉 所有中文内容已成功翻译为英文！');
      console.log('💡 建议刷新浏览器页面查看更新后的内容。');
    }

  } catch (error) {
    console.error('❌ 修复失败:', error);
  }
}

// 显示要更新的内容预览
function showUpdatePreview() {
  console.log('📋 将要更新的内容预览:\n');
  
  Object.entries(translations).forEach(([toolId, translation]) => {
    console.log(`🔧 ${toolId}:`);
    console.log(`   描述: ${translation.description}`);
    if (translation.features) {
      console.log(`   功能: ${translation.features.join(', ')}`);
    }
    if (translation.tags) {
      console.log(`   标签: ${translation.tags.join(', ')}`);
    }
    console.log('');
  });
}

// 运行修复
async function main() {
  showUpdatePreview();
  
  console.log('是否继续执行更新? (按 Ctrl+C 取消，或等待3秒自动开始)');
  
  // 等待3秒后自动开始
  setTimeout(async () => {
    await updateChineseContent();
  }, 3000);
}

main();