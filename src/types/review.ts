// 评论相关类型定义

export interface Review {
  id: string;
  tool_id: string;
  user_nickname: string;
  user_email: string;
  experience_rating: number;      // 使用体验评分 (1-5)
  functionality_rating: number;  // 功能匹配度评分 (1-5) 
  value_rating: number;          // 性价比评分 (1-5)
  comment: string;
  use_case?: string;             // 使用场景描述
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  approved_at?: string;
  overall_rating?: number;       // 计算得出的综合评分
}

export interface ReviewFormData {
  user_nickname: string;
  user_email: string;
  experience_rating: number;
  functionality_rating: number;
  value_rating: number;
  comment: string;
  use_case?: string;
}

export interface ReviewStats {
  tool_id: string;
  total_reviews: number;
  avg_experience_rating: number;
  avg_functionality_rating: number;
  avg_value_rating: number;
  overall_avg_rating: number;
}

export interface ReviewSubmissionResponse {
  success: boolean;
  message: string;
  review?: Review;
  error?: string;
}

// 评分维度定义
export const RATING_DIMENSIONS = {
  experience: {
    key: 'experience_rating' as const,
    label: '使用体验',
    description: '界面友好度、操作便捷性、稳定性等'
  },
  functionality: {
    key: 'functionality_rating' as const,
    label: '功能匹配度', 
    description: '功能完整性、准确性、实用性等'
  },
  value: {
    key: 'value_rating' as const,
    label: '性价比',
    description: '价格合理性、功能价值、投资回报等'
  }
} as const;

export type RatingDimensionKey = keyof typeof RATING_DIMENSIONS;
