// 常见AI工具的Logo URL映射
// 优先使用高质量的官方logo，如果不可用则会自动生成fallback

export const TOOL_LOGOS: Record<string, string> = {
  // Conversational AI
  'ChatGPT': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/64px-ChatGPT_logo.svg.png',
  'Claude': 'https://avatars.githubusercontent.com/u/127616789?s=64&v=4',
  'Bard': 'https://www.gstatic.com/lamda/images/favicon_v1_150160cddceafb39318a1d80a93e7f9c1.png',
  'Gemini': 'https://www.gstatic.com/lamda/images/favicon_v1_150160cddceafb39318a1d80a93e7f9c1.png',
  'Google Gemini': 'https://www.gstatic.com/lamda/images/favicon_v1_150160cddceafb39318a1d80a93e7f9c1.png',
  'Bing Chat': 'https://www.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico',
  'Character.AI': 'https://character.ai/favicon.ico',
  'Perplexity AI': 'https://www.perplexity.ai/favicon.ico',
  'Perplexity': 'https://www.perplexity.ai/favicon.ico',
  'You.com': 'https://you.com/favicon.ico',
  'DeepSeek': 'https://www.deepseek.com/favicon.ico',
  
  // Image Generation
  'DALL-E': 'https://openai.com/favicon.ico',
  'DALL-E 2': 'https://openai.com/favicon.ico',
  'DALL-E 3': 'https://openai.com/favicon.ico',
  'Midjourney': 'https://www.midjourney.com/favicon.ico',
  'Stable Diffusion': 'https://avatars.githubusercontent.com/u/100950301?s=64&v=4',
  'Leonardo AI': 'https://leonardo.ai/favicon-32x32.png',
  'Adobe Firefly': 'https://www.adobe.com/favicon.ico',
  'Canva AI': 'https://static.canva.com/web/images/favicon.ico',
  'Canva': 'https://static.canva.com/web/images/favicon.ico',
  'Figma': 'https://static.figma.com/app/icon/1/favicon.ico',
  'Figma AI': 'https://static.figma.com/app/icon/1/favicon.ico',
  'Framer AI': 'https://framer.com/favicon.ico',
  'Framer': 'https://framer.com/favicon.ico',
  'DreamStudio': 'https://beta.dreamstudio.ai/favicon.ico',
  'Flux AI': 'https://replicate.com/favicon.ico',
  'Ideogram': 'https://ideogram.ai/favicon.ico',
  'Imagen 3': 'https://deepmind.google/favicon.ico',
  'Playground AI': 'https://playgroundai.com/favicon.ico',
  'Looka': 'https://looka.com/favicon.ico',
  
  // Code Development  
  'GitHub Copilot': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
  'Tabnine': 'https://www.tabnine.com/wp-content/uploads/2021/06/tabnine-logo-1.png',
  'Cursor': 'https://cursor.sh/favicon.ico',
  'Replit': 'https://replit.com/public/images/logo-small.png',
  'Replit AI': 'https://replit.com/public/images/logo-small.png',
  'Codeium': 'https://codeium.com/favicon.ico',
  'CodeT5': 'https://huggingface.co/favicon.ico',
  'CodeT5+': 'https://github.com/favicon.ico',
  'CodeWhisperer': 'https://aws.amazon.com/favicon.ico',
  'Amazon CodeWhisperer': 'https://aws.amazon.com/favicon.ico',
  'Blackbox AI': 'https://www.blackbox.ai/favicon.ico',
  'Aider': 'https://aider.chat/assets/favicon.ico',
  'Codium AI': 'https://www.codium.ai/favicon.ico',
  'Sourcegraph Cody': 'https://sourcegraph.com/favicon.ico',
  'Windsurf Editor': 'https://codeium.com/favicon.ico',
  'Windsurf': 'https://codeium.com/favicon.ico',
  'AI Commits': 'https://github.com/favicon.ico',
  'CodeGPT': 'https://codegpt.co/favicon.ico',
  'MutableAI': 'https://mutable.ai/favicon.ico',
  'Continue': 'https://continue.dev/favicon.ico',
  'Whispere': 'https://whisper.ai/favicon.ico',
  
  // Productivity
  'Notion AI': 'https://www.notion.so/images/favicon.ico',
  'Notion': 'https://www.notion.so/images/favicon.ico',
  'Grammarly': 'https://static.grammarly.com/assets/files/9a76bb9ca8177f40a17ce29c22b0e411/grammarly_icon_64x64.png',
  'Jasper': 'https://www.jasper.ai/favicon-32x32.png',
  'Jasper AI': 'https://www.jasper.ai/favicon-32x32.png',
  'Copy.ai': 'https://copy.ai/favicon-32x32.png',
  'Linear': 'https://linear.app/favicon.ico',
  'Airtable': 'https://airtable.com/favicon.ico',
  'Monday.com': 'https://monday.com/favicon.ico',
  'Asana': 'https://asana.com/favicon.ico',
  'Trello': 'https://trello.com/favicon.ico',
  'Slack': 'https://slack.com/favicon.ico',
  'Discord': 'https://discord.com/assets/2c21aeda16de354ba5334551a883b481.png',
  'Calendly AI': 'https://calendly.com/favicon.ico',
  'Calendly': 'https://calendly.com/favicon.ico',
  'Krisp': 'https://krisp.ai/favicon.ico',
  'Motion': 'https://usemotion.com/favicon.ico',
  'Reclaim.ai': 'https://reclaim.ai/favicon.ico',
  'Zapier AI': 'https://zapier.com/favicon.ico',
  'Otter.ai': 'https://otter.ai/favicon.ico',
  'Mem': 'https://mem.ai/favicon.ico',
  'Superhuman': 'https://superhuman.com/favicon.ico',
  'Clockify': 'https://clockify.me/favicon.ico',
  'Toggl Track': 'https://toggl.com/favicon.ico',
  'Sunsama': 'https://sunsama.com/favicon.ico',
  
  // Video & Audio
  'Runway ML': 'https://runwayml.com/favicon.ico',
  'Runway': 'https://runwayml.com/favicon.ico',
  'Synthesia': 'https://www.synthesia.io/favicon.ico',
  'Murf': 'https://murf.ai/favicon-32x32.png',
  'Murf AI': 'https://murf.ai/favicon.ico',
  'ElevenLabs': 'https://elevenlabs.io/favicon.ico',
  'Descript': 'https://www.descript.com/favicon.ico',
  'Riverside': 'https://riverside.fm/favicon.ico',
  'Loom': 'https://www.loom.com/favicon.ico',
  'Loom AI': 'https://www.loom.com/favicon.ico',
  'Pictory AI': 'https://pictory.ai/favicon.ico',
  'Pictory': 'https://pictory.ai/favicon.ico',
  'InVideo': 'https://invideo.io/favicon.ico',
  'Synthys': 'https://synthys.io/favicon.ico',
  'HeyGen': 'https://heygen.com/favicon.ico',
  'D-ID': 'https://d-id.com/favicon.ico',
  'Wondershare Filmora': 'https://filmora.wondershare.com/favicon.ico',
  
  // Language & Translation
  'DeepL': 'https://static.deepl.com/img/favicon/favicon_96.png',
  'Google Translate': 'https://ssl.gstatic.com/translate/favicon.ico',
  'Google Translate AI': 'https://ssl.gstatic.com/translate/favicon.ico',
  'Linguee': 'https://www.linguee.com/favicon.ico',
  'Microsoft Translator': 'https://www.microsoft.com/favicon.ico',
  'Reverso': 'https://reverso.net/favicon.ico',
  'DeepL Write': 'https://static.deepl.com/img/favicon/favicon_96.png',
  
  // Writing & Content
  'Writesonic': 'https://writesonic.com/favicon.ico',
  'Rytr': 'https://rytr.me/favicon.ico',
  'QuillBot': 'https://quillbot.com/favicon.ico',
  'Hemingway Editor': 'https://hemingwayapp.com/favicon.ico',
  'ProWritingAid': 'https://prowritingaid.com/favicon.ico',
  'WordTune': 'https://www.wordtune.com/favicon.ico',
  'Wordtune': 'https://www.wordtune.com/favicon.ico',
  'Simplified': 'https://simplified.com/favicon.ico',
  'Copysmith': 'https://copysmith.ai/favicon.ico',
  'ContentBot': 'https://contentbot.ai/favicon.ico',
  'Copy AI': 'https://copy.ai/favicon-32x32.png',
  'Peppertype': 'https://peppertype.ai/favicon.ico',
  'ShortlyAI': 'https://shortlyai.com/favicon.ico',
  'Anyword': 'https://anyword.com/favicon.ico',
  'Nichesss': 'https://nichesss.com/favicon.ico',
  
  // Data & Analytics / Business
  'Tableau': 'https://www.tableau.com/favicon.ico',
  'Tableau AI': 'https://www.tableau.com/favicon.ico',
  'Power BI': 'https://powerbi.microsoft.com/favicon.ico',
  'DataRobot': 'https://www.datarobot.com/favicon.ico',
  'H2O.ai': 'https://h2o.ai/favicon.ico',
  'Databricks': 'https://databricks.com/favicon.ico',
  'Crystal': 'https://www.crystalknows.com/favicon.ico',
  'Dataiku': 'https://www.dataiku.com/favicon.ico',
  'MonkeyLearn': 'https://monkeylearn.com/favicon.ico',
  'Qlik Sense AI': 'https://www.qlik.com/favicon.ico',
  'Sisense AI': 'https://www.sisense.com/favicon.ico',
  'Looker': 'https://looker.com/favicon.ico',
  'Chartio': 'https://chartio.com/favicon.ico',
  'ThoughtSpot': 'https://thoughtspot.com/favicon.ico',
  'Palantir': 'https://palantir.com/favicon.ico',
  'Alteryx': 'https://alteryx.com/favicon.ico',
  'SAS': 'https://sas.com/favicon.ico',
  'SPSS': 'https://ibm.com/favicon.ico',
  
  // Marketing & SEO
  'Alli AI': 'https://www.alliai.com/favicon.ico',
  'BrightEdge': 'https://www.brightedge.com/favicon.ico',
  'Clearscope': 'https://www.clearscope.io/favicon.ico',
  'ContentKing': 'https://www.contentkingapp.com/favicon.ico',
  'Frase': 'https://www.frase.io/favicon.ico',
  'MarketMuse': 'https://www.marketmuse.com/favicon.ico',
  'Semrush AI': 'https://www.semrush.com/favicon.ico',
  'Semrush': 'https://www.semrush.com/favicon.ico',
  'Surfer SEO': 'https://surferseo.com/favicon.ico',
  'Yoast SEO': 'https://yoast.com/favicon.ico',
  'Screaming Frog': 'https://screamingfrog.co.uk/favicon.ico',
  'Ahrefs': 'https://ahrefs.com/favicon.ico',
  'Moz': 'https://moz.com/favicon.ico',
  'SpyFu': 'https://spyfu.com/favicon.ico',
  'SE Ranking': 'https://seranking.com/favicon.ico',
  'Rank Math': 'https://rankmath.com/favicon.ico',
  
  // Customer Service
  'Intercom': 'https://www.intercom.com/favicon.ico',
  'Zendesk': 'https://www.zendesk.com/favicon.ico',
  'Freshworks': 'https://www.freshworks.com/favicon.ico',
  'HubSpot': 'https://www.hubspot.com/favicon.ico',
  'Salesforce': 'https://www.salesforce.com/favicon.ico',
  'LiveChat': 'https://livechat.com/favicon.ico',
  'Drift': 'https://drift.com/favicon.ico',
  'Crisp': 'https://crisp.chat/favicon.ico',
  'Chaport': 'https://chaport.com/favicon.ico',
  'Olark': 'https://olark.com/favicon.ico',
  
  // Automation
  'Zapier': 'https://zapier.com/favicon.ico',
  'IFTTT': 'https://ifttt.com/favicon.ico',
  'Make': 'https://www.make.com/favicon.ico',
  'Automate.io': 'https://automate.io/favicon.ico',
  'Microsoft Power Automate': 'https://powerautomate.microsoft.com/favicon.ico',
  'Integromat': 'https://www.make.com/favicon.ico',
  'n8n': 'https://n8n.io/favicon.ico',
  'Workato': 'https://workato.com/favicon.ico',
  'Nintex': 'https://nintex.com/favicon.ico',
  
  // Social Media
  'Buffer': 'https://buffer.com/favicon.ico',
  'Hootsuite': 'https://hootsuite.com/favicon.ico',
  'Later': 'https://later.com/favicon.ico',
  'Sprout Social': 'https://sproutsocial.com/favicon.ico',
  'SocialBee': 'https://socialbee.io/favicon.ico',
  'CoSchedule': 'https://coschedule.com/favicon.ico',
  'Socialbakers': 'https://socialbakers.com/favicon.ico',
  'Brandwatch': 'https://brandwatch.com/favicon.ico',
  'Mention': 'https://mention.com/favicon.ico',
};

