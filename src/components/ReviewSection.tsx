'use client';

import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewDisplay from './ReviewDisplay';

interface ReviewSectionProps {
  toolId: string;
  toolName: string;
  className?: string;
}

export default function ReviewSection({ toolId, toolName, className = '' }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmitSuccess = () => {
    setShowForm(false);
    // 刷新评论列表（通过改变key来重新挂载组件）
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 评论显示区域 */}
      <ReviewDisplay 
        key={refreshKey}
        toolId={toolId} 
        toolName={toolName}
      />
      
      {/* 写评论按钮或评论表单 */}
      {!showForm ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">分享您的使用体验</h4>
          <p className="text-gray-600 mb-4">
            您的真实评价将帮助其他用户更好地了解 {toolName}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            写评论
          </button>
        </div>
      ) : (
        <ReviewForm
          toolId={toolId}
          toolName={toolName}
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
