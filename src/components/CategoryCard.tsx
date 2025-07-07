import React from 'react';
import * as Icons from 'lucide-react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  completedCount: number;
  onSelect: (categoryId: string) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  completedCount, 
  onSelect 
}) => {
  const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  const progressPercentage = (completedCount / category.questionCount) * 100;

  return (
    <div
      onClick={() => onSelect(category.id)}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-gray-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${category.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
          <IconComponent className={`w-6 h-6 ${category.color.replace('bg-', 'text-')}`} />
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progress</div>
          <div className="text-lg font-semibold text-gray-900">
            {completedCount}/{category.questionCount}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {category.name}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {category.description}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Completion</span>
          <span className="font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${category.color} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">{category.questionCount} questions</span>
          <span className="text-blue-600 font-medium group-hover:text-blue-700">
            Start Practice →
          </span>
        </div>
      </div>
    </div>
  );
};