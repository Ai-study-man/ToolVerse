const { getBlogPosts } = require('./src/lib/blogService');

async function checkBlogTools() {
  try {
    console.log('Checking all blog posts for related tools...\n');
    
    // 获取所有博客文章
    const posts = await getBlogPosts();
    
    // 收集所有引用的工具ID
    const allToolIds = new Set();
    const postToolMap = new Map();
    
    posts.forEach(post => {
      if (post.relatedTools && post.relatedTools.length > 0) {
        console.log(`📝 ${post.title}`);
        console.log(`   Tools: [${post.relatedTools.join(', ')}]`);
        
        postToolMap.set(post.slug, post.relatedTools);
        post.relatedTools.forEach(toolId => allToolIds.add(toolId));
        console.log('');
      }
    });
    
    console.log('\n=== All referenced tool IDs ===');
    const sortedToolIds = Array.from(allToolIds).sort();
    sortedToolIds.forEach((toolId, index) => {
      console.log(`${index + 1}. ${toolId}`);
    });
    
    console.log(`\nTotal unique tool IDs referenced: ${allToolIds.size}`);
    
    // 测试API获取这些工具
    console.log('\n=== Testing tool resolution ===');
    
    for (const toolId of sortedToolIds) {
      try {
        const response = await fetch(`http://localhost:3001/api/tools/${toolId}`);
        if (response.ok) {
          const tool = await response.json();
          console.log(`✅ ${toolId} -> "${tool.name}"`);
        } else {
          console.log(`❌ ${toolId} -> Not found (${response.status})`);
        }
      } catch (error) {
        console.log(`❌ ${toolId} -> Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBlogTools();
