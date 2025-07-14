const fs = require('fs');
const path = require('path');

// 本地logo文件名映射
const LOCAL_LOGO_MAPPING = {
  // Conversational AI
  'ChatGPT': 'chatgpt',
  'Claude': 'claude',
  'Google Gemini': 'google-gemini',
  'Character.AI': 'character-ai',
  'Perplexity AI': 'perplexity-ai',
  'DeepSeek': 'deepseek',
  
  // Code Development
  'GitHub Copilot': 'github-copilot',
  'Tabnine': 'tabnine',
  'Replit AI': 'replit-ai',
  'Codeium': 'codeium',
  'CodeT5': 'codet5',
  'CodeT5+': 'codet5-plus',
  'CodeWhisperer': 'codewhisperer',
  'Amazon CodeWhisperer': 'amazon-codewhisperer',
  'Blackbox AI': 'blackbox-ai',
  'Aider': 'aider',
  'Codium AI': 'codium-ai',
  'Sourcegraph Cody': 'sourcegraph-cody',
  'Windsurf Editor': 'windsurf-editor',
  
  // Image Generation & Design
  'DALL-E 2': 'dall-e-2',
  'Midjourney': 'midjourney',
  'Stable Diffusion': 'stable-diffusion',
  'Leonardo AI': 'leonardo-ai',
  'Adobe Firefly': 'adobe-firefly',
  'Canva AI': 'canva-ai',
  'Figma AI': 'figma-ai',
  'DreamStudio': 'dreamstudio',
  'Flux AI': 'flux-ai',
  'Ideogram': 'ideogram',
  'Imagen 3': 'imagen-3',
  'Playground AI': 'playground-ai',
  'Looka': 'looka',
  
  // Business & Productivity
  'Notion AI': 'notion-ai',
  'Grammarly': 'grammarly',
  'Jasper AI': 'jasper-ai',
  'Copy.ai': 'copy-ai',
  'Calendly AI': 'calendly-ai',
  'Krisp': 'krisp',
  'Motion': 'motion',
  'Reclaim.ai': 'reclaim-ai',
  'Zapier AI': 'zapier-ai',
  'Otter.ai': 'otter-ai',
  
  // Video & Audio
  'Runway ML': 'runway-ml',
  'Synthesia': 'synthesia',
  'Murf AI': 'murf-ai',
  'ElevenLabs': 'elevenlabs',
  'Descript': 'descript',
  'Loom AI': 'loom-ai',
  'Pictory AI': 'pictory-ai',
  
  // Writing & Content
  'Writesonic': 'writesonic',
  'Rytr': 'rytr',
  'QuillBot': 'quillbot',
  'Wordtune': 'wordtune',
  'ContentBot': 'contentbot',
  
  // Language & Translation
  'DeepL': 'deepl',
  'Google Translate AI': 'google-translate-ai',
  'Linguee': 'linguee',
  
  // Business & Analytics
  'Tableau AI': 'tableau-ai',
  'H2O.ai': 'h2o-ai',
  'Crystal': 'crystal',
  'Dataiku': 'dataiku',
  'MonkeyLearn': 'monkeylearn',
  'Qlik Sense AI': 'qlik-sense-ai',
  'Sisense AI': 'sisense-ai',
  
  // Marketing & SEO
  'Alli AI': 'alli-ai',
  'BrightEdge': 'brightedge',
  'Clearscope': 'clearscope',
  'ContentKing': 'contentking',
  'Frase': 'frase',
  'MarketMuse': 'marketmuse',
  'Semrush AI': 'semrush-ai',
  'Surfer SEO': 'surfer-seo'
};

