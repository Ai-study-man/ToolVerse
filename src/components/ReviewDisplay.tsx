'use client';

import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { Review, ReviewStats, RATING_DIMENSIONS } from '../types/review';

interface ReviewDisplayProps {
  toolId: string;
  toolName: string;
  className?: string;
}

interface ReviewsData {
  reviews: Review[];
  stats: ReviewStats;
  total: number;
}

export default function ReviewDisplay({ toolId, toolName, className = '' }: ReviewDisplayProps) {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_desc' | 'rating_asc' | 'use_case_first'>('use_case_first');

  useEffect(() => {
    fetchReviews();
  }, [toolId, sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${toolId}?sort=${sortBy}`);
      const result = await response.json();
      
      if (result.success) {
        setReviewsData(result.data);
        setError(null);
      } else {
        setError(result.message || '加载评论失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getOverallRating = (review: Review) => {
    return Math.round((review.experience_rating + review.functionality_rating + review.value_rating) / 3 * 10) / 10;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchReviews}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">用户评论</h3>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">暂无用户评论</h4>
          <p className="text-gray-600">成为第一个分享 {toolName} 使用体验的用户</p>
        </div>
      </div>
    );
  }

  const { reviews, stats } = reviewsData;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      {/* 标题和统计信息 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">用户评论</h3>
          <p className="text-sm text-gray-600 mt-1">{reviewsData.total} 条真实用户评价</p>
        </div>
        
        {/* 平均评分显示 */}
        <div className="mt-4 sm:mt-0 flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.overall_avg_rating.toFixed(1)}</div>
            <StarRating rating={stats.overall_avg_rating} readonly size="sm" />
            <div className="text-xs text-gray-500 mt-1">综合评分</div>
          </div>
        </div>
      </div>

      {/* 详细评分统计 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{stats.avg_experience_rating.toFixed(1)}</div>
          <StarRating rating={stats.avg_experience_rating} readonly size="sm" />
          <div className="text-xs text-gray-600 mt-1">{RATING_DIMENSIONS.experience.label}</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{stats.avg_functionality_rating.toFixed(1)}</div>
          <StarRating rating={stats.avg_functionality_rating} readonly size="sm" />
          <div className="text-xs text-gray-600 mt-1">{RATING_DIMENSIONS.functionality.label}</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{stats.avg_value_rating.toFixed(1)}</div>
          <StarRating rating={stats.avg_value_rating} readonly size="sm" />
          <div className="text-xs text-gray-600 mt-1">{RATING_DIMENSIONS.value.label}</div>
        </div>
      </div>

      {/* 排序选项 */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          共 {reviews.length} 条评论
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="use_case_first">使用场景优先</option>
          <option value="newest">最新发布</option>
          <option value="oldest">最早发布</option>
          <option value="rating_desc">评分从高到低</option>
          <option value="rating_asc">评分从低到高</option>
        </select>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            {/* 评论头部 */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  {review.user_nickname.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{review.user_nickname}</div>
                  <div className="text-sm text-gray-500">{formatDate(review.created_at)}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">
                  {getOverallRating(review)}
                </div>
                <StarRating 
                  rating={getOverallRating(review)} 
                  readonly 
                  size="sm"
                />
              </div>
            </div>

            {/* 使用场景标签（如果有） */}
            {review.use_case && (
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  使用场景: {review.use_case}
                </span>
              </div>
            )}

            {/* 评论内容 */}
            <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

            {/* 详细评分 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{RATING_DIMENSIONS.experience.label}:</span>
                <StarRating rating={review.experience_rating} readonly size="sm" />
                <span className="text-gray-800 font-medium">{review.experience_rating}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{RATING_DIMENSIONS.functionality.label}:</span>
                <StarRating rating={review.functionality_rating} readonly size="sm" />
                <span className="text-gray-800 font-medium">{review.functionality_rating}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{RATING_DIMENSIONS.value.label}:</span>
                <StarRating rating={review.value_rating} readonly size="sm" />
                <span className="text-gray-800 font-medium">{review.value_rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多按钮（如果需要分页） */}
      {reviewsData.total > reviews.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => {/* 实现加载更多逻辑 */}}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            查看更多评论
          </button>
        </div>
      )}
    </div>
  );
}
