import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MetricCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricCard({ children, className }: MetricCardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-200 hover:shadow-md',
          className
        )
      )}
    >
      {children}
    </div>
  );
}

MetricCard.Header = function MetricCardHeader({
  title,
  subtitle,
  icon,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge(clsx('flex items-center justify-between gap-3 mb-3', className))}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {icon && (
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      )}
    </div>
  );
};

MetricCard.Value = function MetricCardValue({
  value,
  badge,
  className,
}: {
  value: string | number;
  badge?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge(clsx('flex items-baseline gap-3', className))}>
      <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </span>
      {badge}
    </div>
  );
};

MetricCard.ProgressBar = function MetricCardProgressBar({
  percent,
  className,
}: {
  percent: number;
  className?: string;
}) {
  const safePercent = Math.min(100, Math.max(0, percent));
  return (
    <div className={twMerge(clsx('mt-4 space-y-1.5', className))}>
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
        <span>Completion Progress</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{safePercent}%</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
};
