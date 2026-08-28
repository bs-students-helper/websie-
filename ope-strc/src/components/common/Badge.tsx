import React from 'react';
import { clsx } from 'clsx';
import { Difficulty } from '../../types/problem';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'difficulty';
  difficulty?: Difficulty;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  difficulty,
  className,
}) => {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'difficulty' && difficulty) {
    if (difficulty === 'Easy') colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
    if (difficulty === 'Medium') colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
    if (difficulty === 'Hard') colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
  } else {
    switch (variant) {
      case 'success':
        colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
        break;
      case 'warning':
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
        break;
      case 'error':
        colorClasses = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800';
        break;
      case 'info':
        colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800';
        break;
    }
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors',
        colorClasses,
        className
      )}
    >
      {children}
    </span>
  );
};
