'use client';

import React from 'react';
import { Tool } from '../types';

interface UseCaseSectionProps {
  tool: Tool;
  className?: string;
}

// Use case scenario configuration data
const USE_CASE_SCENARIOS = {
  'DeepL': [
    {
      title: 'Professional Document Translation',
      description: 'Accurately translate business contracts, technical documents, and academic papers while maintaining professional tone and contextual accuracy',
      icon: '📄',
      example: 'Translate English technical whitepapers into Chinese while preserving technical terminology accuracy'
    },
    {
      title: 'Multilingual Business Communication',
      description: 'Real-time translation of business emails and meeting minutes, supporting precise communication in 31 languages',
      icon: '💼',
      example: 'Real-time translation of cooperation agreement terms during Chinese-German business negotiations'
    },
    {
      title: 'Academic Research Support',
      description: 'Assist researchers in reading foreign literature with translation quality approaching human-level standards',
      icon: '🎓',
      example: 'Translate German medical research papers into English while maintaining academic rigor'
    }
  ],
  'Cursor': [
    {
      title: 'AI Pair Programming',
      description: 'Collaborate with AI assistants in real-time coding, providing intelligent code suggestions and auto-completion features',
      icon: '👥',
      example: 'AI automatically suggests best practices and optimization solutions when developing React components'
    },
    {
      title: 'Code Refactoring Optimization',
      description: 'Intelligently identify code issues and provide refactoring suggestions, automatically optimizing code structure and performance',
      icon: '⚡',
      example: 'Automatically refactor redundant JavaScript functions to improve code readability'
    },
    {
      title: 'Natural Language Programming',
      description: 'Describe functional requirements in natural language, AI automatically generates corresponding code implementation',
      icon: '💬',
      example: 'Describe "create user login form" and automatically generate complete frontend components'
    }
  ],
  'v0 by Vercel': [
    {
      title: 'Rapid Prototype Design',
      description: 'Quickly generate interactive UI prototypes through text descriptions, accelerating the product design process',
      icon: '⚡',
      example: 'Describe "e-commerce product card" to generate components with images, prices, and buttons'
    },
    {
      title: 'React Component Generation',
      description: 'Automatically generate React components that meet modern frontend standards, integrated with Tailwind CSS styling',
      icon: '⚛️',
      example: 'Generate responsive navigation bar components that automatically adapt to mobile devices'
    },
    {
      title: 'Design to Code Conversion',
      description: 'Quickly transform design ideas into deployable frontend code, improving development efficiency',
      icon: '🎨',
      example: 'Generate complete login page based on wireframe description'
    }
  ],
  'Murf AI': [
    {
      title: 'Short Video Dubbing',
      description: 'Generate professional-grade AI voice dubbing for TikTok, YouTube Shorts and other short video content',
      icon: '🎬',
      example: 'Generate clear, emotional voice-over dubbing for product introduction videos'
    },
    {
      title: 'Podcast Production',
      description: 'Create high-quality podcast content with support for multiple tones and speed adjustments, suitable for long-form content',
      icon: '🎙️',
      example: 'Produce weekly tech podcasts using AI hosts for news broadcasting'
    },
    {
      title: 'Corporate Training Audio',
      description: 'Batch generate corporate training course audio with multilingual support and personalized voice customization',
      icon: '🏢',
      example: 'Generate standardized instructional audio for employee safety training courses'
    }
  ]
};

// Get use cases by tool name, generate from tool data if no predefined cases exist
const getUseCases = (tool: Tool) => {
  // First check if there are predefined use cases
  if (USE_CASE_SCENARIOS[tool.name as keyof typeof USE_CASE_SCENARIOS]) {
    return USE_CASE_SCENARIOS[tool.name as keyof typeof USE_CASE_SCENARIOS];
  }

  // If no predefined cases, generate from tool's useCases or features field
  const useCases = tool.useCases || tool.features || [];
  const fallbackScenarios = useCases.slice(0, 3).map((useCase, index) => ({
    title: useCase,
    description: `Leverage the powerful capabilities of ${tool.name} to achieve intelligent solutions for ${useCase}, improving work efficiency.`,
    icon: ['🎯', '⚡', '🚀'][index] || '✨',
    example: `Apply ${tool.name} for ${useCase} task processing in real projects`
  }));

  return fallbackScenarios;
};

export default function UseCaseSection({ tool, className = '' }: UseCaseSectionProps) {
  const useCases = getUseCases(tool);

  if (!useCases.length) return null;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 ${className}`}>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Use Cases</h2>
          <p className="text-gray-600 mt-1">Explore real-world applications of {tool.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => (
          <div 
            key={index} 
            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full -mr-10 -mt-10 opacity-60"></div>
            
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center text-2xl mr-4 group-hover:shadow-md transition-shadow">
                  {useCase.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {useCase.title}
                </h3>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {useCase.description}
              </p>
              
              <div className="bg-primary-50 rounded-lg p-3 border-l-4 border-primary-500">
                <p className="text-xs text-primary-700">
                  <span className="font-medium">Example:</span>
                  {useCase.example}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Tips */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">Ready to Get Started?</h4>
            <p className="text-sm text-gray-600 mb-4">
              {tool.name} provides powerful AI support for your workflow. Choose the most suitable use case based on your specific needs.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Try Now
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <button className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                View More Cases
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
