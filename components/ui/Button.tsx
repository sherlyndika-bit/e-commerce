import React from 'react';
import { cn } from '@/lib/utils/formatters';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    xs: 'h-7 px-2.5 text-xs rounded-md gap-1 font-semibold',
    sm: 'h-9 px-3.5 text-xs sm:text-sm rounded-lg gap-1.5 font-semibold',
    md: 'h-10 px-4 text-sm rounded-xl gap-2 font-bold',
    lg: 'h-12 px-6 text-base rounded-xl gap-2.5 font-extrabold tracking-tight',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-sm hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all border border-brand-400/30',
    secondary:
      'bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-950/30 dark:hover:bg-brand-900/50 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/40 transition-colors',
    outline:
      'border-2 border-slate-200 hover:border-brand-500 hover:text-brand-500 bg-transparent text-slate-700 dark:border-slate-800 dark:text-slate-200 dark:hover:border-brand-400 transition-colors',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors',
    danger:
      'bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-colors',
    dark:
      'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-flex items-center justify-center select-none cursor-pointer transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