// 品牌颜色映射，用于生成默认logo
const BRAND_COLORS: Record<string, string> = {
  'ChatGPT': '#74aa9c',
  'Claude': '#d97706',
  'Google': '#4285f4',
  'Microsoft': '#00bcf2',
  'OpenAI': '#412991',
  'Meta': '#1877f2',
  'Adobe': '#ff0000',
  'GitHub': '#24292e',
  'Notion': '#000000',
  'Linear': '#5e6ad2',
  'Figma': '#f24e1e',
  'Canva': '#00c4cc',
  'Slack': '#4a154b',
  'Discord': '#5865f2',
  'Zoom': '#2d8cff',
  'default': '#2563eb'
};

// 生成默认Logo的函数
export const generateDefaultLogo = (toolName: string): string => {
  const firstLetter = toolName.charAt(0).toUpperCase();
  
  // 尝试根据工具名称匹配品牌颜色
  let color = BRAND_COLORS.default;
  for (const [brand, brandColor] of Object.entries(BRAND_COLORS)) {
    if (toolName.toLowerCase().includes(brand.toLowerCase())) {
      color = brandColor;
      break;
    }
  }
  
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cdefs%3E%3ClinearGradient id='gradient' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='${color}'/%3E%3Cstop offset='100%25' stop-color='%23${color.slice(1)}cc'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='64' height='64' rx='12' fill='url(%23gradient)'/%3E%3Ctext x='32' y='42' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='28' font-weight='bold' fill='white'%3E${firstLetter}%3C/text%3E%3C/svg%3E`;
};

// 获取工具Logo的函数
export const getToolLogo = (toolName: string, originalLogo?: string): string => {
  // 如果有原始logo且不是我们的默认生成的，就使用原始logo
  if (originalLogo && !originalLogo.includes('data:image/svg+xml')) {
    return originalLogo;
  }
  
  // 尝试从映射中获取logo
  const mappedLogo = TOOL_LOGOS[toolName];
  if (mappedLogo) {
    return mappedLogo;
  }
  
  // 如果都没有，返回生成的默认logo
  return generateDefaultLogo(toolName);
};
