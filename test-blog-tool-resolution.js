const { getMultipleTools } = require('./src/lib/toolUtils');

// 所有博客文章中引用的工具ID
const blogToolIds = [
  // fal-ai博客文章
  'fal-ai', 'midjourney', 'dall-e-3', 'stable-diffusion',
  // letsenhance博客文章  
  'lets-enhance', 'upscale-ai', 'waifu2x', 'real-esrgan',
  // imgcreator博客文章
  'imgcreator-ai', 'dalle-3',
  // 其他引用
  '1', '13', '14'
];

async function testBlogToolResolution() {
  console.log('Testing blog tool resolution...\n');
  
  try {
    const tools = await getMultipleTools(blogToolIds);
    
    let found = 0;
    let notFound = 0;
    
    tools.forEach((tool, index) => {
      const toolId = blogToolIds[index];
      if (tool) {
        console.log(`✅ ${toolId} -> "${tool.name}" (ID: ${tool.id})`);
        found++;
      } else {
        console.log(`❌ ${toolId} -> Not found`);
        notFound++;
      }
    });
    
    console.log(`\n=== Summary ===`);
    console.log(`Found: ${found}`);
    console.log(`Not Found: ${notFound}`);
    console.log(`Total: ${blogToolIds.length}`);
    
    if (notFound === 0) {
      console.log('\n🎉 All blog tools resolved successfully!');
    } else {
      console.log('\n⚠️ Some tools still missing.');
    }
    
  } catch (error) {
    console.error('Error testing tools:', error);
  }
}

testBlogToolResolution();
