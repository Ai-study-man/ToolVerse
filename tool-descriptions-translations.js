// 工具描述翻译脚本
const toolDescriptionTranslations = {
  // Development 类别工具
  'Replit AI': {
    shortDescription: 'AI programming assistant integrated within Replit',
    description: 'Replit AI is an AI programming assistant integrated within the Replit platform, providing code generation, explanation, and debugging capabilities. It helps developers write code more efficiently by offering intelligent code suggestions, explaining complex code logic, and assisting with debugging. Replit AI supports multiple programming languages and integrates seamlessly with the Replit development environment, making it an ideal tool for both beginners and experienced developers.'
  },
  'CodeT5': {
    shortDescription: 'Open-source code generation and comprehension model',
    description: 'CodeT5 is an open-source code generation and comprehension model that supports multiple programming tasks such as code generation, translation, and summarization. Built on the T5 (Text-to-Text Transfer Transformer) architecture, CodeT5 is specifically trained on code data and can understand and generate code in various programming languages. It excels at tasks like code translation between different programming languages, automatic code summarization, and code completion.'
  },
  'Blackbox AI': {
    shortDescription: 'AI programming assistant designed specifically for developers',
    description: 'Blackbox AI is an AI programming assistant designed specifically for developers, offering code search, generation, and optimization capabilities. It can help developers find relevant code snippets, generate code based on natural language descriptions, and optimize existing code for better performance. Blackbox AI supports multiple programming languages and integrates with popular development environments, making it a valuable tool for improving developer productivity.'
  },
  'Codeium': {
    shortDescription: 'Free AI programming assistant',
    description: 'Codeium is a free AI programming assistant that provides intelligent code completion, search, and chat functionality. It offers real-time code suggestions, helps developers find relevant code examples, and provides interactive chat support for programming questions. Codeium supports over 70 programming languages and integrates with popular IDEs and editors, making it accessible to developers of all skill levels.'
  },
  'Amazon CodeWhisperer': {
    shortDescription: 'AWS AI programming assistant',
    description: 'Amazon CodeWhisperer is an AI programming assistant launched by AWS, providing real-time code suggestions and security scanning functionality. It helps developers write secure, high-quality code by offering intelligent code completions based on comments and existing code. CodeWhisperer also includes built-in security scanning to identify potential security vulnerabilities and provides recommendations for improvement.'
  },

  // Business & Analytics 类别工具
  'Notion AI': {
    shortDescription: 'AI writing assistant integrated within Notion',
    description: 'Notion AI is integrated within Notion workspaces, providing intelligent writing, summarization, translation, and other features to help users improve work efficiency. It can automatically generate content, summarize long documents, translate text between languages, and assist with various writing tasks. Notion AI seamlessly integrates with Notion\'s existing productivity features, making it a powerful tool for knowledge management and collaboration.'
  },
  'Tableau AI': {
    shortDescription: 'AI-integrated data visualization platform',
    description: 'Tableau\'s integrated AI features help users automatically discover data insights, generate visualization charts, and explain data trends. The AI capabilities include automated insights generation, natural language query processing, and intelligent chart recommendations. Tableau AI makes data analysis more accessible to non-technical users while providing advanced analytics capabilities for data professionals.'
  },
  'MonkeyLearn': {
    shortDescription: 'AI text analysis and insights platform',
    description: 'MonkeyLearn is a text analysis platform that uses machine learning to analyze and extract insights from text data. It provides pre-built models for sentiment analysis, keyword extraction, intent detection, and other text classification tasks. MonkeyLearn also allows users to create custom models tailored to their specific needs, making it valuable for businesses looking to analyze customer feedback, social media content, and other text-based data.'
  },
  'Crystal': {
    shortDescription: 'AI personality analysis and communication assistant',
    description: 'Crystal uses AI to analyze personality traits, helping sales and marketing teams better understand and communicate with customers. It provides personality insights based on publicly available information and offers communication recommendations tailored to different personality types. Crystal helps improve sales conversions, customer relationships, and team communication by providing actionable insights into how to best interact with different individuals.'
  },
  'Dataiku': {
    shortDescription: 'Enterprise-level AI data science platform',
    description: 'Dataiku is an enterprise-level data science platform that integrates AI and machine learning capabilities to help organizations build data projects. It provides a collaborative environment for data scientists, analysts, and business users to work together on data projects from data preparation to model deployment. Dataiku offers automated machine learning, visual data preparation, and comprehensive model management capabilities.'
  },
  'Sisense AI': {
    shortDescription: 'AI-driven business intelligence platform',
    description: 'Sisense\'s AI capabilities provide automated insight discovery, intelligent data preparation, and predictive analytics capabilities. The platform uses AI to automatically identify patterns and anomalies in data, suggest relevant visualizations, and provide natural language explanations of data trends. Sisense AI makes business intelligence more accessible and actionable for organizations of all sizes.'
  },
  'H2O.ai': {
    shortDescription: 'Open-source machine learning and AI platform',
    description: 'H2O.ai provides open-source and enterprise-level machine learning platforms to help organizations build and deploy AI models. It offers automated machine learning (AutoML) capabilities, scalable machine learning algorithms, and comprehensive model interpretability tools. H2O.ai supports various use cases including fraud detection, risk management, customer analytics, and predictive maintenance.'
  },
  'Qlik Sense AI': {
    shortDescription: 'AI-enhanced data analytics platform',
    description: 'Qlik Sense\'s AI capabilities provide intelligent search, automated insight generation, and predictive analytics capabilities. The platform uses associative analytics combined with AI to help users explore data relationships, discover hidden patterns, and generate actionable insights. Qlik Sense AI enables self-service analytics while providing enterprise-grade governance and security.'
  },

  // Marketing & SEO 类别工具
  'Surfer SEO': {
    shortDescription: 'AI-driven SEO content optimization tool',
    description: 'Surfer SEO uses AI to analyze search results, provide content optimization suggestions, and keyword strategies to help improve website rankings. It analyzes top-performing pages for target keywords and provides data-driven recommendations for content optimization. Surfer SEO helps content creators and SEO professionals create content that ranks higher in search engine results.'
  },
  'MarketMuse': {
    shortDescription: 'AI content strategy and optimization platform',
    description: 'MarketMuse is an AI content strategy platform that helps marketing teams plan, optimize, and track content performance. It uses AI to analyze content gaps, suggest topic clusters, and provide comprehensive content briefs. MarketMuse helps content teams create more effective content strategies based on data-driven insights and competitive analysis.'
  },
  'Semrush AI': {
    shortDescription: 'AI-enhanced digital marketing toolkit',
    description: 'Semrush\'s integrated AI features provide intelligent keyword suggestions, content optimization, and competitor analysis. The AI capabilities help marketers discover new opportunities, optimize content for better search performance, and gain insights into competitor strategies. Semrush AI makes digital marketing more efficient and effective for businesses of all sizes.'
  },
  'Clearscope': {
    shortDescription: 'AI content optimization and SEO analysis tool',
    description: 'Clearscope uses AI to analyze search intent and provide optimization recommendations for content creators to improve content search performance. It analyzes top-ranking content for target keywords and provides detailed recommendations for improving content relevance and comprehensiveness. Clearscope helps content teams create content that better matches user intent and search engine expectations.'
  },
  'BrightEdge': {
    shortDescription: 'Enterprise-level AI SEO and content marketing platform',
    description: 'BrightEdge is an enterprise-level SEO platform that uses AI to provide content optimization, competitive analysis, and performance tracking. It offers comprehensive SEO insights, automated recommendations, and advanced reporting capabilities. BrightEdge helps large organizations manage complex SEO strategies and measure the impact of their content marketing efforts.'
  },
  'Frase': {
    shortDescription: 'AI content optimization and research tool',
    description: 'Frase is an AI content optimization tool that helps create high-quality content that aligns with search intent. It analyzes search results to provide content briefs, suggests relevant questions and topics, and offers optimization recommendations. Frase streamlines the content creation process by providing data-driven insights into what content performs best for specific keywords and topics.'
  },
  'Alli AI': {
    shortDescription: 'Automated SEO optimization platform',
    description: 'Alli AI is an automated SEO platform that uses artificial intelligence to automatically optimize website technical and content SEO. It provides automated optimization recommendations, bulk implementation capabilities, and comprehensive SEO monitoring. Alli AI helps businesses improve their search engine rankings without requiring extensive SEO expertise.'
  },
  'ContentKing': {
    shortDescription: 'Real-time SEO monitoring and optimization platform',
    description: 'ContentKing is a real-time SEO monitoring platform that uses AI to detect website changes and provide optimization recommendations. It continuously monitors websites for SEO issues, tracks changes that might impact search performance, and provides alerts for critical issues. ContentKing helps maintain optimal SEO performance by providing real-time insights and recommendations.'
  },

  // Video & Audio 类别工具
  'Runway ML': {
    shortDescription: 'Creative AI platform providing video and image processing tools',
    description: 'Runway ML is a creative AI platform that provides video editing, image processing, audio generation, and other AI tools designed specifically for creators. It offers cutting-edge AI capabilities including video generation, background removal, style transfer, and motion graphics. Runway ML makes advanced AI tools accessible to creative professionals, enabling new forms of digital creativity and content production.'
  },
  'Murf AI': {
    shortDescription: 'Professional AI voice generation platform',
    description: 'Murf AI is a professional AI voice generation platform that provides natural text-to-speech services, supporting multiple languages and voice styles. It offers high-quality voice synthesis with customizable parameters like pitch, speed, and emphasis. Murf AI is ideal for creating voiceovers for videos, podcasts, presentations, and other multimedia content.'
  },
  'Descript': {
    shortDescription: 'AI-powered audio and video editing tool',
    description: 'Descript is an AI-driven audio and video editing tool that provides text-based editing, voice cloning, and other innovative features. It allows users to edit audio and video content by editing the transcript, making content editing more intuitive and accessible. Descript also offers advanced features like voice cloning, noise removal, and automatic transcription.'
  },
  'Pictory AI': {
    shortDescription: 'Text-to-video AI tool',
    description: 'Pictory AI can automatically convert text content into videos, providing intelligent scene matching and automatic voiceover functionality. It transforms blog posts, articles, and scripts into engaging videos with relevant visuals, background music, and AI-generated voiceovers. Pictory AI is ideal for content creators, marketers, and educators who want to create video content efficiently.'
  },
  'ElevenLabs': {
    shortDescription: 'Advanced AI voice synthesis and cloning platform',
    description: 'ElevenLabs provides advanced AI voice synthesis technology that can generate extremely realistic human voices and support voice cloning. It offers state-of-the-art neural voice synthesis with emotional control, multilingual support, and custom voice creation capabilities. ElevenLabs is used by content creators, game developers, and media companies for producing high-quality voice content.'
  },

  // Language & Translation 类别工具
  'Google Translate AI': {
    shortDescription: 'AI translation service supporting 100+ languages',
    description: 'Google Translate uses advanced neural machine translation technology to support instant translation of over 100 languages. It provides text, document, website, and real-time conversation translation capabilities. Google Translate AI continuously improves its accuracy through machine learning and offers features like camera translation, handwriting recognition, and offline translation.'
  },
  'Linguee': {
    shortDescription: 'Contextual translation dictionary and search engine',
    description: 'Linguee combines dictionary and translation functionality to provide context-relevant translation suggestions and example sentences. It offers bilingual example sentences from reliable sources, helping users understand how words and phrases are used in different contexts. Linguee is particularly useful for professional translators, language learners, and anyone needing high-quality translation references.'
  }
};

module.exports = { toolDescriptionTranslations };
