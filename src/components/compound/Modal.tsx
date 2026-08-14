import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={twMerge(
          clsx(
            'relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-200 transform scale-100',
            className
          )
        )}
      >
        {children}
      </div>
    </div>
  );
}

Modal.Header = function ModalHeader({
  title,
  subtitle,
  onClose,
  className,
}: {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div className={twMerge(clsx('px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4', className))}>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={twMerge(clsx('p-6 overflow-y-auto max-h-[70vh]', className))}>{children}</div>;
};

Modal.Footer = function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={twMerge(clsx('px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-3', className))}>
      {children}
    </div>
  );
};
