import type { Status, Priority } from '../types';

export function formatDate(dateString?: string): string {
  if (!dateString) return 'No due date';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusBadgeStyle(status: Status): {
  bg: string;
  text: string;
  dot: string;
  border: string;
} {
  switch (status) {
    case 'Completed':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-300',
        dot: 'bg-emerald-500',
        border: 'border-emerald-500/30',
      };
    case 'In-Progress':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-300',
        dot: 'bg-amber-500',
        border: 'border-amber-500/30',
      };
    case 'Pending':
    default:
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-700 dark:text-slate-300',
        dot: 'bg-slate-400',
        border: 'border-slate-500/30',
      };
  }
}

export function getPriorityBadgeStyle(priority: Priority): {
  bg: string;
  text: string;
} {
  switch (priority) {
    case 'High':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20',
        text: 'text-rose-700 dark:text-rose-300',
      };
    case 'Medium':
      return {
        bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
        text: 'text-indigo-700 dark:text-indigo-300',
      };
    case 'Low':
    default:
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-500/20',
        text: 'text-slate-600 dark:text-slate-400',
      };
  }
}

export function getInitials(name: string): string {
  if (!name) return 'WM';
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
