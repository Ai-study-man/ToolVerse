'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import StructuredData from '../../../components/StructuredData';
import { ContentBanner } from '../../../components/AdBanner';

export default function ChatGPTvsClaudePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ComparisonArticle',
    name: 'ChatGPT vs Claude 2025: Complete AI Chatbot Comparison',
    description: 'Detailed comparison of ChatGPT vs Claude AI chatbots. Compare features, pricing, accuracy, strengths and weaknesses to choose the best AI assistant for your needs.',
    url: 'https://www.toolverse.tools/compare/chatgpt-vs-claude',
    datePublished: '2025-01-15',
    dateModified: '2025-01-15',
    author: {
      '@type': 'Organization',
      name: 'ToolVerse'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ToolVerse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.toolverse.tools/favicon.png'
      }
    }
  };

  const comparisonData = {
    overview: {
      chatgpt: {
        developer: 'OpenAI',
        launched: 'November 2022',
        model: 'GPT-4, GPT-3.5',
        strengths: ['Creative writing', 'Code generation', 'Broad knowledge', 'Plugin ecosystem'],
        weaknesses: ['Can be verbose', 'Knowledge cutoff', 'Hallucinations'],
        pricing: 'Free tier + $20/month Pro'
      },
      claude: {
        developer: 'Anthropic',
        launched: 'March 2023',
        model: 'Claude 3 (Opus, Sonnet, Haiku)',
        strengths: ['Constitutional AI', 'Longer context', 'More accurate', 'Better reasoning'],
        weaknesses: ['Newer platform', 'Fewer integrations', 'Limited availability'],
        pricing: 'Free tier + $20/month Pro'
      }
    },
    features: [
      {
        feature: 'Context Length',
        chatgpt: '8K-32K tokens (GPT-4)',
        claude: 'Up to 200K tokens',
        winner: 'claude'
      },
      {
        feature: 'Code Generation',
        chatgpt: 'Excellent',
        claude: 'Very Good',
        winner: 'chatgpt'
      },
      {
        feature: 'Creative Writing',
        chatgpt: 'Excellent',
        claude: 'Good',
        winner: 'chatgpt'
      },
      {
        feature: 'Factual Accuracy',
        chatgpt: 'Good',
        claude: 'Excellent',
        winner: 'claude'
      },
      {
        feature: 'Safety & Alignment',
        chatgpt: 'Good',
        claude: 'Excellent',
        winner: 'claude'
      },
      {
        feature: 'API Access',
        chatgpt: 'Extensive',
        claude: 'Limited',
        winner: 'chatgpt'
      }
    ]
  };

  return (
    <>
      <StructuredData type="article" data={structuredData} />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                ChatGPT vs Claude 2025: Complete AI Chatbot Comparison
              </h1>
              <p className="text-xl opacity-90 max-w-4xl mx-auto mb-8">
                Detailed comparison of ChatGPT and Claude AI assistants. Compare features, pricing, accuracy, and performance to choose the best AI chatbot for your needs. Updated with latest models and capabilities.
              </p>
              
              {/* Quick verdict */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">🏆 Best for Creative Tasks</h3>
                  <p className="text-lg">ChatGPT excels at creative writing, code generation, and has extensive plugin ecosystem</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">🎯 Best for Accuracy</h3>
                  <p className="text-lg">Claude offers better factual accuracy, longer context, and superior reasoning capabilities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'features', label: 'Feature Comparison' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'use-cases', label: 'Use Cases' },
                { id: 'verdict', label: 'Final Verdict' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Content Banner */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4">
              <span className="text-xs text-gray-400 uppercase tracking-wide">Advertisement</span>
            </div>
            <ContentBanner />
          </div>
        </section>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">ChatGPT vs Claude: Quick Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ChatGPT Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">ChatGPT</h3>
                      <p className="text-gray-600">by OpenAI</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Strengths</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {comparisonData.overview.chatgpt.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Limitations</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {comparisonData.overview.chatgpt.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Pricing:</span> {comparisonData.overview.chatgpt.pricing}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Claude Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🧠</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Claude</h3>
                      <p className="text-gray-600">by Anthropic</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Strengths</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {comparisonData.overview.claude.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Limitations</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {comparisonData.overview.claude.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Pricing:</span> {comparisonData.overview.claude.pricing}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Feature Comparison Tab */}
        {activeTab === 'features' && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Feature-by-Feature Comparison</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Feature</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">ChatGPT</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Claude</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {comparisonData.features.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.feature}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{item.chatgpt}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{item.claude}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.winner === 'chatgpt' 
                              ? 'bg-green-100 text-green-800'
                              : item.winner === 'claude'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.winner === 'chatgpt' ? 'ChatGPT' : item.winner === 'claude' ? 'Claude' : 'Tie'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Use Cases Tab */}
        {activeTab === 'use-cases' && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Use Cases for Each AI</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-green-600 mb-6">🚀 Choose ChatGPT for:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Creative Writing</h4>
                        <p className="text-gray-600 text-sm">Stories, poems, marketing copy, and brainstorming</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Code Generation</h4>
                        <p className="text-gray-600 text-sm">Programming, debugging, and code explanation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Plugin Ecosystem</h4>
                        <p className="text-gray-600 text-sm">Web browsing, third-party integrations, specialized tools</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-purple-600 mb-6">🎯 Choose Claude for:</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Research & Analysis</h4>
                        <p className="text-gray-600 text-sm">Long document analysis, factual research, data interpretation</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Complex Reasoning</h4>
                        <p className="text-gray-600 text-sm">Logic problems, mathematical reasoning, detailed explanations</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Safety-Critical Tasks</h4>
                        <p className="text-gray-600 text-sm">Factual accuracy, unbiased responses, ethical considerations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Final Verdict Tab */}
        {activeTab === 'verdict' && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Final Verdict: ChatGPT vs Claude</h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Bottom Line</h3>
                <p className="text-lg text-gray-700 mb-6">
                  Both ChatGPT and Claude are excellent AI assistants, but they excel in different areas. Your choice depends on your specific needs and use cases.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6">
                    <h4 className="text-lg font-bold text-green-600 mb-3">Choose ChatGPT if you need:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Creative content generation</li>
                      <li>• Code development assistance</li>
                      <li>• Plugin ecosystem and integrations</li>
                      <li>• Conversational and engaging responses</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    <h4 className="text-lg font-bold text-purple-600 mb-3">Choose Claude if you need:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• High factual accuracy</li>
                      <li>• Long document analysis</li>
                      <li>• Complex reasoning tasks</li>
                      <li>• Safety and ethical considerations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Want to Try Both?</h3>
                <p className="text-gray-600 mb-6">Both platforms offer free tiers, so you can test them yourself.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" 
                     className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Try ChatGPT Free
                  </a>
                  <a href="https://claude.ai" target="_blank" rel="noopener noreferrer"
                     className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    Try Claude Free
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Comparisons */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Related AI Tool Comparisons
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/compare/chatgpt-vs-gemini" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ChatGPT vs Gemini</h3>
                <p className="text-gray-600 text-sm">Compare OpenAI ChatGPT with Google's Gemini AI assistant</p>
              </a>
              
              <a href="/compare/claude-vs-perplexity" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Claude vs Perplexity</h3>
                <p className="text-gray-600 text-sm">Compare Claude with Perplexity AI for research tasks</p>
              </a>
              
              <a href="/compare/best-ai-chatbots" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Best AI Chatbots 2025</h3>
                <p className="text-gray-600 text-sm">Complete comparison of all top AI chatbots</p>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
