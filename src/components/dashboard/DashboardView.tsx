import { useState, useMemo } from 'react';
import { Plus, SearchX, Layers } from 'lucide-react';
import type { Status, Priority, ProjectWithStats } from '../../types';
import { useProjects } from '../../hooks/useProjects';
import { useDebounce } from '../../hooks/useDebounce';
import { Header } from './Header';
import { SummaryProgress } from './SummaryProgress';
import { FilterBar } from './FilterBar';
import { ProjectCard } from './ProjectCard';
import { ProjectCardSkeleton } from '../common/Skeleton';
import { ProjectModal } from '../forms/ProjectModal';
import { TaskModal } from '../forms/TaskModal';

export function DashboardView() {
  const { projectsWithStats, tasks, loading } = useProjects();

  // Search & Filtering Local State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'status'>('created_at');

  // Debounce hook requirement
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithStats | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedProjectIdForTask, setSelectedProjectIdForTask] = useState<string | undefined>();

  // Filtered & Sorted Projects
  const filteredProjects = useMemo(() => {
    return projectsWithStats
      .filter((project) => {
        // Search filter (debounced)
        const query = debouncedSearchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query);

        // Status filter
        const matchesStatus = statusFilter === 'All' || project.status === statusFilter;

        // Priority filter
        const matchesPriority = priorityFilter === 'All' || project.priority === priorityFilter;

        return matchesQuery && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'status') {
          return a.status.localeCompare(b.status);
        }
        // default created_at
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [projectsWithStats, debouncedSearchQuery, statusFilter, priorityFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortBy('created_at');
  };

  const handleOpenTaskModalForProject = (projectId: string) => {
    setSelectedProjectIdForTask(projectId);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditProjectModal = (project: ProjectWithStats) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 pb-16">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Progress Summary Section (useMemo calculated) */}
        <SummaryProgress />

        {/* Filter and Control Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onResetFilters={handleResetFilters}
          onOpenNewProjectModal={() => {
            setEditingProject(null);
            setIsProjectModalOpen(true);
          }}
        />

        {/* Project List / Grid Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              Warehouse Projects ({filteredProjects.length})
            </h3>
            {debouncedSearchQuery && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Filtered by "<span className="font-semibold text-slate-700 dark:text-slate-300">{debouncedSearchQuery}</span>"
              </p>
            )}
          </div>

          {/* Loading Skeletons */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 flex items-center justify-center">
                <SearchX className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">No projects found</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All'
                    ? 'No warehouse projects matched your current search and filter settings.'
                    : 'Get started by creating your first warehouse management project.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                {searchQuery || statusFilter !== 'All' || priorityFilter !== 'All' ? (
                  <button
                    onClick={handleResetFilters}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Reset Filters
                  </button>
                ) : null}

                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  tasks={tasks.filter((t) => t.project_id === project.id)}
                  onAddTask={handleOpenTaskModalForProject}
                  onEditProject={handleOpenEditProjectModal}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleCloseProjectModal}
        projectToEdit={editingProject}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        defaultProjectId={selectedProjectIdForTask}
      />
    </div>
  );
}
