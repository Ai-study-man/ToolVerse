// 直接在浏览器控制台运行来检查可用工具
fetch('/api/tools')
  .then(response => response.json())
  .then(tools => {
    console.log('Total tools:', tools.length);
    
    // 查找ChatGPT
    const chatgpt = tools.find(t => t.name.toLowerCase().includes('chatgpt'));
    console.log('ChatGPT:', chatgpt ? { id: chatgpt.id, name: chatgpt.name } : 'Not found');
    
    // 查找Canva
    const canva = tools.find(t => t.name.toLowerCase().includes('canva'));
    console.log('Canva:', canva ? { id: canva.id, name: canva.name } : 'Not found');
    
    // 查找Gemini
    const gemini = tools.find(t => t.name.toLowerCase().includes('gemini'));
    console.log('Gemini:', gemini ? { id: gemini.id, name: gemini.name } : 'Not found');
    
    // 查找DeepSeek
    const deepseek = tools.find(t => t.name.toLowerCase().includes('deepseek'));
    console.log('DeepSeek:', deepseek ? { id: deepseek.id, name: deepseek.name } : 'Not found');
    
    // 显示前20个工具的ID和名称
    console.log('\nFirst 20 tools:');
    tools.slice(0, 20).forEach(tool => {
      console.log(`- ${tool.name} (ID: ${tool.id})`);
    });
  })
  .catch(error => console.error('Error:', error));
