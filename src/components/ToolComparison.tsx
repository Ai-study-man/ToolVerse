'use client';

import React, { useState } from 'react';
import { Tool } from '../types';
import ToolImage from './ToolImage';

interface ToolComparisonProps {
  currentTool: Tool;
  relatedTools: Tool[];
  className?: string;
}

// Tool comparison data configuration
const COMPARISON_DATA = {
  'Language & Translation': {
    compareFields: [
      { key: 'pricing', label: 'Pricing Model', type: 'badge' },
      { key: 'languages', label: 'Supported Languages', type: 'number' },
      { key: 'accuracy', label: 'Translation Accuracy', type: 'rating' },
      { key: 'commercial', label: 'Commercial License', type: 'boolean' },
      { key: 'offline', label: 'Offline Support', type: 'boolean' },
      { key: 'api', label: 'API Access', type: 'boolean' }
    ],
    toolData: {
      'DeepL': {
        languages: 31,
        accuracy: 4.8,
        commercial: true,
        offline: false,
        api: true,
        specialFeatures: ['Professional Document Translation', 'Context Understanding', 'CAT Tool Integration']
      },
      'Google Translate': {
        languages: 100,
        accuracy: 4.3,
        commercial: true,
        offline: true,
        api: true,
        specialFeatures: ['Real-time Translation', 'Image Translation', 'Voice Translation']
      },
      'Microsoft Translator': {
        languages: 100,
        accuracy: 4.2,
        commercial: true,
        offline: false,
        api: true,
        specialFeatures: ['Office Integration', 'Live Meeting Translation', 'Custom Terminology']
      },
      'Whisper by OpenAI': {
        languages: 99,
        accuracy: 4.7,
        commercial: true,
        offline: true,
        api: true,
        specialFeatures: ['Speech Recognition', 'Multilingual Transcription', 'Open Source Free']
      },
      'Papago': {
        languages: 15,
        accuracy: 4.5,
        commercial: false,
        offline: false,
        api: false,
        specialFeatures: ['Asian Language Focus', 'Image Translation', 'Handwriting Recognition']
      }
    }
  },
  'Development': {
    compareFields: [
      { key: 'pricing', label: 'Pricing Model', type: 'badge' },
      { key: 'languages', label: 'Programming Languages', type: 'number' },
      { key: 'accuracy', label: 'Code Quality', type: 'rating' },
      { key: 'collaborative', label: 'Team Collaboration', type: 'boolean' },
      { key: 'offline', label: 'Offline Usage', type: 'boolean' },
      { key: 'vscode', label: 'VS Code Support', type: 'boolean' }
    ],
    toolData: {
      'Cursor': {
        languages: 20,
        accuracy: 4.8,
        collaborative: true,
        offline: false,
        vscode: true,
        specialFeatures: ['AI Pair Programming', 'Code Understanding', 'Natural Language Coding']
      },
      'GitHub Copilot': {
        languages: 30,
        accuracy: 4.6,
        collaborative: true,
        offline: false,
        vscode: true,
        specialFeatures: ['Code Completion', 'GitHub Integration', 'Context Awareness']
      },
      'v0 by Vercel': {
        languages: 3,
        accuracy: 4.6,
        collaborative: false,
        offline: false,
        vscode: false,
        specialFeatures: ['UI Generation', 'React Specialization', 'Tailwind Integration']
      },
      'Windsurf': {
        languages: 25,
        accuracy: 4.5,
        collaborative: true,
        offline: true,
        vscode: false,
        specialFeatures: ['Multi-file Editing', 'Code Navigation', 'AI Assistant']
      },
      'Bolt.new': {
        languages: 10,
        accuracy: 4.4,
        collaborative: false,
        offline: false,
        vscode: false,
        specialFeatures: ['Full-stack Development', 'Quick Deployment', 'Natural Language']
      }
    }
  }
};

