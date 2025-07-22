import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// 加载.env.local文件
dotenv.config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
});

// 标签翻译映射 - 从notionService.ts复制
const tagTranslations = {
  'AI助手': 'AI Assistant',
  'AI洞察': 'AI Insights',
  'AI特效': 'AI Effects',
  'AI编程': 'AI Programming',
  'SEO优化': 'SEO Optimization',
  'SEO分析': 'SEO Analysis',
  'SEO监控': 'SEO Monitoring',
  'SEO研究': 'SEO Research',
  '上下文翻译': 'Contextual Translation',
  '个性分析': 'Personality Analysis',
  '代码优化': 'Code Optimization',
  '代码安全': 'Code Security',
  '代码搜索': 'Code Search',
  '代码理解': 'Code Understanding',
  '代码生成': 'Code Generation',
  '代码补全': 'Code Completion',
  '企业SEO': 'Enterprise SEO',
  '企业级': 'Enterprise Grade',
  '例句搜索': 'Example Search',
  '免费工具': 'Free Tool',
  '免费翻译': 'Free Translation',
  '关键词分析': 'Keyword Analysis',
  '关键词研究': 'Keyword Research',
  '内容优化': 'Content Optimization',
  '内容分析': 'Content Analysis',
  '内容创作': 'Content Creation',
  '内容总结': 'Content Summarization',
  '内容策略': 'Content Strategy',
  '内容营销': 'Content Marketing',
  '内容规划': 'Content Planning',
  '内容转换': 'Content Conversion',
  '写作助手': 'Writing Assistant',
  '创意工具': 'Creative Tool',
  '协作开发': 'Collaborative Development',
  '即时翻译': 'Instant Translation',
  '商业智能': 'Business Intelligence',
  '图像处理': 'Image Processing',
  '图像翻译': 'Image Translation',
  '在线编程': 'Online Programming',
  '多语言': 'Multilingual',
  '多语言支持': 'Multi-language Support',
  '实时分析': 'Real-time Analysis',
  '实时建议': 'Real-time Suggestions',
  '客户关系': 'Customer Relations',
  '工作效率': 'Work Efficiency',
  '开发助手': 'Development Assistant',
  '开源': 'Open Source',
  '性能追踪': 'Performance Tracking',
  '情感分析': 'Sentiment Analysis',
  '技术SEO': 'Technical SEO',
  '技术优化': 'Technical Optimization',
  '排名提升': 'Ranking Improvement',
  '搜索意图': 'Search Intent',
  '数字营销': 'Digital Marketing',
  '数据准备': 'Data Preparation',
  '数据分析': 'Data Analysis',
  '数据可视化': 'Data Visualization',
  '数据挖掘': 'Data Mining',
  '数据科学': 'Data Science',
  '数据管道': 'Data Pipeline',
  '文本分析': 'Text Analysis',
  '文本编辑': 'Text Editing',
  '文本转视频': 'Text-to-Video',
  '文本转语音': 'Text-to-Speech',
  '智能搜索': 'Smart Search',
  '机器学习': 'Machine Learning',
  '模型部署': 'Model Deployment',
  '沟通优化': 'Communication Optimization',
  '研究工具': 'Research Tool',
  '竞争分析': 'Competitive Analysis',
  '网站优化': 'Website Optimization',
  '网站审计': 'Website Audit',
  '翻译': 'Translation',
  '翻译词典': 'Translation Dictionary',
  '自动化SEO': 'Automated SEO',
  '自动洞察': 'Automated Insights',
  '自动配音': 'Auto Voiceover',
  '营销视频': 'Marketing Video',
  '视频编辑': 'Video Editing',
  '语音克隆': 'Voice Cloning',
  '语音合成': 'Voice Synthesis',
  '语音生成': 'Voice Generation',
  '逼真人声': 'Realistic Voice',
  '销售助手': 'Sales Assistant',
  '问答优化': 'Q&A Optimization',
  '音频编辑': 'Audio Editing',
  '预测分析': 'Predictive Analytics',
  
  // 其他常用标签
  '聊天机器人': 'Chatbot',
  '对话AI': 'Conversational AI',
  '客服': 'Customer Service',
  '销售': 'Sales',
  '营销': 'Marketing',
  '写作': 'Writing',
  '代码': 'Coding',
  '开发': 'Development',
  '设计': 'Design',
  '图像生成': 'Image Generation',
  '配音': 'Voiceover',
  '专业': 'Professional',
  '免费': 'Free',
  '付费': 'Paid',
  '搜索引擎优化': 'SEO',
  '分析': 'Analytics',
  '研究': 'Research',
  '优化': 'Optimization',
  '线索生成': 'Lead Generation',
  '语音': 'Voice',
  '人工智能': 'AI',
  '深度学习': 'Deep Learning',
  '自然语言处理': 'NLP',
  '计算机视觉': 'Computer Vision',
  '自动化': 'Automation',
  '效率工具': 'Productivity',
  '协作': 'Collaboration',
  '团队': 'Team',
  '项目管理': 'Project Management',
  '时间管理': 'Time Management',
  '日程安排': 'Scheduling',
  '语言': 'Language',
  '文档': 'Documentation',
  '知识管理': 'Knowledge Management'
};

