'use client';

import { useState, useEffect } from 'react';
import { Tool } from '@/types';
import { 
  CheckIcon, 
  XMarkIcon, 
  StarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Breadcrumbs from './Breadcrumbs';
import EnhancedSchema from './EnhancedSchema';
import RelatedTools from './RelatedTools';

interface ComparisonFeature {
  name: string;
  tool1: boolean | string | number;
  tool2: boolean | string | number;
  type: 'boolean' | 'string' | 'number' | 'rating';
  important?: boolean;
}

interface EnhancedComparePageProps {
  tool1: Tool;
  tool2: Tool;
  features?: ComparisonFeature[];
}

export default function EnhancedComparePage({ tool1, tool2, features }: EnhancedComparePageProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonFeature[]>([]);
  const [winner, setWinner] = useState<'tool1' | 'tool2' | 'tie'>('tie');
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (features) {
      setComparisonData(features);
    } else {
      // 生成默认比较特征
      const defaultFeatures: ComparisonFeature[] = [
        {
          name: 'Price',
          tool1: tool1.pricingModel === 'free' ? 'Free' : tool1.pricing,
          tool2: tool2.pricingModel === 'free' ? 'Free' : tool2.pricing,
          type: 'string',
          important: true
        },
        {
          name: 'User Rating',
          tool1: tool1.rating || 0,
          tool2: tool2.rating || 0,
          type: 'rating',
          important: true
        },
        {
          name: 'Free Plan',
          tool1: tool1.pricingModel === 'free' || tool1.pricingModel === 'freemium',
          tool2: tool2.pricingModel === 'free' || tool2.pricingModel === 'freemium',
          type: 'boolean',
          important: true
        },
        {
          name: 'Likes',
          tool1: tool1.likes || 0,
          tool2: tool2.likes || 0,
          type: 'number'
        },
        {
          name: 'Views',
          tool1: tool1.views || 0,
          tool2: tool2.views || 0,
          type: 'number'
        },
        {
          name: 'Developer',
          tool1: tool1.developer || 'Unknown',
          tool2: tool2.developer || 'Unknown',
          type: 'string'
        }
      ];
      setComparisonData(defaultFeatures);
    }
  }, [tool1, tool2, features]);

  useEffect(() => {
    // 计算获胜者
    let tool1Score = 0;
    let tool2Score = 0;

    comparisonData.forEach(feature => {
      const weight = feature.important ? 2 : 1;
      
      if (feature.type === 'boolean') {
        if (feature.tool1 && !feature.tool2) tool1Score += weight;
        else if (feature.tool2 && !feature.tool1) tool2Score += weight;
      } else if (feature.type === 'number' || feature.type === 'rating') {
        const val1 = Number(feature.tool1) || 0;
        const val2 = Number(feature.tool2) || 0;
        if (val1 > val2) tool1Score += weight;
        else if (val2 > val1) tool2Score += weight;
      }
    });

    if (tool1Score > tool2Score) setWinner('tool1');
    else if (tool2Score > tool1Score) setWinner('tool2');
    else setWinner('tie');
  }, [comparisonData]);

  const renderFeatureValue = (value: boolean | string | number, type: string) => {
    if (type === 'boolean') {
      return value ? (
        <div className="flex items-center text-green-600">
          <CheckIcon className="w-5 h-5 mr-1" />
          Yes
        </div>
      ) : (
        <div className="flex items-center text-red-600">
          <XMarkIcon className="w-5 h-5 mr-1" />
          No
        </div>
      );
    }
    
    if (type === 'rating') {
      const rating = Number(value) || 0;
      return (
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            star <= rating ? (
              <StarIconSolid key={star} className="w-4 h-4 text-yellow-400" />
            ) : (
              <StarIcon key={star} className="w-4 h-4 text-gray-300" />
            )
          ))}
          <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
        </div>
      );
    }
    
    return <span className="text-gray-900">{value}</span>;
  };

  const getWinnerBadge = (toolId: 'tool1' | 'tool2') => {
    if (winner === toolId) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Winner
        </span>
      );
    }
    return null;
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Tools', href: '/tools' },
    { label: 'Compare', href: '/compare' },
    { label: `${tool1.name} vs ${tool2.name}` }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org structured data */}
      <EnhancedSchema schemas={[
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${tool1.name} vs ${tool2.name} Comparison`,
          description: `Compare ${tool1.name} and ${tool2.name} features, pricing, and capabilities`,
          offers: [
            {
              '@type': 'Offer',
              name: tool1.name,
              price: tool1.pricing,
              priceCurrency: 'USD'
            },
            {
              '@type': 'Offer',
              name: tool2.name,
              price: tool2.pricing,
              priceCurrency: 'USD'
            }
          ]
        }
      ]} />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {tool1.name} vs {tool2.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compare features, pricing, and capabilities of these AI tools to make the best choice for your needs.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md mx-auto">
          {['overview', 'features', 'pricing'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeSection === section
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Tool Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {[tool1, tool2].map((tool, index) => (
            <div key={tool.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={tool.logo}
                    alt={`${tool.name} logo`}
                    className="w-12 h-12 rounded-lg mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
                    <p className="text-gray-600">{tool.category}</p>
                  </div>
                </div>
                {getWinnerBadge(index === 0 ? 'tool1' : 'tool2')}
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">{tool.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <StarIcon className="w-4 h-4 mr-1" />
                  Rating: {tool.rating?.toFixed(1) || 'N/A'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                  {tool.pricingModel === 'free' ? 'Free' : tool.pricing}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  {tool.likes || 0} likes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ChartBarIcon className="w-4 h-4 mr-1" />
                  {tool.views || 0} views
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Visit {tool.name}
              </a>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        {activeSection === 'features' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tool1.name}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {tool2.name}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {comparisonData.map((feature, index) => (
                    <tr key={index} className={feature.important ? 'bg-yellow-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feature.name}
                        {feature.important && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Important
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {renderFeatureValue(feature.tool1, feature.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {renderFeatureValue(feature.tool2, feature.type)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pricing Comparison */}
        {activeSection === 'pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[tool1, tool2].map((tool) => (
              <div key={tool.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">{tool.name} Pricing</h3>
                  <div className="mt-2">
                    {(tool.pricingModel === 'free' || tool.pricingModel === 'freemium') && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Free Plan Available
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {tool.pricing || 'Contact for pricing'}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {tool.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Winner Summary */}
        {activeSection === 'overview' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comparison Summary</h2>
            {winner === 'tie' ? (
              <div className="text-center py-4">
                <p className="text-gray-700">
                  Both tools have their strengths. The best choice depends on your specific needs and preferences.
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-700 mb-2">
                  Based on the comparison criteria, <strong>{winner === 'tool1' ? tool1.name : tool2.name}</strong> comes out ahead.
                </p>
                <p className="text-sm text-gray-600">
                  However, consider your specific requirements before making a decision.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Related Tools */}
        <RelatedTools 
          currentTool={tool1} 
          maxItems={4}
          title="Other AI Tools to Consider"
        />
      </div>
    </div>
  );
}
