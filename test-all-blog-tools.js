// 测试所有博客文章中引用的工具是否能被正确找到
const toolIds = [
  'fal-ai', 'midjourney', 'dall-e-3', 'stable-diffusion',
  'lets-enhance', 'upscale-ai', 'waifu2x', 'real-esrgan',
  'imgcreator-ai', 'dalle-3',
  '1', '13', '14'
];

async function testAllBlogTools() {
  console.log('Testing all blog-referenced tools...\n');
  
  let found = 0;
  let notFound = 0;
  
  for (const toolId of toolIds) {
    try {
      const response = await fetch(`http://localhost:3001/api/tools/${toolId}`);
      if (response.ok) {
        const tool = await response.json();
        console.log(`✅ ${toolId} -> "${tool.name}"`);
        found++;
      } else {
        console.log(`❌ ${toolId} -> Not found (${response.status})`);
        notFound++;
      }
    } catch (error) {
      console.log(`❌ ${toolId} -> Error: ${error.message}`);
      notFound++;
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Found: ${found}`);
  console.log(`Not Found: ${notFound}`);
  console.log(`Total: ${toolIds.length}`);
  
  if (notFound === 0) {
    console.log('\n🎉 All tools can be found successfully!');
  } else {
    console.log('\n⚠️ Some tools are still missing.');
  }
}

testAllBlogTools();
