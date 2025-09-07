const { exec } = require('child_process');

// 创建一个简单的Node.js脚本来测试工具同步
const testScript = `
const { DataSyncService } = require('./src/lib/dataSyncService.ts');
const { getMultipleTools } = require('./src/lib/toolUtils.ts');

async function testToolsSync() {
  try {
    console.log('Testing tool synchronization...');
    
    // 测试获取具体的工具
    const testIds = ['fal-ai', 'dall-e-3', 'stable-diffusion', 'imgcreator-ai'];
    const tools = await getMultipleTools(testIds);
    
    console.log('Tool sync results:');
    tools.forEach((tool, index) => {
      if (tool) {
        console.log(\`✅ \${testIds[index]} -> \${tool.name} (logo: \${tool.logo})\`);
      } else {
        console.log(\`❌ \${testIds[index]} -> Not found\`);
      }
    });
    
    // 获取所有工具的统计
    const allTools = await DataSyncService.getTools();
    console.log(\`\nTotal tools loaded: \${allTools.length}\`);
    
    // 检查临时工具是否存在
    const tempToolNames = ['Fal.ai', 'DALL-E 3', 'Stable Diffusion', 'ImgCreator.ai'];
    tempToolNames.forEach(name => {
      const found = allTools.find(t => t.name === name);
      if (found) {
        console.log(\`✅ \${name} found in tools list\`);
      } else {
        console.log(\`❌ \${name} not found in tools list\`);
      }
    });
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testToolsSync();
`;

// 通过简单的API测试来验证
console.log('Testing tool API endpoints...');

exec('curl http://localhost:3001/api/tools', { timeout: 10000 }, (error, stdout, stderr) => {
  if (error) {
    console.error('API test failed:', error);
    return;
  }
  
  try {
    const data = JSON.parse(stdout);
    if (Array.isArray(data)) {
      console.log(`API returned ${data.length} tools`);
      
      // 检查我们添加的工具
      const targetTools = ['Fal.ai', 'DALL-E 3', 'Stable Diffusion', 'ImgCreator.ai'];
      targetTools.forEach(name => {
        const found = data.find(tool => tool.name === name);
        if (found) {
          console.log(`✅ ${name} found via API (ID: ${found.id})`);
        } else {
          console.log(`❌ ${name} not found via API`);
        }
      });
    } else {
      console.log('API response:', stdout.substring(0, 200) + '...');
    }
  } catch (parseError) {
    console.error('Failed to parse API response:', parseError);
    console.log('Raw response:', stdout.substring(0, 200));
  }
});