// 检测是否为中文字符
function isChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

// 翻译标签
function translateTags(tags) {
  return tags.map(tag => {
    // 如果标签包含中文字符且有翻译，则翻译
    if (isChinese(tag) && tagTranslations[tag]) {
      return tagTranslations[tag];
    }
    return tag;
  });
}

async function testTagTranslation() {
  try {
    console.log('🔍 获取Notion数据库中的工具...');
    
    const response = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DATABASE_ID,
    });

    let allTags = new Set();
    let chineseTags = new Set();
    let translatedCount = 0;
    let untranslatedChineseTags = new Set();

    console.log(`📊 找到 ${response.results.length} 个工具\n`);

    response.results.forEach((tool, index) => {
      // 只显示前3个工具的调试信息
      if (index < 3) {
        console.log(`第${index + 1}个工具的属性名称：`);
        console.log(Object.keys(tool.properties));
        
        const name = tool.properties.name?.title?.[0]?.plain_text || 
                     tool.properties.Name?.title?.[0]?.plain_text || 
                     tool.properties.工具名称?.title?.[0]?.plain_text || 'Unknown';
        console.log(`工具名称: ${name}`);
        
        const tags = tool.properties.tags?.multi_select?.map(tag => tag.name) || 
                     tool.properties.Tags?.multi_select?.map(tag => tag.name) ||
                     tool.properties.标签?.multi_select?.map(tag => tag.name) || [];
        console.log(`标签数量: ${tags.length}, 标签: ${JSON.stringify(tags)}`);
        console.log('---');
      }
      
      const name = tool.properties.name?.title?.[0]?.plain_text || 
                   tool.properties.Name?.title?.[0]?.plain_text || 
                   tool.properties.工具名称?.title?.[0]?.plain_text || 'Unknown';
      const tags = tool.properties.tags?.multi_select?.map(tag => tag.name) || 
                   tool.properties.Tags?.multi_select?.map(tag => tag.name) ||
                   tool.properties.标签?.multi_select?.map(tag => tag.name) || [];
      
      tags.forEach(tag => {
        allTags.add(tag);
        if (isChinese(tag)) {
          chineseTags.add(tag);
          if (!tagTranslations[tag]) {
            untranslatedChineseTags.add(tag);
          }
        }
      });
    });

    console.log('📈 标签翻译统计:');
    console.log(`总标签数: ${allTags.size}`);
    console.log(`中文标签数: ${chineseTags.size}`);
    console.log(`已有翻译的中文标签: ${chineseTags.size - untranslatedChineseTags.size}`);
    console.log(`未翻译的中文标签: ${untranslatedChineseTags.size}\n`);

    if (untranslatedChineseTags.size > 0) {
      console.log('❌ 未翻译的中文标签:');
      [...untranslatedChineseTags].forEach(tag => {
        console.log(`  - ${tag}`);
      });
      console.log('');
    }

    // 测试翻译功能
    console.log('🧪 测试标签翻译功能:');
    const testTags = ['AI助手', 'Chatbot', '代码生成', 'Development', '内容创作'];
    const translatedTags = translateTags(testTags);
    
    console.log('原始标签:', testTags);
    console.log('翻译后:', translatedTags);
    console.log('');

    // 检查翻译覆盖率
    const coveragePercentage = ((chineseTags.size - untranslatedChineseTags.size) / chineseTags.size * 100).toFixed(1);
    console.log(`✅ 翻译覆盖率: ${coveragePercentage}%`);

    if (untranslatedChineseTags.size === 0) {
      console.log('🎉 所有中文标签都已有翻译映射！');
    } else {
      console.log(`⚠️ 还有 ${untranslatedChineseTags.size} 个中文标签需要添加翻译`);
    }

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

testTagTranslation();
