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
    sm: 'h-8 px-3 text-xs rounded-md gap-1.5 font-semibold',
    md: 'h-9 px-4 text-xs sm:text-sm rounded-lg gap-2 font-bold',
    lg: 'h-11 px-5 text-sm sm:text-base rounded-lg gap-2.5 font-bold',
  };

  const variantStyles = {
    primary:
      'bg-pink-600 hover:bg-pink-700 text-white shadow-2xs transition-colors',
    secondary:
      'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 transition-colors',
    outline:
      'border border-slate-300 hover:border-pink-600 hover:text-pink-600 bg-white text-slate-700 transition-colors',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 transition-colors',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs transition-colors',
    dark:
      'bg-slate-900 hover:bg-slate-800 text-white transition-colors',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'relative inline-flex items-center justify-center select-none cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
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
