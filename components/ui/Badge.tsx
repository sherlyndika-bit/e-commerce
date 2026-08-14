import React from 'react';
import { cn } from '@/lib/utils/formatters';
import { ShieldCheck, Star, Zap, Truck, Sparkles, Award } from 'lucide-react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'official' | 'star' | 'flash' | 'free_shipping' | 'discount' | 'coin' | 'lokal' | 'neutral' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md';
  children?: React.ReactNode;
}

export function Badge({ variant = 'neutral', size = 'sm', className, children, ...props }: BadgeProps) {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded gap-0.5 font-semibold',
    sm: 'text-xs px-2 py-0.5 rounded-md gap-1 font-semibold',
    md: 'text-sm px-2.5 py-1 rounded-lg gap-1.5 font-bold',
  };

  const variantStyles = {
    official: 'bg-emerald-600 text-white shadow-xs',
    star: 'bg-amber-500 text-white shadow-xs',
    flash: 'bg-gradient-to-r from-red-600 to-brand-500 text-white animate-pulse',
    free_shipping: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
    discount: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
    coin: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900',
    lokal: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-white',
    danger: 'bg-rose-500 text-white',
  };

  const getIcon = () => {
    switch (variant) {
      case 'official':
        return <ShieldCheck className="w-3 h-3 stroke-[2.5]" />;
      case 'star':
        return <Star className="w-3 h-3 fill-current stroke-none" />;
      case 'flash':
        return <Zap className="w-3 h-3 fill-current stroke-none" />;
      case 'free_shipping':
        return <Truck className="w-3 h-3" />;
      case 'coin':
        return <Sparkles className="w-3 h-3" />;
      case 'lokal':
        return <Award className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center tracking-tight transition-all',
        sizeClasses[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {getIcon()}
      {children}
    </span>
  );
}