// Get pricing display styles
const getPricingStyle = (pricing: string) => {
  const lower = pricing.toLowerCase();
  if (lower.includes('free')) return 'bg-green-100 text-green-800 border-green-200';
  if (lower.includes('paid')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (lower.includes('freemium')) return 'bg-purple-100 text-purple-800 border-purple-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
};

// Render rating stars
const renderStars = (rating: number, size = 'sm') => {
  const stars = [];
  const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`${sizeClass} ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  return stars;
};

export default function ToolComparison({ currentTool, relatedTools, className = '' }: ToolComparisonProps) {
  const [selectedTools, setSelectedTools] = useState<string[]>([currentTool.name]);

  // Get current category comparison configuration
  const comparisonConfig = COMPARISON_DATA[currentTool.category as keyof typeof COMPARISON_DATA];
  
  if (!comparisonConfig || !relatedTools.length) return null;

  // Get comparable tools (current tool + 2-3 related tools)
  const availableTools = [currentTool, ...relatedTools].slice(0, 4);
  const compareFields = comparisonConfig.compareFields;

  // Get tool data
  const getToolData = (toolName: string): any => {
    return comparisonConfig.toolData[toolName as keyof typeof comparisonConfig.toolData] || {};
  };

  // Toggle tool selection
  const toggleToolSelection = (toolName: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolName)) {
        return prev.filter(name => name !== toolName);
      } else if (prev.length < 3) {
        return [...prev, toolName];
      }
      return prev;
    });
  };

  // Render cell content
  const renderCellContent = (tool: Tool, field: any) => {
    const toolData = getToolData(tool.name);
    const value = field.key === 'pricing' ? tool.pricing : toolData[field.key];

    switch (field.type) {
      case 'badge':
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPricingStyle(value || '')}`}>
            {value || 'N/A'}
          </span>
        );
      case 'rating':
        const ratingValue = typeof value === 'number' ? value : parseFloat(value) || 0;
        return (
          <div className="flex items-center space-x-1">
            {renderStars(ratingValue)}
            <span className="text-xs text-gray-600 ml-1">{ratingValue}</span>
          </div>
        );
      case 'boolean':
        return value ? (
          <div className="flex items-center text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-sm">Supported</span>
          </div>
        ) : (
          <div className="flex items-center text-red-500">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-sm">Not Supported</span>
          </div>
        );
      case 'number':
        return (
          <div className="text-center">
            <span className="text-lg font-bold text-gray-900">{value || 0}</span>
            <span className="text-xs text-gray-500 ml-1">languages</span>
          </div>
        );
      default:
        return <span className="text-sm text-gray-600">{value || 'N/A'}</span>;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 ${className}`}>
      {/* Title */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tool Comparison</h2>
          <p className="text-gray-600 mt-1">Compare popular tools in the {currentTool.category} category</p>
        </div>
      </div>

      {/* Tool selection */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">Select tools to compare (maximum 3):</p>
        <div className="flex flex-wrap gap-3">
          {availableTools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => toggleToolSelection(tool.name)}
              disabled={!selectedTools.includes(tool.name) && selectedTools.length >= 3}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                selectedTools.includes(tool.name)
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              } ${
                !selectedTools.includes(tool.name) && selectedTools.length >= 3
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
            >
              <ToolImage
                src={tool.logo}
                alt={tool.name}
                name={tool.name}
                className="w-6 h-6 rounded object-contain"
              />
              <span className="text-sm font-medium">{tool.name}</span>
              {selectedTools.includes(tool.name) && (
                <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-semibold text-gray-900 border-b">Features</th>
              {selectedTools.map((toolName) => {
                const tool = availableTools.find(t => t.name === toolName)!;
                return (
                  <th key={toolName} className="text-center p-4 border-b min-w-[150px]">
                    <div className="flex flex-col items-center space-y-2">
                      <ToolImage
                        src={tool.logo}
                        alt={tool.name}
                        name={tool.name}
                        className="w-10 h-10 rounded-lg object-contain"
                      />
                      <div className="text-sm font-semibold text-gray-900">{tool.name}</div>
                      {tool.name === currentTool.name && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          Current Tool
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {compareFields.map((field, index) => (
              <tr key={field.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-4 font-medium text-gray-900 border-b">
                  {field.label}
                </td>
                {selectedTools.map((toolName) => {
                  const tool = availableTools.find(t => t.name === toolName)!;
                  return (
                    <td key={`${toolName}-${field.key}`} className="p-4 text-center border-b">
                      {renderCellContent(tool, field)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feature comparison */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedTools.map((toolName) => {
            const tool = availableTools.find(t => t.name === toolName)!;
            const toolData = getToolData(toolName);
            const specialFeatures = toolData.specialFeatures || tool.features?.slice(0, 3) || [];

            return (
              <div key={toolName} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <ToolImage
                    src={tool.logo}
                    alt={tool.name}
                    name={tool.name}
                    className="w-8 h-8 rounded object-contain"
                  />
                  <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                </div>
                <ul className="space-y-2">
                  {specialFeatures.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selection recommendations */}
      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">Selection Tips</h4>
            <p className="text-sm text-gray-700 mb-3">
              Choose the most suitable tool based on your specific needs and budget. We recommend trying the free version first to confirm the features meet your requirements before upgrading.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                💰 Budget-friendly: Choose free tools
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🏢 Commercial use: Focus on licensing
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                ⚡ Feature-first: Choose highest rated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
