// 测试QuizGPT博客文章中的所有链接
const links = [
  '/tools/1', // ChatGPT工具页面
  '/tools?category=conversational-ai', // 对话AI工具分类
  '/blog/quizgpt-hidden-chatgpt-flashcard-mode-study-tools' // 博客文章本身
];

async function testBlogLinks() {
  console.log('Testing QuizGPT blog article links...\n');
  
  for (const link of links) {
    try {
      const url = `http://localhost:3001${link}`;
      const response = await fetch(url);
      
      if (response.ok) {
        console.log(`✅ ${link} -> ${response.status} ${response.statusText}`);
      } else {
        console.log(`❌ ${link} -> ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${link} -> Error: ${error.message}`);
    }
  }
  
  console.log('\n=== Link validation complete ===');
}

testBlogLinks();
