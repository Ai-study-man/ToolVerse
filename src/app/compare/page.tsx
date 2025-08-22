'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import StructuredData from '../../components/StructuredData';
import Breadcrumbs from '../../components/Breadcrumbs';
import GlobalLayout from '../../components/GlobalLayout';
import { ContentBanner } from '../../components/AdBanner';

// 热门比较数据
const popularComparisons = [
  {
    id: 'chatgpt-vs-claude',
    title: 'ChatGPT vs Claude',
    description: 'Compare OpenAI ChatGPT and Anthropic Claude - features, pricing, accuracy, and use cases',
    tools: ['ChatGPT', 'Claude'],
    category: 'Conversational AI',
    searchVolume: '50K+ monthly searches',
    slug: 'chatgpt-vs-claude'
  },
  {
    id: 'midjourney-vs-dalle',
    title: 'Midjourney vs DALL-E',
    description: 'AI image generation comparison - Midjourney vs DALL-E 3 features, quality, and pricing',
    tools: ['Midjourney', 'DALL-E'],
    category: 'Image Generation',
    searchVolume: '30K+ monthly searches',
    slug: 'midjourney-vs-dalle'
  },
  {
    id: 'github-copilot-vs-cursor',
    title: 'GitHub Copilot vs Cursor',
    description: 'Compare AI coding assistants - GitHub Copilot vs Cursor features, accuracy, and pricing',
    tools: ['GitHub Copilot', 'Cursor'],
    category: 'Code Development',
    searchVolume: '25K+ monthly searches',
    slug: 'github-copilot-vs-cursor'
  },
  {
    id: 'jasper-vs-copy-ai',
    title: 'Jasper vs Copy.ai',
    description: 'AI writing tools comparison - Jasper vs Copy.ai features, templates, and pricing',
    tools: ['Jasper', 'Copy.ai'],
    category: 'Content Writing',
    searchVolume: '20K+ monthly searches',
    slug: 'jasper-vs-copy-ai'
  },
  {
    id: 'notion-ai-vs-clickup',
    title: 'Notion AI vs ClickUp',
    description: 'AI productivity tools comparison - Notion AI vs ClickUp features and capabilities',
    tools: ['Notion AI', 'ClickUp'],
    category: 'Productivity',
    searchVolume: '15K+ monthly searches',
    slug: 'notion-ai-vs-clickup'
  },
  {
    id: 'grammarly-vs-quillbot',
    title: 'Grammarly vs QuillBot',
    description: 'AI writing assistants comparison - Grammarly vs QuillBot features and accuracy',
    tools: ['Grammarly', 'QuillBot'],
    category: 'Writing Assistant',
    searchVolume: '40K+ monthly searches',
    slug: 'grammarly-vs-quillbot'
  }
];

// 分类比较
const categoryComparisons = [
  {
    category: 'Conversational AI',
    comparisons: ['ChatGPT vs Claude', 'ChatGPT vs Gemini', 'Claude vs Perplexity']
  },
  {
    category: 'Image Generation',
    comparisons: ['Midjourney vs DALL-E', 'Stable Diffusion vs Midjourney', 'Leonardo AI vs Midjourney']
  },
  {
    category: 'Code Development',
    comparisons: ['GitHub Copilot vs Cursor', 'Codeium vs Copilot', 'Tabnine vs GitHub Copilot']
  },
  {
    category: 'Content Writing',
    comparisons: ['Jasper vs Copy.ai', 'Writesonic vs Jasper', 'ContentBot vs Copy.ai']
  }
];

export default function ComparePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredComparisons, setFilteredComparisons] = useState(popularComparisons);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredComparisons(popularComparisons);
    } else {
      const filtered = popularComparisons.filter(comp =>
        comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.tools.some(tool => tool.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredComparisons(filtered);
    }
  }, [searchQuery]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'AI Tools Comparison - Compare Best AI Software 2025',
    description: 'Compare top AI tools side by side. Find detailed comparisons of ChatGPT vs Claude, Midjourney vs DALL-E, and more AI software with features, pricing, and reviews.',
    url: 'https://www.toolverse.tools/compare',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: popularComparisons.length,
      itemListElement: popularComparisons.map((comp, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          name: comp.title,
          description: comp.description,
          url: `https://www.toolverse.tools/compare/${comp.slug}`
        }
      }))
    }
  };

  return (
    <GlobalLayout>
      <StructuredData type="website" data={structuredData} />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Compare AI Tools' }
            ]} />
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI Tools Comparison 2025 - Compare Best AI Software
            </h1>
            <p className="text-xl opacity-90 max-w-4xl mx-auto mb-8">
              Find detailed side-by-side comparisons of top AI tools. Compare features, pricing, performance, and user reviews to choose the best AI solution for your needs. Updated with latest AI tool comparisons.
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search comparisons (e.g., ChatGPT vs Claude)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 text-lg rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <svg className="absolute right-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular AI Tool Comparisons</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/compare/chatgpt-vs-claude" className="text-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div className="font-semibold text-blue-900">ChatGPT vs Claude</div>
                <div className="text-sm text-blue-600 mt-1">AI Chatbots</div>
              </a>
              <a href="/compare/midjourney-vs-dalle" className="text-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div className="font-semibold text-purple-900">Midjourney vs DALL-E</div>
                <div className="text-sm text-purple-600 mt-1">Image Generation</div>
              </a>
              <a href="/compare/github-copilot-vs-cursor" className="text-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div className="font-semibold text-green-900">Copilot vs Cursor</div>
                <div className="text-sm text-green-600 mt-1">AI Coding</div>
              </a>
              <a href="/compare/grammarly-vs-quillbot" className="text-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <div className="font-semibold text-orange-900">Grammarly vs QuillBot</div>
                <div className="text-sm text-orange-600 mt-1">Writing Tools</div>
              </a>
            </div>
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

        {/* All Comparisons */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              All AI Tool Comparisons ({filteredComparisons.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredComparisons.map((comparison) => (
                <div key={comparison.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        <a href={`/compare/${comparison.slug}`} className="hover:text-primary-600 transition-colors">
                          {comparison.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-3">{comparison.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {comparison.tools.map((tool, index) => (
                          <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                            {tool}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {comparison.category}
                        </span>
                        <span className="text-sm text-gray-500">{comparison.searchVolume}</span>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href={`/compare/${comparison.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium transition-colors"
                  >
                    Read Comparison
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Compare AI Tools by Category
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryComparisons.map((category, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.comparisons.map((comp, compIndex) => (
                      <li key={compIndex}>
                        <a href="#" className="text-primary-600 hover:text-primary-800 text-sm transition-colors">
                          {comp}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Can&apos;t Find the Comparison You Need?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Request a custom AI tool comparison and our experts will create a detailed analysis for you.
            </p>
            <a 
              href="/contact"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium inline-block"
            >
              Request Comparison
            </a>
          </div>
        </section>
      </div>
    </GlobalLayout>
  );
}
