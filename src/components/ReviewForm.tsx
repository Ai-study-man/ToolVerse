'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import { ReviewFormData, RATING_DIMENSIONS } from '../types/review';

interface ReviewFormProps {
  toolId: string;
  toolName: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

interface FormErrors {
  user_nickname?: string;
  user_email?: string;
  experience_rating?: string;
  functionality_rating?: string;
  value_rating?: string;
  comment?: string;
  use_case?: string;
}

export default function ReviewForm({ toolId, toolName, onSubmitSuccess, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    user_nickname: '',
    user_email: '',
    experience_rating: 0,
    functionality_rating: 0,
    value_rating: 0,
    comment: '',
    use_case: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.user_nickname.trim()) {
      newErrors.user_nickname = '请输入昵称';
    } else if (formData.user_nickname.length > 20) {
      newErrors.user_nickname = '昵称不能超过20个字符';
    }
    
    if (!formData.user_email.trim()) {
      newErrors.user_email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
      newErrors.user_email = '请输入有效的邮箱地址';
    }
    
    if (formData.experience_rating === 0) {
      newErrors.experience_rating = '请为使用体验评分';
    }
    
    if (formData.functionality_rating === 0) {
      newErrors.functionality_rating = '请为功能匹配度评分';
    }
    
    if (formData.value_rating === 0) {
      newErrors.value_rating = '请为性价比评分';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = '请输入评论内容';
    } else if (formData.comment.length > 200) {
      newErrors.comment = '评论内容不能超过200个字符';
    }
    
    if (formData.use_case && formData.use_case.length > 100) {
      newErrors.use_case = '使用场景描述不能超过100个字符';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tool_id: toolId
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: '评论提交成功！感谢您的反馈，评论将在审核通过后显示。'
        });
        
        // 重置表单
        setFormData({
          user_nickname: '',
          user_email: '',
          experience_rating: 0,
          functionality_rating: 0,
          value_rating: 0,
          comment: '',
          use_case: ''
        });
        
        if (onSubmitSuccess) {
          setTimeout(() => {
            onSubmitSuccess();
          }, 2000);
        }
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.message || '提交失败，请稍后重试'
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: '网络错误，请稍后重试'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRating = (dimension: keyof typeof RATING_DIMENSIONS, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [RATING_DIMENSIONS[dimension].key]: rating
    }));
    
    // 清除对应的错误
    if (errors[RATING_DIMENSIONS[dimension].key]) {
      setErrors(prev => ({
        ...prev,
        [RATING_DIMENSIONS[dimension].key]: undefined
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">分享您的使用体验</h3>
          <p className="text-sm text-gray-600 mt-1">为 {toolName} 评分并写下您的使用感受</p>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {submitMessage && (
        <div className={`mb-6 p-4 rounded-lg ${
          submitMessage.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {submitMessage.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {submitMessage.text}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 用户信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              昵称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.user_nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, user_nickname: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.user_nickname ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="请输入您的昵称"
            />
            {errors.user_nickname && (
              <p className="text-red-500 text-xs mt-1">{errors.user_nickname}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱 <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 font-normal">（不会公开显示）</span>
            </label>
            <input
              type="email"
              value={formData.user_email}
              onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.user_email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@example.com"
            />
            {errors.user_email && (
              <p className="text-red-500 text-xs mt-1">{errors.user_email}</p>
            )}
          </div>
        </div>
        
        {/* 评分维度 */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">请为以下方面评分 <span className="text-red-500">*</span></h4>
          
          {Object.entries(RATING_DIMENSIONS).map(([key, dimension]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg">
              <StarRating
                rating={formData[dimension.key]}
                onRatingChange={(rating) => updateRating(key as keyof typeof RATING_DIMENSIONS, rating)}
                size="lg"
                label={dimension.label}
                description={dimension.description}
              />
              {errors[dimension.key] && (
                <p className="text-red-500 text-xs mt-2">{errors[dimension.key]}</p>
              )}
            </div>
          ))}
        </div>
        
        {/* 使用场景描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            使用场景描述
            <span className="text-xs text-gray-500 font-normal ml-1">
              （选填，详细的使用场景将优先展示）
            </span>
          </label>
          <textarea
            value={formData.use_case}
            onChange={(e) => setFormData(prev => ({ ...prev, use_case: e.target.value }))}
            rows={2}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.use_case ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="例如：用ChatGPT写代码和文档，效率提升了50%"
          />
          {errors.use_case && (
            <p className="text-red-500 text-xs mt-1">{errors.use_case}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {(formData.use_case || '').length}/100
          </p>
        </div>
        
        {/* 详细评论 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            详细评论 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.comment ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="请分享您使用这个工具的真实感受和体验..."
          />
          {errors.comment && (
            <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/200
          </p>
        </div>
        
        {/* 提交按钮 */}
        <div className="flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors ${
              isSubmitting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                提交中...
              </div>
            ) : (
              '提交评论'
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          您的评论将在管理员审核通过后公开显示，感谢您的耐心等待。
        </p>
      </form>
    </div>
  );
}