// 检查本地logo文件
function checkLocalLogos() {
  const logosDir = path.join(__dirname, '..', 'public', 'logos');
  const supportedExtensions = ['.png', '.svg', '.jpg', '.jpeg', '.webp'];
  
  console.log('📁 检查本地logo文件...\n');
  
  const foundLogos = [];
  const missingLogos = [];
  
  // 检查每个工具的logo
  Object.entries(LOCAL_LOGO_MAPPING).forEach(([toolName, fileName]) => {
    let logoFound = false;
    let logoPath = '';
    
    // 检查各种可能的文件扩展名
    for (const ext of supportedExtensions) {
      const filePath = path.join(logosDir, fileName + ext);
      if (fs.existsSync(filePath)) {
        logoFound = true;
        logoPath = `/logos/${fileName}${ext}`;
        foundLogos.push({ toolName, fileName, path: logoPath, fullPath: filePath });
        console.log(`✅ ${toolName}: ${logoPath}`);
        break;
      }
    }
    
    if (!logoFound) {
      missingLogos.push({ toolName, fileName, expectedPaths: supportedExtensions.map(ext => `/logos/${fileName}${ext}`) });
      console.log(`❌ ${toolName}: 文件不存在 (期望: ${fileName}.png/.svg/.jpg)`);
    }
  });
  
  console.log(`\n📊 检查结果:`);
  console.log(`✅ 找到: ${foundLogos.length} 个logo`);
  console.log(`❌ 缺失: ${missingLogos.length} 个logo`);
  
  return { foundLogos, missingLogos };
}

// 生成本地logo的映射代码
function generateLocalLogoMapping(foundLogos) {
  if (foundLogos.length === 0) {
    console.log('\n⚠️  没有找到本地logo文件');
    return;
  }
  
  console.log('\n🎨 生成本地logo映射代码:\n');
  console.log('// 本地logo映射');
  console.log('const LOCAL_LOGOS: Record<string, string> = {');
  foundLogos.forEach(logo => {
    console.log(`  '${logo.toolName}': '${logo.path}',`);
  });
  console.log('};');
  
  return foundLogos;
}

// 更新ToolLogo.tsx使用本地logo
function updateToolLogoComponent(foundLogos) {
  if (foundLogos.length === 0) {
    console.log('\n⚠️  没有可用的本地logo，跳过更新');
    return;
  }
  
  const toolLogoPath = path.join(__dirname, '..', 'src', 'components', 'ToolLogo.tsx');
  
  try {
    let content = fs.readFileSync(toolLogoPath, 'utf8');
    
    // 为每个找到的本地logo更新映射
    foundLogos.forEach(logo => {
      const regex = new RegExp(`'${logo.toolName}':\\s*'[^']*'`, 'g');
      const newEntry = `'${logo.toolName}': '${logo.path}'`;
      
      if (content.match(regex)) {
        content = content.replace(regex, newEntry);
        console.log(`✅ 已更新 ${logo.toolName} 使用本地logo: ${logo.path}`);
      }
    });
    
    fs.writeFileSync(toolLogoPath, content, 'utf8');
    console.log(`\n🎉 成功更新 ${foundLogos.length} 个本地logo映射！`);
    
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
  }
}

// 主函数
function manageLocalLogos() {
  console.log('🔍 本地Logo管理工具启动...\n');
  
  const { foundLogos, missingLogos } = checkLocalLogos();
  
  if (foundLogos.length > 0) {
    generateLocalLogoMapping(foundLogos);
    
    // 询问是否要立即更新ToolLogo.tsx
    console.log('\n❓ 是否要立即更新ToolLogo.tsx使用这些本地logo？');
    console.log('如果要更新，请运行: updateToolLogoComponent(foundLogos)');
    
    // 自动更新（您可以注释掉这行如果不想自动更新）
    updateToolLogoComponent(foundLogos);
  }
  
  if (missingLogos.length > 0) {
    console.log('\n📝 缺失的logo文件清单:');
    missingLogos.slice(0, 10).forEach((logo, index) => {
      console.log(`${index + 1}. ${logo.toolName} -> ${logo.fileName}.png/.svg/.jpg`);
    });
    
    if (missingLogos.length > 10) {
      console.log(`... 还有 ${missingLogos.length - 10} 个缺失的logo`);
    }
  }
  
  return { foundLogos, missingLogos };
}

// 导出函数
module.exports = { 
  checkLocalLogos, 
  generateLocalLogoMapping, 
  updateToolLogoComponent, 
  manageLocalLogos,
  LOCAL_LOGO_MAPPING 
};

// 如果直接运行此脚本
if (require.main === module) {
  manageLocalLogos();
}
