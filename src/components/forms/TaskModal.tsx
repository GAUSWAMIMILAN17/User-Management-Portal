import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../compound/Modal';
import { taskSchema, type TaskFormData } from '../../utils/schemas';
import { useProjects } from '../../hooks/useProjects';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export function TaskModal({ isOpen, onClose, defaultProjectId }: TaskModalProps) {
  const { projects, addTask } = useProjects();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      projectId: defaultProjectId || (projects[0]?.id ?? ''),
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (defaultProjectId) {
      setValue('projectId', defaultProjectId);
    } else if (projects.length > 0) {
      setValue('projectId', projects[0].id);
    }
  }, [defaultProjectId, projects, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      await addTask(data);
      reset();
      onClose();
    } catch (err) {
      // Notification handled in context
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title="Add New Task" subtitle="Create an action item for a warehouse project" onClose={onClose} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="space-y-4">
          {/* Target Project Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Select Project *
            </label>
            <select
              {...register('projectId')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.projectId.message}</p>}
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Task Title *
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. Inspect Rack #4 Safety Latches"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Description / Notes
            </label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="Optional notes or instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status, Priority, Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Pending</option>
                <option value="In-Progress" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">In-Progress</option>
                <option value="Completed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Low</option>
                <option value="Medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Medium</option>
                <option value="High" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Due Date
              </label>
              <input
                {...register('dueDate')}
                type="date"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Task'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
