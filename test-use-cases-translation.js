// 测试Use Cases翻译功能
const http = require('http');

// 创建一个测试脚本来验证API返回的数据
function testUseCasesTranslation() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/tools',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const tools = JSON.parse(data);
        console.log('=== Use Cases Translation Test ===');
        
        // 检查前5个工具的Use Cases
        tools.slice(0, 5).forEach((tool, index) => {
          console.log(`\n${index + 1}. Tool: ${tool.name}`);
          console.log('Use Cases:', tool.useCases);
          
          // 检查是否还有中文字符
          const hasChineseText = tool.useCases.some(useCase => 
            /[\u4e00-\u9fff]/.test(useCase)
          );
          
          if (hasChineseText) {
            console.log('❌ Still contains Chinese text!');
          } else {
            console.log('✅ All English');
          }
        });
        
        // 专门检查之前出现问题的术语
        const problemTerms = ['技术SEO', '大规模优化', '自动化营销'];
        console.log('\n=== Checking Problem Terms ===');
        
        let foundProblems = false;
        tools.forEach(tool => {
          tool.useCases.forEach(useCase => {
            problemTerms.forEach(term => {
              if (useCase.includes(term)) {
                console.log(`❌ Found "${term}" in tool: ${tool.name}`);
                foundProblems = true;
              }
            });
          });
        });
        
        if (!foundProblems) {
          console.log('✅ No problem terms found!');
        }
        
        console.log('\n=== Test Complete ===');
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request error:', error);
  });

  req.end();
}

// 等待服务器启动然后运行测试
setTimeout(() => {
  testUseCasesTranslation();
}, 5000);
