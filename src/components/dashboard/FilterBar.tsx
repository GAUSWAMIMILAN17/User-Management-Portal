import { Search, Filter, ArrowUpDown, RotateCcw, Plus } from 'lucide-react';
import type { Status, Priority } from '../../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: Status | 'All';
  onStatusChange: (status: Status | 'All') => void;
  priorityFilter: Priority | 'All';
  onPriorityChange: (priority: Priority | 'All') => void;
  sortBy: 'name' | 'created_at' | 'status';
  onSortByChange: (sort: 'name' | 'created_at' | 'status') => void;
  onResetFilters: () => void;
  onOpenNewProjectModal: () => void;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  sortBy,
  onSortByChange,
  onResetFilters,
  onOpenNewProjectModal,
}: FilterBarProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'All' || priorityFilter !== 'All';

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Debounced Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by name or description (debounced)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              Debouncing
            </span>
          )}
        </div>

        {/* Action Controls Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as Status | 'All')}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value as Priority | 'All')}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="created_at">Date Created</option>
              <option value="name">Project Name</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              type="button"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* New Project Button */}
          <button
            onClick={onOpenNewProjectModal}
            type="button"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>
    </div>
  );
}
