import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils/formatters';

interface RatingStarsProps {
  rating: number; // 0 - 5
  maxStars?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
}

export function RatingStars({
  rating,
  maxStars = 5,
  size = 'sm',
  showNumber = false,
  reviewCount,
  className,
}: RatingStarsProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    xs: 'text-[11px]',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('inline-flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = rating >= i + 1;
          const half = !filled && rating >= i + 0.3;

          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-300 text-amber-400'
                  : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
              )}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className={cn('font-bold text-slate-800 dark:text-slate-200 ml-0.5', textSizes[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn('text-slate-400 font-normal', textSizes[size])}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
