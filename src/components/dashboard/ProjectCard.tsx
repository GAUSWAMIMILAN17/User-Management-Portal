import { useState } from 'react';
import { Plus, Trash2, Edit3, ListTodo, ChevronDown, ChevronUp, FolderKanban, Check, X } from 'lucide-react';
import type { ProjectWithStats, Task, Status, Priority } from '../../types';
import { Card } from '../compound/Card';
import { TaskItem } from './TaskItem';
import { getPriorityBadgeStyle, getStatusBadgeStyle } from '../../utils/formatters';
import { useProjects } from '../../hooks/useProjects';

interface ProjectCardProps {
  project: ProjectWithStats;
  tasks: Task[];
  onAddTask: (projectId: string) => void;
  onEditProject?: (project: ProjectWithStats) => void;
}

export function ProjectCard({ project, tasks, onAddTask, onEditProject }: ProjectCardProps) {
  const { updateProject, deleteProject } = useProjects();
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const priorityStyle = getPriorityBadgeStyle(project.priority);
  const statusStyle = getStatusBadgeStyle(project.status);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    setUpdating(true);
    try {
      await updateProject(project.id, { status: newStatus });
    } finally {
      setUpdating(false);
    }
  };

  const handlePriorityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as Priority;
    setUpdating(true);
    try {
      await updateProject(project.id, { priority: newPriority });
    } finally {
      setUpdating(false);
    }
  };

  const handleExecuteDeleteProject = async () => {
    setDeleting(true);
    try {
      await deleteProject(project.id);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <Card className="flex flex-col justify-between">
      <div>
        {/* Header */}
        <Card.Header>
          <div className="space-y-2 flex-1 min-w-0">
            {/* Interactive Status & Priority Selectors */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Interactive Status Select Dropdown Badge */}
              <div className={`relative inline-flex items-center rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                <span className={`w-2 h-2 rounded-full ml-2.5 animate-pulse ${statusStyle.dot}`} />
                <select
                  value={project.status}
                  onChange={handleStatusChange}
                  disabled={updating}
                  className="bg-transparent pl-1.5 pr-6 py-0.5 text-xs font-semibold appearance-none cursor-pointer focus:outline-none capitalize"
                  title="Click to update project status"
                >
                  <option value="Pending" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Pending</option>
                  <option value="In-Progress" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">In-Progress</option>
                  <option value="Completed" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Completed</option>
                </select>
                <ChevronDown className="w-3 h-3 absolute right-2 pointer-events-none opacity-60" />
              </div>

              {/* Interactive Priority Select Dropdown Badge */}
              <div className={`relative inline-flex items-center rounded-full text-[10px] font-extrabold uppercase tracking-wider ${priorityStyle.bg} ${priorityStyle.text}`}>
                <select
                  value={project.priority}
                  onChange={handlePriorityChange}
                  disabled={updating}
                  className="bg-transparent px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider appearance-none cursor-pointer focus:outline-none"
                  title="Click to update priority"
                >
                  <option value="High" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">High Priority</option>
                  <option value="Medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Medium Priority</option>
                  <option value="Low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Low Priority</option>
                </select>
              </div>
            </div>

            <Card.Title className="truncate">{project.name}</Card.Title>
          </div>

          {/* Edit & Delete Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {onEditProject && (
              <button
                type="button"
                onClick={() => onEditProject(project)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                title="Edit Project Details"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {confirmDelete ? (
              <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 rounded-xl p-1.5 animate-in fade-in">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Delete?
                </span>
                <button
                  type="button"
                  onClick={handleExecuteDeleteProject}
                  disabled={deleting}
                  className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                  title="Confirm Delete Project"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
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
                title="Delete Project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </Card.Header>

        {/* Body */}
        <Card.Body className="space-y-4">
          <Card.Subtitle>{project.description || 'No description provided.'}</Card.Subtitle>

          {/* Progress Mini Bar */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5 text-indigo-500" />
                Tasks Progress
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {project.completedTasks} / {project.totalTasks} ({project.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Tasks Accordion Section */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTasksExpanded(!tasksExpanded)}
                className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <span>Tasks ({tasks.length})</span>
                {tasksExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => onAddTask(project.id)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {tasksExpanded && (
              <div className="space-y-2 mt-2">
                {tasks.length === 0 ? (
                  <div className="p-4 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <p className="text-xs text-slate-400">No tasks in this project yet.</p>
                  </div>
                ) : (
                  tasks.map((task) => <TaskItem key={task.id} task={task} />)
                )}
              </div>
            )}
          </div>
        </Card.Body>
      </div>

      {/* Footer */}
      <Card.Footer>
        <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <FolderKanban className="w-3.5 h-3.5 text-indigo-500" />
          <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        <button
          type="button"
          onClick={() => onAddTask(project.id)}
          className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Task</span>
        </button>
      </Card.Footer>
    </Card>
  );
}
