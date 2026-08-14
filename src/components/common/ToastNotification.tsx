import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';

export function ToastNotification() {
  const { notification, clearNotification } = useProjects();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${
          isSuccess
            ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700/50 dark:bg-emerald-950/90 dark:text-emerald-200'
            : 'bg-rose-900/90 text-rose-100 border-rose-700/50 dark:bg-rose-950/90 dark:text-rose-200'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        )}
        <p className="text-sm font-medium pr-2">{notification.message}</p>
        <button
          onClick={clearNotification}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
