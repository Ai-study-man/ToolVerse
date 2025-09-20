'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import GlobalLayout from '../../components/GlobalLayout';
import StructuredData from '../../components/StructuredData';
import { ContentBanner } from '../../components/AdBanner';

export default function ChatGPTAlternativesPage() {
  // 按优先级获取 Logo 路径的函数
  const getLogoSrc = (tool: any): string => {
    // 1. 优先使用 Supabase 或其他远程 URL
    if (tool.supabaseLogoUrl && tool.supabaseLogoUrl.startsWith('http')) {
      return tool.supabaseLogoUrl;
    }
    
    // 2. 使用本地 Logo 文件
    if (tool.localLogo) {
      return `/logos/${tool.localLogo}`;
    }
    
    // 3. 尝试 Clearbit API（如果有 domain）
    if (tool.domain) {
      return `https://logo.clearbit.com/${tool.domain}`;
    }
    
    // 4. 兜底使用默认图片
    return '/logos/default.png';
  };

  // 优化的 Logo 组件
  const ToolLogo = ({ tool, size = 64 }: { tool: any, size?: number }) => {
    const [currentSrc, setCurrentSrc] = useState<string>(() => getLogoSrc(tool));
    const [hasError, setHasError] = useState(false);

    // 错误处理：回退到默认图片
    const handleError = () => {
      if (!hasError && currentSrc !== '/logos/default.png') {
        setHasError(true);
        setCurrentSrc('/logos/default.png');
      }
    };

    // 重置错误状态（当工具变化时）
    useEffect(() => {
      setCurrentSrc(getLogoSrc(tool));
      setHasError(false);
    }, [tool]);

    return (
      <div className={`w-${size === 64 ? '16' : '12'} h-${size === 64 ? '16' : '12'} bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm`}>
        <Image
          src={currentSrc}
          alt={tool.name || 'Tool logo'}
          width={size}
          height={size}
          className="object-contain"
          onError={handleError}
          unoptimized={currentSrc.startsWith('https://logo.clearbit.com/')}
        />
      </div>
    );
  };
  // FAQ数据用于结构化数据
  const faqData = [
    {
      question: "What are the best ChatGPT alternatives in 2025?",
      answer: "The best ChatGPT alternatives include Claude (Anthropic), Google Gemini, Microsoft Copilot, Perplexity AI, Character.AI, and open-source options like Llama models. Each offers unique strengths in different areas such as reasoning, creativity, or specialized knowledge."
    },
    {
      question: "Are there free alternatives to ChatGPT?",
      answer: "Yes, several free alternatives exist including Google Gemini, Microsoft Copilot (with limitations), Claude (free tier), Perplexity AI (free tier), and various open-source models you can run locally like Llama, Mistral, and others."
    },
    {
      question: "Which ChatGPT alternative is best for coding?",
      answer: "For coding, top alternatives include GitHub Copilot, Claude (excellent at code explanation), Google Gemini (good for multiple languages), and specialized tools like Codeium, Cursor, and CodeWhisperer. Each has different strengths in code generation, debugging, and explanation."
    },
    {
      question: "How do ChatGPT alternatives compare in terms of accuracy?",
      answer: "Accuracy varies by task and model version. Claude excels in reasoning and safety, Gemini performs well in factual questions, while GPT-4 leads in creative tasks. For the most current information, always verify important facts and use multiple sources."
    },
    {
      question: "Can I use ChatGPT alternatives for commercial purposes?",
      answer: "Most ChatGPT alternatives allow commercial use, but terms vary. Google Gemini, Claude, and Microsoft Copilot generally permit commercial use. Always check the specific terms of service for your use case, especially for business-critical applications."
    },
    {
      question: "How much do ChatGPT alternatives cost?",
      answer: "Pricing varies widely. Most offer free tiers with limitations. Paid plans typically range from $10-20/month for individual users. Enterprise plans with custom pricing are available for businesses. Open-source options are free but may require technical setup and hardware costs."
    },
    {
      question: "Which alternative has the best privacy protection?",
      answer: "For maximum privacy, locally hosted open-source models like Llama offer complete data control. Among cloud services, Claude and Google Gemini have strong privacy policies. Always review data retention and usage policies before sharing sensitive information."
    },
    {
      question: "Can I migrate my ChatGPT conversations to other platforms?",
      answer: "Most platforms don't directly support importing ChatGPT conversations. You can manually export important conversations from ChatGPT and reference them in new platforms. Some third-party tools may help with migration, but check their security and terms of use."
    },
    {
      question: "Which alternative works best for research and fact-checking?",
      answer: "Perplexity AI excels at research with real-time web search and source citations. Google Gemini also provides current information access. For academic research, consider Claude for its analytical capabilities and always verify information from multiple sources."
    },
    {
      question: "Are there mobile apps for ChatGPT alternatives?",
      answer: "Yes, most major alternatives offer mobile apps: Claude (iOS/Android), Google Gemini (integrated in Google app), Microsoft Copilot (iOS/Android), and Perplexity AI (iOS/Android). Features may vary between web and mobile versions."
    },
    {
      question: "How do I choose the right ChatGPT alternative for my needs?",
      answer: "Consider your primary use case: coding (GitHub Copilot, Claude), research (Perplexity AI), creative writing (Character.AI, Claude), business productivity (Microsoft Copilot), or privacy (local Llama models). Try free tiers of multiple platforms to find the best fit."
    },
    {
      question: "What are the limitations of free ChatGPT alternatives?",
      answer: "Free tiers typically have usage limits (messages per day/month), reduced response quality, slower processing, limited features, or no access to latest models. Paid plans remove most limitations and provide priority access during high-demand periods."
    }
  ];

  // 用于价格对比表的简化工具数据
  const pricingComparisonTools = [
    { 
      id: 'claude', 
      name: 'Claude', 
      logo: '/logos/claude.png',
      localLogo: 'claude.svg',
      domain: 'claude.ai',
      supabaseLogoUrl: 'https://vovuwlzfrvjqeqptbxhf.supabase.co/storage/v1/object/public/logos/claude.png'
    },
    { 
      id: 'gemini', 
      name: 'Google Gemini', 
      logo: '/logos/gemini.png',
      localLogo: 'google-gemini.png',
      domain: 'gemini.google.com'
    },
    { 
      id: 'copilot', 
      name: 'Microsoft Copilot', 
      logo: '/logos/copilot.png',
      localLogo: 'microsoft-copilot.png',
      domain: 'copilot.microsoft.com',
      supabaseLogoUrl: 'https://vovuwlzfrvjqeqptbxhf.supabase.co/storage/v1/object/public/logos/copilot.png'
    },
    { 
      id: 'perplexity', 
      name: 'Perplexity AI', 
      logo: '/logos/perplexity.png',
      localLogo: 'perplexity-ai.svg',
      domain: 'perplexity.ai'
    },
    { 
      id: 'llama', 
      name: 'Llama', 
      logo: '/logos/llama.png',
      localLogo: 'llama.png',
      domain: 'ai.meta.com'
    },
    { 
      id: 'character-ai', 
      name: 'Character.AI', 
      logo: '/logos/character-ai.png',
      localLogo: 'character-ai.png',
      domain: 'character.ai'
    }
  ];

  // ChatGPT替代品数据
  const chatgptAlternatives = [
    {
      name: "Claude (Anthropic)",
      logo: "/logos/claude.png",
      localLogo: "claude.svg",
      domain: "claude.ai",
      supabaseLogoUrl: "https://xxxx.supabase.co/storage/v1/object/public/logos/claude.png", // 示例 Supabase URL
      rating: 4.8,
      pricing: "Free tier + $20/month Pro",
      strengths: ["Constitutional AI safety", "Long context (200K tokens)", "Excellent reasoning", "Helpful and harmless"],
      weaknesses: ["Limited image generation", "No real-time information", "Monthly usage limits on free tier"],
      bestFor: ["Research and analysis", "Code explanation", "Creative writing", "Academic work"],
      features: {
        contextLength: "200,000 tokens",
        multimodal: "Text + Images (input only)",
        realTime: "No",
        codeGeneration: "Excellent",
        languages: "100+",
        apiAccess: "Yes"
      },
      freeFeatures: "Daily conversation limits, full model access",
      website: "https://claude.ai",
      comparison: {
        vsGPT: "More careful and nuanced responses, better at avoiding harmful content"
      }
    },
    {
      name: "Google Gemini",
      logo: "/logos/gemini.png",
      localLogo: "google-gemini.png",
      domain: "google.com",
      rating: 4.6,
      pricing: "Free + $20/month Advanced",
      strengths: ["Real-time Google search", "Multimodal capabilities", "Fast response time", "Integrated with Google services"],
      weaknesses: ["Inconsistent quality", "Less creative than GPT-4", "Limited availability in some regions"],
      bestFor: ["Research with current info", "Google Workspace integration", "Factual questions", "Image analysis"],
      features: {
        contextLength: "32,000 tokens",
        multimodal: "Text + Images + Audio",
        realTime: "Yes (Google Search)",
        codeGeneration: "Good",
        languages: "40+",
        apiAccess: "Yes"
      },
      freeFeatures: "Full access with usage limits",
      website: "https://gemini.google.com",
      comparison: {
        vsGPT: "Better at current events and factual information, integrated with Google ecosystem"
      }
    },
    {
      name: "Microsoft Copilot",
      logo: "/logos/microsoft-copilot.png",
      localLogo: "microsoft-copilot.png",
      domain: "copilot.microsoft.com",
      supabaseLogoUrl: "https://xxxx.supabase.co/storage/v1/object/public/logos/microsoft-copilot.png", // 示例 Supabase URL
      rating: 4.5,
      pricing: "Free + $20/month Pro",
      strengths: ["Microsoft 365 integration", "Bing search integration", "Image generation", "Enterprise features"],
      weaknesses: ["Tied to Microsoft ecosystem", "Less conversational", "Limited customization"],
      bestFor: ["Microsoft Office users", "Enterprise environments", "Web browsing with AI", "Professional workflows"],
      features: {
        contextLength: "16,000 tokens",
        multimodal: "Text + Images",
        realTime: "Yes (Bing)",
        codeGeneration: "Good",
        languages: "50+",
        apiAccess: "Limited"
      },
      freeFeatures: "Basic chat, limited daily queries",
      website: "https://copilot.microsoft.com",
      comparison: {
        vsGPT: "Better Microsoft integration, includes web browsing in free tier"
      }
    },
    {
      name: "Perplexity AI", 
      domain: "perplexity.ai",
      rating: 4.4,
      pricing: "Free + $20/month Pro",
      strengths: ["Excellent for research", "Cites sources", "Real-time web search", "Academic focus"],
      weaknesses: ["Limited creative tasks", "Smaller context window", "Less conversational"],
      bestFor: ["Research and fact-checking", "Academic work", "News and current events", "Source-backed answers"],
      features: {
        contextLength: "8,000 tokens",
        multimodal: "Text + Images",
        realTime: "Yes (Web search)",
        codeGeneration: "Basic",
        languages: "20+",
        apiAccess: "Yes"
      },
      freeFeatures: "5 searches per 4 hours, basic model",
      website: "https://perplexity.ai",
      comparison: {
        vsGPT: "Superior for research with citations, real-time information access"
      }
    },
    {
      name: "Character.AI",
      logo: "/logos/character-ai.png",
      localLogo: "character-ai.png",
      domain: "character.ai",
      rating: 4.2,
      pricing: "Free + $9.99/month Plus",
      strengths: ["Character roleplay", "Creative conversations", "Large variety of personas", "Community content"],
      weaknesses: ["Less factual accuracy", "Not suitable for professional use", "Content filtering"],
      bestFor: ["Entertainment", "Creative roleplay", "Language practice", "Character interactions"],
      features: {
        contextLength: "32,000 tokens",
        multimodal: "Text + Limited images",
        realTime: "No",
        codeGeneration: "Basic",
        languages: "30+",
        apiAccess: "Limited"
      },
      freeFeatures: "Unlimited basic usage with queues",
      website: "https://character.ai",
      comparison: {
        vsGPT: "More entertaining and creative for roleplay, less suitable for serious tasks"
      }
    },
    {
      name: "Llama 2/3 (Meta)",
      logo: "/logos/llama.png",
      localLogo: "llama.png",
      domain: "ai.meta.com",
      rating: 4.3,
      pricing: "Free (open source)",
      strengths: ["Open source", "Run locally", "No usage limits", "Customizable", "Privacy"],
      weaknesses: ["Requires technical setup", "Hardware requirements", "No official support"],
      bestFor: ["Privacy-focused users", "Custom implementations", "Local deployment", "Research"],
      features: {
        contextLength: "4,000-200,000 tokens",
        multimodal: "Text (+ Vision in some variants)",
        realTime: "Depends on setup",
        codeGeneration: "Good",
        languages: "Limited",
        apiAccess: "Self-hosted"
      },
      freeFeatures: "Completely free, open source",
      website: "https://ai.meta.com/llama/",
      comparison: {
        vsGPT: "Complete privacy and control, but requires technical expertise to set up"
      }
    }
  ];

  return (
    <GlobalLayout>
      {/* SEO结构化数据 */}
      <StructuredData 
        type="article" 
        data={{
          headline: "10 Best ChatGPT Alternatives in 2025 - Free & Paid Options Compared",
          description: "Discover the best ChatGPT alternatives including Claude, Google Gemini, Microsoft Copilot, and more. Compare features, pricing, and capabilities to find the perfect AI assistant for your needs.",
          datePublished: "2025-09-17",
          dateModified: "2025-09-17",
          author: {
            "@type": "Organization", 
            name: "ToolVerse"
          }
        }} 
      />
      
      {/* FAQ结构化数据 */}
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <span className="animate-pulse mr-2">🤖</span>
                Updated September 2025
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                10 Best{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  ChatGPT Alternatives
                </span>{' '}
                in 2025
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                Discover powerful AI assistants that rival ChatGPT. From Claude's superior reasoning to 
                Gemini's real-time search - find the perfect AI companion for your specific needs.
              </p>

              {/* 快速对比选择器 */}
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="#claude" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10">
                  🧠 Best Reasoning
                </a>
                <a href="#gemini" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10">
                  🔍 Real-time Search
                </a>
                <a href="#copilot" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10">
                  💼 For Business
                </a>
                <a href="#free-alternatives" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/10">
                  🆓 Free Options
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Comparison */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              ChatGPT vs Top Alternatives - Quick Overview
            </h2>
            
            <div className="overflow-x-auto">
              <div className="border rounded-lg shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-100 to-indigo-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">AI Assistant</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Free Tier</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Best For</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Key Advantage</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chatgptAlternatives.slice(0, 5).map((alt, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-purple-50/30" : "bg-white"}>
                        <td className="border border-gray-300 px-4 py-3 font-medium">{alt.name}</td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alt.freeFeatures ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {alt.freeFeatures ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {alt.bestFor[0]}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center text-sm">
                          {alt.strengths[0]}
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <span className="inline-flex items-center">
                            ⭐ {alt.rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Content Banner */}
        <section className="py-8 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Advertisement</span>
            </div>
            <ContentBanner />
          </div>
        </section>

        {/* Detailed Alternatives */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Detailed ChatGPT Alternatives Review
              </h2>
              <p className="text-base text-gray-700">
                In-depth analysis of each alternative with pros, cons, and use cases
              </p>
            </div>

            <div className="space-y-12">
              {chatgptAlternatives.map((alternative, index) => (
                <div key={index} id={alternative.name.toLowerCase().replace(/\s+/g, '-')} 
                     className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                  
                  {/* Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <ToolLogo tool={alternative} size={64} />
                        <div>
                          <h3 className="text-2xl font-bold">{alternative.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center">
                              ⭐ {alternative.rating}/5
                            </span>
                            <span className="text-sm opacity-90">{alternative.pricing}</span>
                          </div>
                        </div>
                      </div>
                      <a 
                        href={alternative.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                      >
                        Try Now
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      
                      {/* Left Column */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">✅ Strengths</h4>
                          <ul className="space-y-2">
                            {alternative.strengths.map((strength, i) => (
                              <li key={i} className="flex items-center text-green-700">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">❌ Weaknesses</h4>
                          <ul className="space-y-2">
                            {alternative.weaknesses.map((weakness, i) => (
                              <li key={i} className="flex items-center text-red-700">
                                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                                {weakness}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">🎯 Best For</h4>
                          <div className="flex flex-wrap gap-2">
                            {alternative.bestFor.map((use, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {use}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">🔧 Technical Features</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Context Length:</span>
                              <span className="font-medium">{alternative.features.contextLength}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Multimodal:</span>
                              <span className="font-medium">{alternative.features.multimodal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Real-time Info:</span>
                              <span className={`font-medium ${alternative.features.realTime === 'Yes' ? 'text-green-600' : 'text-red-600'}`}>
                                {alternative.features.realTime}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Code Generation:</span>
                              <span className="font-medium">{alternative.features.codeGeneration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Languages:</span>
                              <span className="font-medium">{alternative.features.languages}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">API Access:</span>
                              <span className={`font-medium ${alternative.features.apiAccess === 'Yes' ? 'text-green-600' : 'text-orange-600'}`}>
                                {alternative.features.apiAccess}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-green-900 mb-2">🆓 Free Features</h4>
                          <p className="text-green-800 text-sm">{alternative.freeFeatures}</p>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-blue-900 mb-2">🆚 vs ChatGPT</h4>
                          <p className="text-blue-800 text-sm">{alternative.comparison.vsGPT}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Case Scenarios */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Which Alternative Should You Choose?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-blue-900 mb-4">👨‍💻 For Developers</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">Best Overall:</span>
                    <span className="font-medium text-blue-900">Claude</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">Best Free:</span>
                    <span className="font-medium text-blue-900">Gemini</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800">For Teams:</span>
                    <span className="font-medium text-blue-900">Copilot</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <h3 className="text-xl font-semibold text-green-900 mb-4">📚 For Researchers</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-800">Best Overall:</span>
                    <span className="font-medium text-green-900">Perplexity</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-800">For Analysis:</span>
                    <span className="font-medium text-green-900">Claude</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-800">Current Info:</span>
                    <span className="font-medium text-green-900">Gemini</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <h3 className="text-xl font-semibold text-purple-900 mb-4">🎨 For Creatives</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-800">Best Overall:</span>
                    <span className="font-medium text-purple-900">Claude</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-800">For Fun:</span>
                    <span className="font-medium text-purple-900">Character.AI</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-800">Free Option:</span>
                    <span className="font-medium text-purple-900">Gemini</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <h3 className="text-xl font-semibold text-orange-900 mb-4">💼 For Business</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-800">Enterprise:</span>
                    <span className="font-medium text-orange-900">Copilot</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-800">Startups:</span>
                    <span className="font-medium text-orange-900">Claude</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-800">Budget:</span>
                    <span className="font-medium text-orange-900">Gemini</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
                <h3 className="text-xl font-semibold text-red-900 mb-4">🔒 For Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-red-800">Most Private:</span>
                    <span className="font-medium text-red-900">Llama (Local)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-800">Cloud Safe:</span>
                    <span className="font-medium text-red-900">Claude</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-800">Open Source:</span>
                    <span className="font-medium text-red-900">Llama 2/3</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
                <h3 className="text-xl font-semibold text-teal-900 mb-4">🆓 Best Free Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-teal-800">Overall:</span>
                    <span className="font-medium text-teal-900">Gemini</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-800">Quality:</span>
                    <span className="font-medium text-teal-900">Claude Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-800">No Limits:</span>
                    <span className="font-medium text-teal-900">Llama (Local)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TODO: 添加决策流程图 */}
            <div className="mt-12 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">📝 TODO: 添加决策流程</h3>
              <p className="text-indigo-800 text-sm">
                创建交互式决策流程图，帮助用户根据具体需求（预算、用途、技术水平、隐私要求等）
                快速找到最适合的ChatGPT替代品
              </p>
            </div>
          </div>
        </section>

        {/* 价格对比表 */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              💰 Pricing Comparison
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Compare pricing plans across different ChatGPT alternatives to find the best value for your needs.
              Prices are updated regularly but may vary by region.
            </p>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">AI Assistant</th>
                    <th className="px-6 py-4 text-center font-semibold">Free Tier</th>
                    <th className="px-6 py-4 text-center font-semibold">Pro/Paid Plan</th>
                    <th className="px-6 py-4 text-center font-semibold">Enterprise</th>
                    <th className="px-6 py-4 text-center font-semibold">Best Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ToolLogo tool={pricingComparisonTools[0]} size={32} />
                        <span className="font-medium text-gray-900">Claude</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-600 font-medium">✓ Free</div>
                      <div className="text-sm text-gray-500">Limited messages</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-lg">$20/mo</div>
                      <div className="text-sm text-gray-500">Claude Pro</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-gray-600">Contact Sales</div>
                      <div className="text-sm text-gray-500">Custom pricing</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        ⭐ Quality
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ToolLogo tool={pricingComparisonTools[1]} size={32} />
                        <span className="font-medium text-gray-900">Google Gemini</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-600 font-medium">✓ Free</div>
                      <div className="text-sm text-gray-500">Generous limits</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-lg">$20/mo</div>
                      <div className="text-sm text-gray-500">Gemini Advanced</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-gray-600">Contact Sales</div>
                      <div className="text-sm text-gray-500">Google Workspace</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        🆓 Free
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ToolLogo tool={pricingComparisonTools[2]} size={32} />
                        <span className="font-medium text-gray-900">Microsoft Copilot</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-600 font-medium">✓ Free</div>
                      <div className="text-sm text-gray-500">With limitations</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-lg">$20/mo</div>
                      <div className="text-sm text-gray-500">Copilot Pro</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-gray-600">$30/user/mo</div>
                      <div className="text-sm text-gray-500">Microsoft 365</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        🏢 Business
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ToolLogo tool={pricingComparisonTools[3]} size={32} />
                        <span className="font-medium text-gray-900">Perplexity AI</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-600 font-medium">✓ Free</div>
                      <div className="text-sm text-gray-500">5 queries/4hrs</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-lg">$20/mo</div>
                      <div className="text-sm text-gray-500">Perplexity Pro</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-gray-600">Contact Sales</div>
                      <div className="text-sm text-gray-500">Custom plans</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        🔍 Research
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ToolLogo tool={pricingComparisonTools[4]} size={32} />
                        <span className="font-medium text-gray-900">Llama (Local)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-600 font-medium">✓ Free</div>
                      <div className="text-sm text-gray-500">Open source</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-600 font-bold">$0</div>
                      <div className="text-sm text-gray-500">Hardware costs</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-600 font-bold">$0</div>
                      <div className="text-sm text-gray-500">Self-hosted</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        🔒 Privacy
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <ToolLogo tool={pricingComparisonTools[5]} size={32} />
                        <span className="font-medium text-gray-900">Character.AI</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-green-600 font-medium">✓ Free</div>
                      <div className="text-sm text-gray-500">Good limits</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-lg">$9.99/mo</div>
                      <div className="text-sm text-gray-500">Character+</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-gray-600">Contact Sales</div>
                      <div className="text-sm text-gray-500">Custom plans</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                        🎭 Creative
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Pricing Tips & Notes</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <div>
                      <div className="font-medium text-gray-900">Free Tiers</div>
                      <div className="text-sm text-gray-600">Most services offer generous free tiers - try before you buy</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 mt-1">💰</span>
                    <div>
                      <div className="font-medium text-gray-900">Monthly vs Annual</div>
                      <div className="text-sm text-gray-600">Most services offer discounts for annual subscriptions</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-orange-500 mt-1">⚠️</span>
                    <div>
                      <div className="font-medium text-gray-900">Usage Limits</div>
                      <div className="text-sm text-gray-600">Free tiers have daily/monthly message limits</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 mt-1">🏢</span>
                    <div>
                      <div className="font-medium text-gray-900">Enterprise Plans</div>
                      <div className="text-sm text-gray-600">Contact sales for volume discounts and custom features</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center">
                Last updated: September 2025. Prices may vary by region and are subject to change.
              </div>
            </div>
          </div>
        </section>

        {/* 使用体验截图 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              📸 User Experience Screenshots
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              See how different ChatGPT alternatives look and feel in action. These screenshots showcase 
              the user interface and interaction experience of each platform.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Claude Screenshot */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center relative">
                  <div className="absolute inset-4 bg-white rounded-lg shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">C</span>
                      </div>
                      <div className="text-sm text-gray-600">Claude Interface</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-purple-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Screenshot Placeholder
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Claude by Anthropic</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Clean, minimalist interface with excellent conversation flow. Known for thoughtful, 
                    detailed responses and strong safety features.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 text-sm font-medium">✓ User-friendly</span>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      View Larger →
                    </button>
                  </div>
                </div>
              </div>

              {/* Gemini Screenshot */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                  <div className="absolute inset-4 bg-white rounded-lg shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">G</span>
                      </div>
                      <div className="text-sm text-gray-600">Gemini Interface</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Screenshot Placeholder
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Gemini</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Integrated with Google ecosystem. Modern Material Design interface with 
                    multimodal capabilities and real-time information access.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 text-sm font-medium">✓ Integrated</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Larger →
                    </button>
                  </div>
                </div>
              </div>

              {/* Microsoft Copilot Screenshot */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center relative">
                  <div className="absolute inset-4 bg-white rounded-lg shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-indigo-500 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">M</span>
                      </div>
                      <div className="text-sm text-gray-600">Copilot Interface</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-indigo-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Screenshot Placeholder
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Microsoft Copilot</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Seamlessly integrated into Microsoft 365 apps. Professional interface 
                    designed for productivity and business workflows.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 text-sm font-medium">✓ Professional</span>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                      View Larger →
                    </button>
                  </div>
                </div>
              </div>

              {/* Perplexity AI Screenshot */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center relative">
                  <div className="absolute inset-4 bg-white rounded-lg shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-teal-500 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">P</span>
                      </div>
                      <div className="text-sm text-gray-600">Perplexity Interface</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-teal-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Screenshot Placeholder
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Perplexity AI</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Research-focused interface with source citations. Clean design optimized 
                    for fact-finding and in-depth research tasks.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 text-sm font-medium">✓ Research-focused</span>
                    <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                      View Larger →
                    </button>
                  </div>
                </div>
              </div>

              {/* Character.AI Screenshot */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center relative">
                  <div className="absolute inset-4 bg-white rounded-lg shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">C</span>
                      </div>
                      <div className="text-sm text-gray-600">Character.AI Interface</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Screenshot Placeholder
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Character.AI</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Unique character-based interface allowing conversations with different AI personalities. 
                    Great for creative and entertainment purposes.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 text-sm font-medium">✓ Creative</span>
                    <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                      View Larger →
                    </button>
                  </div>
                </div>
              </div>

              {/* Llama Local Screenshot */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center relative">
                  <div className="absolute inset-4 bg-white rounded-lg shadow-inner flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">L</span>
                      </div>
                      <div className="text-sm text-gray-600">Local LLM Interface</div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Screenshot Placeholder
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Llama (Local Setup)</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Terminal or web-based interface for locally hosted models. Complete privacy 
                    and control over your AI interactions.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 text-sm font-medium">✓ Private</span>
                    <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                      View Larger →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">📝 Note on Screenshots</h3>
                <p className="text-blue-800 text-sm">
                  These are placeholder representations of each platform's interface. 
                  For actual screenshots and detailed UI reviews, please visit our 
                  <Link href="/tools" className="underline hover:text-blue-600"> comprehensive tool reviews</Link>.
                  Interface designs may change over time as platforms update their user experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section with JSON-LD */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Get answers to the most common questions about ChatGPT alternatives, 
              pricing, features, and choosing the right AI assistant for your needs.
            </p>
            
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0 text-gray-400 group-open:text-primary-600 transform group-open:rotate-180 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            {/* Additional FAQ Categories */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4">💡 Quick Tips</h3>
                <ul className="space-y-2 text-green-800 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Try multiple free tiers before committing to paid plans</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Consider your primary use case (coding, writing, research)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Check if your organization has enterprise agreements</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>Local models offer complete privacy but require technical setup</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">🔄 Migration Tips</h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Export important conversations before switching</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Test the new platform with your typical use cases</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Update integrations and workflows gradually</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Keep backup access to your previous platform during transition</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqData.map(faq => ({
                  "@type": "Question",
                  "name": faq.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                  }
                })),
                "about": {
                  "@type": "SoftwareApplication",
                  "name": "ChatGPT Alternatives",
                  "applicationCategory": "AI Assistant",
                  "description": "Comparison and guide to the best ChatGPT alternatives in 2025"
                },
                "dateModified": "2025-09-17",
                "inLanguage": "en-US"
              })
            }}
          />
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Try These ChatGPT Alternatives?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Most of these alternatives offer free tiers. Start exploring today and find 
              the AI assistant that best fits your workflow and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Explore All AI Tools
              </Link>
              <Link
                href="/best-free-ai-tools-2025"
                className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-medium"
              >
                Free AI Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Related Articles Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Related Resources
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Link href="/ai-tools-for-small-business" className="group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    AI Tools for Small Business
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Discover AI tools specifically designed for small businesses. ROI-focused recommendations and budget planning.
                  </p>
                  <div className="mt-4 text-purple-600 font-medium text-sm group-hover:text-purple-700">
                    Read Guide →
                  </div>
                </div>
              </Link>

              <Link href="/best-free-ai-tools-2025" className="group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <span className="text-2xl">🆓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    Best Free AI Tools 2025
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Comprehensive list of free AI tools including many ChatGPT alternatives with generous free tiers.
                  </p>
                  <div className="mt-4 text-purple-600 font-medium text-sm group-hover:text-purple-700">
                    Explore Free Options →
                  </div>
                </div>
              </Link>

              <Link href="/tools" className="group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <span className="text-2xl">🛠️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    All AI Tools Directory
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Browse our complete directory of AI tools across all categories including more ChatGPT alternatives.
                  </p>
                  <div className="mt-4 text-purple-600 font-medium text-sm group-hover:text-purple-700">
                    Browse All →
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get AI Tool Updates
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Stay informed about new ChatGPT alternatives and AI tool developments. 
                Get weekly updates on the latest AI tools, comparisons, and reviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Weekly updates • No spam • Unsubscribe anytime
              </p>
            </div>
          </div>
        </section>
      </div>
    </GlobalLayout>
  );
}