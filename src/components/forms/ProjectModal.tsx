import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../compound/Modal';
import { projectSchema, type ProjectFormData } from '../../utils/schemas';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export function ProjectModal({ isOpen, onClose, projectToEdit }: ProjectModalProps) {
  const { addProject, updateProject } = useProjects();
  const isEditing = Boolean(projectToEdit);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
    },
  });

  useEffect(() => {
    if (projectToEdit) {
      setValue('name', projectToEdit.name);
      setValue('description', projectToEdit.description);
      setValue('status', projectToEdit.status);
      setValue('priority', projectToEdit.priority);
    } else {
      reset({
        name: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
      });
    }
  }, [projectToEdit, setValue, reset, isOpen]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditing && projectToEdit) {
        await updateProject(projectToEdit.id, data);
      } else {
        await addProject(data);
      }
      reset();
      onClose();
    } catch (err) {
      // Error handled in context notification
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header
        title={isEditing ? 'Edit Project Details' : 'Create New Warehouse Project'}
        subtitle={isEditing ? 'Update status, priority, or details for this project' : 'Add an initiative for inventory, audit, or logistics'}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Project Name *
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. Zone A Barcode Scanner Upgrade"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Detail the goals and scope of this warehouse project..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description.message}</p>}
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Project Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Priority Level
              </label>
              <select
                {...register('priority')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
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
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
