const { DataSyncService } = require('./src/lib/dataSyncService.ts');

async function checkAvailableTools() {
  try {
    const tools = await DataSyncService.getTools();
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
    
    // 显示所有包含"chat"或"gpt"的工具
    const aiTools = tools.filter(t => 
      t.name.toLowerCase().includes('chat') || 
      t.name.toLowerCase().includes('gpt') ||
      t.name.toLowerCase().includes('canva') ||
      t.name.toLowerCase().includes('gemini') ||
      t.name.toLowerCase().includes('deepseek')
    );
    
    console.log('\nRelevant AI tools:');
    aiTools.forEach(tool => {
      console.log(`- ${tool.name} (ID: ${tool.id})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAvailableTools();
