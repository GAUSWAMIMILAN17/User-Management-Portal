import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        clsx('animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/80', className)
      )}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function SummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}
