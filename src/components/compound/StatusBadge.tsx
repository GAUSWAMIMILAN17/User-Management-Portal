import React, { createContext, useContext } from 'react';
import type { Status } from '../../types';
import { getStatusBadgeStyle } from '../../utils/formatters';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StatusBadgeContextType {
  status: Status;
  style: ReturnType<typeof getStatusBadgeStyle>;
}

const StatusBadgeContext = createContext<StatusBadgeContextType | undefined>(undefined);

interface StatusBadgeProps {
  status: Status;
  children?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const style = getStatusBadgeStyle(status);

  return (
    <StatusBadgeContext.Provider value={{ status, style }}>
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors',
            style.bg,
            style.text,
            style.border,
            className
          )
        )}
      >
        {children || (
          <>
            <StatusBadge.Dot />
            <StatusBadge.Text />
          </>
        )}
      </span>
    </StatusBadgeContext.Provider>
  );
}

StatusBadge.Dot = function StatusBadgeDot({ className }: { className?: string }) {
  const context = useContext(StatusBadgeContext);
  if (!context) return null;
  return <span className={twMerge(clsx('w-2 h-2 rounded-full animate-pulse', context.style.dot, className))} />;
};

StatusBadge.Text = function StatusBadgeText({ className }: { className?: string }) {
  const context = useContext(StatusBadgeContext);
  if (!context) return null;
  return <span className={twMerge(clsx('capitalize tracking-wide', className))}>{context.status}</span>;
};
