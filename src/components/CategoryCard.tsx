'use client';

import React, { memo } from 'react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  icon: string;
  toolCount: number;
  onClick: () => void;
}

const CategoryCard = memo(({ category, icon, toolCount, onClick }: CategoryCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-primary-200"
    >
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {category.name}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">
        {category.description}
      </p>
      <span className="text-sm text-primary-600 font-medium group-hover:text-primary-700">
        {toolCount} tools →
      </span>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;
