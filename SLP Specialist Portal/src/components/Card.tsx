import React from 'react';
import { cn } from '../lib/utils';

interface CardProps {
  category: any; // Using any for now, should be replaced with proper type
  index: number;
  isAdminMode?: boolean;
  onAddResource?: (categoryId: string, subTitle?: string) => void;
  onClick: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  category, 
  onClick, 
  className 
}) => {
  const Icon = category.icon;
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-lg transition-all",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={cn("p-3 rounded-xl", category.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{category.title}</h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
    </div>
  );
};
