'use client';

import React, { useState } from 'react';
import { Tool, PricingTier, ContactPricing } from '../types';

interface PricingDisplayProps {
  tool: Tool;
  className?: string;
}

export default function PricingDisplay({ tool, className = '' }: PricingDisplayProps) {
  const [selectedTier, setSelectedTier] = useState<number>(0);

  // 如果有详细价格信息，显示增强版价格组件
  if (tool.pricingTiers && tool.pricingTiers.length > 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Pricing Plans
          </h3>
          
          {/* 价格层级选择 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {tool.pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  tier.highlighted 
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' 
                    : selectedTier === index
                    ? 'border-primary-300 bg-primary-25'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTier(index)}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">{tier.name}</h4>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{tier.price}</div>
                  {tier.limits && tier.limits.length > 0 && (
                    <p className="text-xs text-gray-500">{tier.limits[0]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 选中层级的详细功能 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              {tool.pricingTiers[selectedTier].name} Features:
            </h4>
            <ul className="space-y-2">
              {tool.pricingTiers[selectedTier].features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            {tool.pricingTiers[selectedTier].limits && tool.pricingTiers[selectedTier].limits!.length > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-700 mb-2">Usage Limits:</h5>
                <ul className="space-y-1">
                  {tool.pricingTiers[selectedTier].limits!.slice(1).map((limit, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{limit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 功能对比表 */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Feature Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600">Feature</th>
                    {tool.pricingTiers.map((tier, index) => (
                      <th key={index} className="text-center py-2 px-3 text-gray-600">{tier.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getAllFeatures(tool.pricingTiers).map((feature, featureIndex) => (
                    <tr key={featureIndex} className="border-b border-gray-100">
                      <td className="py-2 text-gray-700">{feature}</td>
                      {tool.pricingTiers!.map((tier, tierIndex) => (
                        <td key={tierIndex} className="text-center py-2 px-3">
                          {tier.features.includes(feature) ? (
                            <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果有联系询价信息，显示联系询价组件
  if (tool.contactPricing) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Pricing Information
          </h3>
          
          <ContactPricingCard contactPricing={tool.contactPricing} />
        </div>
      </div>
    );
  }

  // fallback到简单价格显示
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing</h3>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-2">{tool.pricing}</div>
          <p className="text-gray-600">Visit the official website for detailed pricing information</p>
        </div>
      </div>
    </div>
  );
}

// 联系询价卡片组件
function ContactPricingCard({ contactPricing }: { contactPricing: ContactPricing }) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'range':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'quote':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09m6.291-4.09L12 12m0 0l-1 1m1-1l1 1" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'range': return 'bg-blue-50 border-blue-200';
      case 'quote': return 'bg-green-50 border-green-200';
      default: return 'bg-primary-50 border-primary-200';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getTypeColor(contactPricing.type)}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getTypeIcon(contactPricing.type)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">
            {contactPricing.type === 'range' ? 'Price Range' : 
             contactPricing.type === 'quote' ? 'Custom Quote' : 'Contact for Pricing'}
          </h4>
          
          <p className="text-gray-700 mb-4">{contactPricing.description}</p>
          
          {contactPricing.priceRange && (
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <div className="text-lg font-semibold text-gray-900">{contactPricing.priceRange}</div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactPricing.contactMethod && (
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-sm font-medium text-gray-700">Contact Method</div>
                  <div className="text-sm text-gray-600">{contactPricing.contactMethod}</div>
                </div>
              </div>
            )}
            
            {contactPricing.responseTime && (
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="text-sm font-medium text-gray-700">Response Time</div>
                  <div className="text-sm text-gray-600">{contactPricing.responseTime}</div>
                </div>
              </div>
            )}
          </div>
          
          {contactPricing.requirements && contactPricing.requirements.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Information Required:</div>
              <ul className="space-y-1">
                {contactPricing.requirements.map((req, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 获取所有功能的辅助函数
function getAllFeatures(tiers: PricingTier[]): string[] {
  const allFeatures = new Set<string>();
  tiers.forEach(tier => {
    tier.features.forEach(feature => allFeatures.add(feature));
  });
  return Array.from(allFeatures);
}
