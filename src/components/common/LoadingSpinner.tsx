import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', label, className }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={twMerge(clsx('flex flex-col items-center justify-center gap-3 p-4', className))}>
      <Loader2 className={clsx('animate-spin text-indigo-600 dark:text-indigo-400', sizeMap[size])} />
      {label && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">{label}</p>}
    </div>
  );
}
