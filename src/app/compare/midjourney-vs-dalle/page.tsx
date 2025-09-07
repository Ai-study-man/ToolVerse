'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import StructuredData from '../../../components/StructuredData';
import { ContentBanner } from '../../../components/AdBanner';

export default function MidjourneyVsDallePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ComparisonArticle',
    name: 'Midjourney vs DALL-E 3 2025: Best AI Image Generator Comparison',
    description: 'Complete comparison of Midjourney vs DALL-E 3 AI image generators. Compare image quality, pricing, features, and ease of use to choose the best AI art tool.',
    url: 'https://www.toolverse.tools/compare/midjourney-vs-dalle',
    datePublished: '2025-01-15',
    dateModified: '2025-01-15',
    author: {
      '@type': 'Organization',
      name: 'ToolVerse'
    }
  };

  const comparisonData = {
    overview: {
      midjourney: {
        developer: 'Midjourney Inc.',
        launched: 'July 2022',
        platform: 'Discord Bot',
        strengths: ['Artistic quality', 'Creative styles', 'Community', 'Consistent results'],
        weaknesses: ['Discord-only', 'Learning curve', 'No free tier', 'Limited control'],
        pricing: '$10-$120/month'
      },
      dalle: {
        developer: 'OpenAI',
        launched: 'September 2023 (DALL-E 3)',
        platform: 'ChatGPT Plus, API, Bing',
        strengths: ['Text accuracy', 'Easy to use', 'Multiple platforms', 'Natural language'],
        weaknesses: ['Less artistic', 'Content restrictions', 'Limited styles', 'Slower generation'],
        pricing: '$20/month (ChatGPT Plus) + credits'
      }
    },
    features: [
      {
        feature: 'Image Quality',
        midjourney: 'Excellent (4.8/5)',
        dalle: 'Very Good (4.3/5)',
        winner: 'midjourney'
      },
      {
        feature: 'Text in Images',
        midjourney: 'Poor',
        dalle: 'Excellent',
        winner: 'dalle'
      },
      {
        feature: 'Artistic Styles',
        midjourney: 'Exceptional',
        dalle: 'Good',
        winner: 'midjourney'
      },
      {
        feature: 'Ease of Use',
        midjourney: 'Moderate',
        dalle: 'Excellent',
        winner: 'dalle'
      },
      {
        feature: 'Speed',
        midjourney: 'Fast (30-60s)',
        dalle: 'Moderate (60-120s)',
        winner: 'midjourney'
      },
      {
        feature: 'Commercial Use',
        midjourney: 'Yes (paid plans)',
        dalle: 'Yes',
        winner: 'tie'
      }
    ]
  };

  return (
    <>
      <StructuredData type="article" data={structuredData} />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Midjourney vs DALL-E 3 2025: Best AI Image Generator Comparison
              </h1>
              <p className="text-xl opacity-90 max-w-4xl mx-auto mb-8">
                Detailed comparison of Midjourney and DALL-E 3 AI image generators. Compare image quality, pricing, features, and ease of use to choose the best AI art tool for your creative projects.
              </p>
              
              {/* Quick verdict */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">🎨 Best for Artistic Quality</h3>
                  <p className="text-lg">Midjourney excels at creating stunning, artistic images with unique styles and exceptional detail</p>
                </div>
                <div className="bg-white/10 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2">📝 Best for Text & Simplicity</h3>
                  <p className="text-lg">DALL-E 3 offers better text rendering, easier prompting, and multiple platform access</p>
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
                { id: 'examples', label: 'Image Examples' },
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Midjourney vs DALL-E 3: Quick Overview</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Midjourney Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Midjourney</h3>
                      <p className="text-gray-600">by Midjourney Inc.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Strengths</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {comparisonData.overview.midjourney.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Limitations</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {comparisonData.overview.midjourney.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Platform:</span> {comparisonData.overview.midjourney.platform}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Pricing:</span> {comparisonData.overview.midjourney.pricing}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DALL-E Overview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">DALL-E 3</h3>
                      <p className="text-gray-600">by OpenAI</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Strengths</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {comparisonData.overview.dalle.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Limitations</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {comparisonData.overview.dalle.weaknesses.map((weakness, index) => (
                          <li key={index}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Platform:</span> {comparisonData.overview.dalle.platform}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Pricing:</span> {comparisonData.overview.dalle.pricing}
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
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Midjourney</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">DALL-E 3</th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {comparisonData.features.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.feature}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{item.midjourney}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 text-center">{item.dalle}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.winner === 'midjourney' 
                              ? 'bg-purple-100 text-purple-800'
                              : item.winner === 'dalle'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.winner === 'midjourney' ? 'Midjourney' : item.winner === 'dalle' ? 'DALL-E 3' : 'Tie'}
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

        {/* Pricing Comparison Tab */}
        {activeTab === 'pricing' && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pricing Comparison</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Midjourney Pricing */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-purple-600 mb-6">Midjourney Pricing</h3>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">Basic Plan - $10/month</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• ~200 images/month</li>
                        <li>• General commercial terms</li>
                        <li>• Access to member gallery</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4 border-purple-200 bg-purple-50">
                      <h4 className="font-semibold text-gray-900">Standard Plan - $30/month</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• ~900 images/month</li>
                        <li>• Unlimited relaxed generations</li>
                        <li>• General commercial terms</li>
                      </ul>
                      <span className="text-xs text-purple-600 font-medium">Most Popular</span>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">Pro Plan - $60/month</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• ~1800 images/month</li>
                        <li>• Stealth mode</li>
                        <li>• Maximum queue</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* DALL-E Pricing */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                  <h3 className="text-2xl font-bold text-green-600 mb-6">DALL-E 3 Pricing</h3>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 border-green-200 bg-green-50">
                      <h4 className="font-semibold text-gray-900">ChatGPT Plus - $20/month</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• Unlimited image generations</li>
                        <li>• Access to GPT-4</li>
                        <li>• Integrated with ChatGPT</li>
                        <li>• Commercial use allowed</li>
                      </ul>
                      <span className="text-xs text-green-600 font-medium">Best Value</span>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">API Access</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• $0.040-0.080 per image</li>
                        <li>• HD quality available</li>
                        <li>• Multiple sizes</li>
                        <li>• Developer integration</li>
                      </ul>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">Microsoft Copilot</h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-1">
                        <li>• Free with limitations</li>
                        <li>• Bing integration</li>
                        <li>• Content restrictions</li>
                      </ul>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Final Verdict: Midjourney vs DALL-E 3</h2>
              
              <div className="bg-gradient-to-r from-purple-50 to-green-50 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Bottom Line</h3>
                <p className="text-lg text-gray-700 mb-6">
                  Both tools excel in different areas. Midjourney is the artist&apos;s choice for creative, high-quality imagery, while DALL-E 3 offers better accessibility and text integration.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6">
                    <h4 className="text-lg font-bold text-purple-600 mb-3">Choose Midjourney if you:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Want the highest artistic quality</li>
                      <li>• Create artwork, illustrations, concept art</li>
                      <li>• Don&apos;t mind learning Discord commands</li>
                      <li>• Want consistent, professional results</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    <h4 className="text-lg font-bold text-green-600 mb-3">Choose DALL-E 3 if you:</h4>
                    <ul className="text-gray-700 space-y-1 text-sm">
                      <li>• Need text in your images</li>
                      <li>• Want simple, conversational prompting</li>
                      <li>• Already use ChatGPT Plus</li>
                      <li>• Prefer web-based interfaces</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Start Creating?</h3>
                <p className="text-gray-600 mb-6">Try both tools to see which fits your creative workflow better.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="https://www.midjourney.com" target="_blank" rel="noopener noreferrer" 
                     className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    Try Midjourney
                  </a>
                  <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer"
                     className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                    Try DALL-E 3
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
              Related AI Image Generator Comparisons
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/compare/stable-diffusion-vs-midjourney" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stable Diffusion vs Midjourney</h3>
                <p className="text-gray-600 text-sm">Compare open-source vs commercial AI image generation</p>
              </a>
              
              <a href="/compare/leonardo-ai-vs-midjourney" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Leonardo AI vs Midjourney</h3>
                <p className="text-gray-600 text-sm">Compare Leonardo AI with Midjourney for creative projects</p>
              </a>
              
              <a href="/compare/best-ai-image-generators" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Best AI Image Generators 2025</h3>
                <p className="text-gray-600 text-sm">Complete comparison of all top AI image tools</p>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
