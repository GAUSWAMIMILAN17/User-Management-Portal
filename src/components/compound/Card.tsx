import React, { createContext } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardContextType {
  variant?: 'default' | 'outline' | 'ghost';
}

const CardContext = createContext<CardContextType>({});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-200 overflow-hidden';
  const variantStyles = {
    default:
      'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700',
    outline: 'border border-slate-300 dark:border-slate-700 bg-transparent',
    ghost: 'bg-slate-50 dark:bg-slate-800/50 border border-transparent',
  };

  return (
    <CardContext.Provider value={{ variant }}>
      <div className={twMerge(clsx(baseStyles, variantStyles[variant], className))} {...props}>
        {children}
      </div>
    </CardContext.Provider>
  );
}

// Card Header
Card.Header = function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('px-6 pt-6 pb-3 flex items-start justify-between gap-4', className))} {...props}>
      {children}
    </div>
  );
};

// Card Title
Card.Title = function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={twMerge(clsx('text-lg font-semibold text-slate-900 dark:text-white tracking-tight', className))} {...props}>
      {children}
    </h3>
  );
};

// Card Subtitle / Description
Card.Subtitle = function CardSubtitle({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={twMerge(clsx('text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2', className))} {...props}>
      {children}
    </p>
  );
};

// Card Body
Card.Body = function CardBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge(clsx('px-6 py-3 text-slate-700 dark:text-slate-300 text-sm', className))} {...props}>
      {children}
    </div>
  );
};

// Card Footer
Card.Footer = function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx('px-6 py-4 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3', className)
      )}
      {...props}
    >
      {children}
    </div>
  );
};
