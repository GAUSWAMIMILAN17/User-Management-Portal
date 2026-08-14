import { Warehouse, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { ThemeToggle } from '../common/ThemeToggle';
import { getInitials } from '../../utils/formatters';

export function Header() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.full_name);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Logistics Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Warehouse Operations & Project Management
            </p>
          </div>
        </div>

        {/* Right Section: User Badge, Theme Toggle & Sign Out */}
        <div className="flex items-center gap-3">
          {/* User Profile Badge */}
          <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-inner">
              {initials}
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
                {user.full_name}
              </div>
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3 h-3 text-emerald-500" />
                <span>{user.role}</span>
              </div>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 transition-all duration-150"
            title="Sign Out of Portal"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
