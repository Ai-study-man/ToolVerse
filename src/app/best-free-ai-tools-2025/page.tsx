'use client';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import GlobalLayout from '../../components/GlobalLayout';
import StructuredData from '../../components/StructuredData';
import { ContentBanner } from '../../components/AdBanner';

export default function BestFreeAIToolsPage() {
  // FAQ data for structured data
  const faqData = [
    {
      question: "What are the best free AI tools available in 2025?",
      answer: "The best free AI tools in 2025 include ChatGPT (free tier), Claude (free tier), Google Gemini, Canva AI, DALL-E, Midjourney (trial), GitHub Copilot (for students), and many others across categories like text generation, image creation, code assistance, and design."
    },
    {
      question: "Are free AI tools as good as paid versions?",
      answer: "Free AI tools often provide excellent functionality but with limitations such as usage caps, lower resolution outputs, fewer features, and limited commercial usage. However, they&apos;re perfect for personal projects, learning, and small-scale applications."
    },
    {
      question: "Can I use free AI tools for commercial purposes?",
      answer: "Most free AI tools allow commercial use, but always review the license terms and conditions. Some tools like GitHub Copilot require paid plans for commercial use, while others like ChatGPT allow commercial use even on free tiers."
    },
    {
      question: "How do I choose the right free AI tool for my needs?",
      answer: "Consider your specific use case: text generation (ChatGPT, Claude), image creation (DALL-E, Stable Diffusion), coding (GitHub Copilot, CodeWhisperer), design (Canva AI), or productivity (Notion AI). Test multiple tools to find the best fit."
    },
    {
      question: "What are the limitations of free AI tools?",
      answer: "Common limitations include daily usage quotas, lower quality outputs, watermarks on generated content, limited features compared to paid versions, slower processing times, and restricted commercial usage in some cases."
    }
  ];

  // Free AI tools category data
  const freeToolCategories = [
    {
      category: "Conversational AI",
      tools: [
        {
          name: "ChatGPT (Free Tier)",
          description: "OpenAI's powerful conversational AI with GPT-3.5 access",
          features: ["Natural conversation", "Code assistance", "Writing help", "Problem solving"],
          limitations: "Limited daily messages, no GPT-4 access, no plugin access",
          website: "https://chat.openai.com",
          pros: ["Versatile capabilities", "Fast responses", "Large knowledge base"],
          cons: ["Usage limits", "No internet access", "May generate outdated info"]
        },
        {
          name: "Claude (Free Tier)",
          description: "Anthropic's AI assistant focused on helpful, harmless, and honest responses",
          features: ["Long conversations", "Document analysis", "Creative writing", "Code review"],
          limitations: "Daily message limits, slower response times",
          website: "https://claude.ai",
          pros: ["Better reasoning", "Longer context", "Safer outputs"],
          cons: ["Limited availability", "Slower than ChatGPT", "Smaller user base"]
        },
        {
          name: "Google Gemini",
          description: "Google's multimodal AI that can understand text, images, and code",
          features: ["Multimodal input", "Real-time information", "Integration with Google services"],
          limitations: "Limited conversation length, regional restrictions",
          website: "https://gemini.google.com",
          pros: ["Current information", "Google integration", "Multimodal"],
          cons: ["Less creative", "Privacy concerns", "Limited customization"]
        }
      ]
    },
    {
      category: "Image Generation",
      tools: [
        {
          name: "DALL-E 2 (Free Credits)",
          description: "OpenAI's image generation AI with monthly free credits",
          features: ["Text-to-image", "Image editing", "Variations", "Outpainting"],
          limitations: "15 free credits per month, commercial usage restrictions",
          website: "https://openai.com/dall-e-2",
          pros: ["High quality", "Easy to use", "Precise control"],
          cons: ["Limited free credits", "Can&apos;t generate faces", "Expensive after free tier"]
        },
        {
          name: "Stable Diffusion (Web UI)",
          description: "Open-source image generation model with various online interfaces",
          features: ["Text-to-image", "Image-to-image", "Inpainting", "ControlNet"],
          limitations: "Requires technical knowledge, slower generation",
          website: "https://huggingface.co/spaces/stabilityai/stable-diffusion",
          pros: ["Completely free", "Open source", "Highly customizable"],
          cons: ["Complex setup", "Requires good prompting", "Variable quality"]
        },
        {
          name: "Canva AI",
          description: "AI-powered design tools integrated into Canva's platform",
          features: ["Magic Design", "Background remover", "Magic Eraser", "Text-to-image"],
          limitations: "Limited free generations, watermarks on some outputs",
          website: "https://www.canva.com",
          pros: ["Easy to use", "Integrated design tools", "Templates"],
          cons: ["Limited AI features in free plan", "Watermarks", "Less control"]
        }
      ]
    },
    {
      category: "Code & Development",
      tools: [
        {
          name: "GitHub Copilot (Free for Students)",
          description: "AI pair programmer that suggests code and entire functions",
          features: ["Code completion", "Function generation", "Multiple languages", "Context awareness"],
          limitations: "Free only for students and open source maintainers",
          website: "https://github.com/features/copilot",
          pros: ["Excellent code quality", "Supports many languages", "IDE integration"],
          cons: ["Not free for commercial use", "Requires verification", "Can suggest copyrighted code"]
        },
        {
          name: "Amazon CodeWhisperer",
          description: "AI coding companion with generous free tier",
          features: ["Code suggestions", "Security scanning", "Reference tracking", "IDE integration"],
          limitations: "Individual use only, limited enterprise features",
          website: "https://aws.amazon.com/codewhisperer",
          pros: ["Generous free tier", "Security features", "Commercial use allowed"],
          cons: ["Newer tool", "Less training data", "AWS ecosystem focus"]
        },
        {
          name: "Tabnine (Free Plan)",
          description: "AI code completion tool with privacy-focused approach",
          features: ["Code completion", "Local processing", "Multiple IDEs", "Team learning"],
          limitations: "Basic completions only, no advanced features",
          website: "https://www.tabnine.com",
          pros: ["Privacy focused", "Works offline", "Fast completions"],
          cons: ["Limited free features", "Less intelligent than competitors", "Smaller context window"]
        }
      ]
    },
    {
      category: "Writing & Content",
      tools: [
        {
          name: "Notion AI",
          description: "AI writing assistant integrated into Notion workspace",
          features: ["Writing assistance", "Summarization", "Translation", "Content generation"],
          limitations: "Limited free AI responses, requires Notion account",
          website: "https://www.notion.so/product/ai",
          pros: ["Integrated workflow", "Multiple content types", "Good at structured content"],
          cons: ["Limited free usage", "Requires Notion", "Less creative than specialized tools"]
        },
        {
          name: "Grammarly (Free)",
          description: "AI-powered writing assistant for grammar and style",
          features: ["Grammar checking", "Spelling correction", "Basic style suggestions", "Browser extension"],
          limitations: "Limited style suggestions, no plagiarism detection",
          website: "https://www.grammarly.com",
          pros: ["Excellent grammar checking", "Wide platform support", "Real-time suggestions"],
          cons: ["Limited free features", "Not creative writing focused", "Can be overly prescriptive"]
        },
        {
          name: "QuillBot (Free)",
          description: "AI paraphrasing and writing enhancement tool",
          features: ["Paraphrasing", "Grammar checking", "Summarization", "Citation generator"],
          limitations: "Limited paraphrasing modes, word count restrictions",
          website: "https://quillbot.com",
          pros: ["Great for paraphrasing", "Multiple writing modes", "Academic features"],
          cons: ["Limited free features", "Can change meaning", "Subscription pressure"]
        }
      ]
    }
  ];

  // Comparison table data
  const comparisonTools = [
    {
      name: "ChatGPT",
      category: "Conversational AI",
      freeFeatures: "GPT-3.5, Basic conversations",
      limitations: "20 messages/3 hours, No GPT-4",
      bestFor: "General conversation, Quick questions",
      rating: 4.5
    },
    {
      name: "Claude",
      category: "Conversational AI", 
      freeFeatures: "Claude 3 Haiku, Long conversations",
      limitations: "Daily message limits",
      bestFor: "Document analysis, Reasoning",
      rating: 4.3
    },
    {
      name: "DALL-E 2",
      category: "Image Generation",
      freeFeatures: "15 credits/month, High quality images",
      limitations: "Very limited credits",
      bestFor: "Professional images, Precise prompts",
      rating: 4.4
    },
    {
      name: "Stable Diffusion",
      category: "Image Generation",
      freeFeatures: "Unlimited generations, Open source",
      limitations: "Technical complexity",
      bestFor: "Unlimited image generation, Customization",
      rating: 4.2
    },
    {
      name: "GitHub Copilot",
      category: "Code Assistant",
      freeFeatures: "Full features for students",
      limitations: "Students/OSS only",
      bestFor: "Professional coding, IDE integration",
      rating: 4.6
    },
    {
      name: "CodeWhisperer",
      category: "Code Assistant",
      freeFeatures: "Individual use, Security scanning",
      limitations: "Individual use only",
      bestFor: "AWS development, Security-conscious coding",
      rating: 4.0
    }
  ];

  return (
    <GlobalLayout>
      <StructuredData type="faq" data={faqData} />

      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
        <Header />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
                Best Free AI Tools 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed text-purple-100">
                Discover 25+ powerful AI tools that won&apos;t cost you a penny. From conversational AI to image generation, coding assistants to content creation - find the perfect free AI tool for your needs.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-purple-100 text-base">
                  💡 <strong>Updated for 2025:</strong> All tools tested and verified. Includes newest free tiers, usage limits, and commercial licensing information.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="text-2xl font-bold text-purple-600">25+</div>
                <div className="text-gray-700">Free AI Tools</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-6">
                <div className="text-2xl font-bold text-indigo-600">6</div>
                <div className="text-gray-700">Categories</div>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-2xl font-bold text-green-600">100%</div>
                <div className="text-gray-700">Free to Start</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-6">
                <div className="text-2xl font-bold text-orange-600">2025</div>
                <div className="text-gray-700">Updated</div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools by Category */}
        <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Free AI Tools by Category
            </h2>
            
            {freeToolCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                <h3 className="text-2xl font-bold text-purple-900 mb-8 border-l-4 border-purple-500 pl-4">
                  {category.category}
                </h3>
                
                <div className="grid grid-cols-1 gap-8">
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xl font-bold text-gray-900">
                          {tool.name}
                        </h4>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Free
                        </span>
                      </div>
                      
                      <p className="text-base text-gray-700 mb-4">{tool.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">✅ Key Features:</h5>
                          <div className="space-y-1">
                            {tool.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">⚠️ Limitations:</h5>
                          <p className="text-sm text-orange-700 bg-orange-50 px-3 py-2 rounded-lg">
                            {tool.limitations}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-semibold text-green-700 mb-2">👍 Pros:</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {tool.pros.map((pro, proIndex) => (
                              <li key={proIndex} className="flex items-start">
                                <span className="text-green-500 mr-2">+</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-red-700 mb-2">👎 Cons:</h5>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {tool.cons.map((con, conIndex) => (
                              <li key={conIndex} className="flex items-start">
                                <span className="text-red-500 mr-2">-</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <a 
                          href={tool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                          Try Free →
                        </a>
                        <div className="text-sm text-gray-500">
                          Click to visit official website
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Free AI Tools Comparison
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">Tool Name</th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">Free Features</th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">Limitations</th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">Best For</th>
                      <th className="px-6 py-4 text-left text-base font-semibold text-gray-900">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {comparisonTools.map((tool, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{tool.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            {tool.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{tool.freeFeatures}</td>
                        <td className="px-6 py-4 text-sm text-orange-700">{tool.limitations}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{tool.bestFor}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-sm font-medium text-gray-900">{tool.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 How to Choose the Right Tool</h3>
              <p className="text-base text-blue-800">
                Consider your specific needs: <strong>ChatGPT</strong> for general conversation, <strong>Claude</strong> for document analysis, 
                <strong>DALL-E</strong> for professional images, <strong>Stable Diffusion</strong> for unlimited generation, 
                <strong>GitHub Copilot</strong> for professional coding (students), or <strong>CodeWhisperer</strong> for individual developers.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Q: {faq.question}
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    <strong>A:</strong> {faq.answer}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Explore Free AI Tools?</h3>
              <p className="text-lg mb-6 text-purple-100">
                Start with any tool from our list above. Most require just a simple sign-up to get started for free.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" 
                   className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Try ChatGPT
                </a>
                <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"
                   className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors">
                  Try Claude
                </a>
                <a href="https://openai.com/dall-e-2" target="_blank" rel="noopener noreferrer"
                   className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors">
                  Try DALL-E
                </a>
              </div>
            </div>
          </div>
        </section>

        <ContentBanner />
      </div>
    </GlobalLayout>
  );
}