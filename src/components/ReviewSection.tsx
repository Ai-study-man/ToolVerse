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
    // Refresh review list (by changing key to remount component)
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Review display area */}
      <ReviewDisplay 
        key={refreshKey}
        toolId={toolId} 
        toolName={toolName}
      />
      
      {/* Write review button or review form */}
      {!showForm ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Share Your Experience</h4>
          <p className="text-gray-600 mb-4">
            Your honest review will help other users better understand {toolName}
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Write Review
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
