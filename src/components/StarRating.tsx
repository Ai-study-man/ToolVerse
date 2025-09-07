'use client';

import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  label,
  description
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };
  
  const stars = [1, 2, 3, 4, 5];
  
  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };
  
  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };
  
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };
  
  const getRatingText = (rating: number) => {
    if (rating === 0) return '未评分';
    const texts = ['很差', '较差', '一般', '很好', '优秀'];
    return texts[rating - 1];
  };
  
  return (
    <div className={`flex flex-col ${readonly ? '' : 'gap-2'}`}>
      {label && (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {description && (
            <span className="text-xs text-gray-500">{description}</span>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-1">
        {stars.map((star) => {
          const isActive = star <= (hoverRating || rating);
          const isHovered = !readonly && hoverRating >= star;
          
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              className={`
                ${sizeClasses[size]} 
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
                transition-all duration-150
                ${isHovered ? 'transform scale-110' : ''}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded
              `}
            >
              <svg
                viewBox="0 0 20 20"
                fill={isActive ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={isActive ? 0 : 1.5}
                className={`
                  ${isActive ? 'text-yellow-400' : 'text-gray-300'}
                  ${isHovered ? 'text-yellow-500' : ''}
                  transition-colors duration-150
                `}
              >
                <path
                  fillRule="evenodd"
                  d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          );
        })}
        
        {!readonly && (
          <span className={`ml-2 text-sm ${
            hoverRating > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'
          }`}>
            {getRatingText(hoverRating || rating)}
          </span>
        )}
        
        {readonly && rating > 0 && (
          <span className="ml-1 text-sm text-gray-600">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
