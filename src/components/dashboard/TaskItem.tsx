import { useState } from 'react';
import { CheckSquare, Square, Trash2, Calendar, Clock, X, Check } from 'lucide-react';
import type { Task, Status } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { formatDate, getPriorityBadgeStyle } from '../../utils/formatters';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { updateTaskStatus, deleteTask } = useProjects();
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isCompleted = task.status === 'Completed';
  const isInProgress = task.status === 'In-Progress';
  const priorityStyle = getPriorityBadgeStyle(task.priority);

  const handleToggleStatus = async () => {
    setUpdating(true);
    let nextStatus: Status = 'Pending';
    if (task.status === 'Pending') nextStatus = 'In-Progress';
    else if (task.status === 'In-Progress') nextStatus = 'Completed';
    else if (task.status === 'Completed') nextStatus = 'Pending';

    try {
      await updateTaskStatus(task.id, nextStatus);
    } finally {
      setUpdating(false);
    }
  };

  const handleExecuteDelete = async () => {
    setUpdating(true);
    try {
      await deleteTask(task.id);
    } finally {
      setUpdating(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all duration-200 group flex items-start justify-between gap-3 ${
        isCompleted
          ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 opacity-75'
          : isInProgress
          ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30'
          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
      }`}
    >
      {/* Checkbox & Details */}
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <button
          type="button"
          onClick={handleToggleStatus}
          disabled={updating}
          className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none transition-colors"
          title={`Status: ${task.status}. Click to cycle status.`}
        >
          {isCompleted ? (
            <CheckSquare className="w-5 h-5 text-emerald-500" />
          ) : isInProgress ? (
            <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
          ) : (
            <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
          )}
        </button>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold tracking-tight transition-all ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.title}
            </span>

            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${priorityStyle.bg} ${priorityStyle.text}`}>
              {task.priority}
            </span>

            <button
              onClick={handleToggleStatus}
              type="button"
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition-all ${
                isCompleted
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : isInProgress
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {task.status}
            </button>
          </div>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
              {task.description}
            </p>
          )}

          {task.due_date && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>Due: {formatDate(task.due_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Action Section */}
      <div className="flex items-center gap-1 shrink-0">
        {confirmDelete ? (
          <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 rounded-lg p-1 animate-in fade-in">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 px-1">
              Delete?
            </span>
            <button
              type="button"
              onClick={handleExecuteDelete}
              disabled={updating}
              className="p-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
              title="Confirm Delete"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
