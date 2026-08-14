import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { Project, Task, Status, Priority, ProjectWithStats } from '../types';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { mockDb } from '../services/mockStorage';

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
  notification: { type: 'success' | 'error'; message: string } | null;
  clearNotification: () => void;
  // CRUD Actions
  addProject: (data: { name: string; description: string; status: Status; priority: Priority }) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (data: { projectId: string; title: string; description?: string; status: Status; priority: Priority; dueDate?: string }) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Status) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  // Computations
  overallStats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    progressPercent: number;
  };
  projectsWithStats: ProjectWithStats[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const clearNotification = () => setNotification(null);

  const fetchProjectData = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const [projRes, taskRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        ]);

        if (projRes.error) throw projRes.error;
        if (taskRes.error) throw taskRes.error;

        setProjects(projRes.data as Project[]);
        setTasks(taskRes.data as Task[]);
      } else {
        const projs = mockDb.getProjects(user.id);
        const tsk = mockDb.getTasks(user.id);
        setProjects(projs);
        setTasks(tsk);
      }
    } catch (err: any) {
      console.error('Error loading projects/tasks:', err);
      const msg = err.message || 'Failed to fetch dashboard data.';
      setError(msg);
      setNotification({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // AUTOMATIC PROJECT STATUS SYNC BASED ON TASK COMPLETION
  const syncProjectStatusForTasks = useCallback(async (projectId: string, currentTasks: Task[]) => {
    const projTasks = currentTasks.filter((t) => t.project_id === projectId);
    if (projTasks.length === 0) return;

    let targetStatus: Status = 'Pending';
    const allCompleted = projTasks.every((t) => t.status === 'Completed');
    const hasAnyActive = projTasks.some((t) => t.status === 'Completed' || t.status === 'In-Progress');

    if (allCompleted) {
      targetStatus = 'Completed';
    } else if (hasAnyActive) {
      targetStatus = 'In-Progress';
    } else {
      targetStatus = 'Pending';
    }

    // Check if project status needs update
    setProjects((prevProjects) => {
      const targetProj = prevProjects.find((p) => p.id === projectId);
      if (!targetProj || targetProj.status === targetStatus) return prevProjects;

      // Silently update database in background
      if (isSupabaseConfigured && supabase) {
        supabase
          .from('projects')
          .update({ status: targetStatus, updated_at: new Date().toISOString() })
          .eq('id', projectId)
          .then();
      } else {
        mockDb.updateProject(projectId, { status: targetStatus });
      }

      return prevProjects.map((p) => (p.id === projectId ? { ...p, status: targetStatus } : p));
    });
  }, []);

  // PROGRESS TRACKING COMPUTATION USING useMemo (REQUIRED BY SPECIFICATION)
  const overallStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In-Progress').length;
    const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
    const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      progressPercent,
    };
  }, [tasks]);

  // PER-PROJECT STATS COMPUTATION USING useMemo
  const projectsWithStats = useMemo(() => {
    return projects.map((project) => {
      const projTasks = tasks.filter((t) => t.project_id === project.id);
      const total = projTasks.length;
      const completed = projTasks.filter((t) => t.status === 'Completed').length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        ...project,
        totalTasks: total,
        completedTasks: completed,
        progressPercent: percent,
      };
    });
  }, [projects, tasks]);

  // Project CRUD Actions
  const addProject = async (data: { name: string; description: string; status: Status; priority: Priority }) => {
    if (!user) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: newProj, error: err } = await supabase
          .from('projects')
          .insert({
            user_id: user.id,
            name: data.name,
            description: data.description,
            status: data.status,
            priority: data.priority,
          })
          .select()
          .single();

        if (err) throw err;
        setProjects((prev) => [newProj as Project, ...prev]);
      } else {
        const newProj = mockDb.addProject(user.id, data);
        setProjects((prev) => [newProj, ...prev]);
      }
      setNotification({ type: 'success', message: `Project "${data.name}" created successfully!` });
    } catch (err: any) {
      const msg = err.message || 'Failed to create project.';
      setNotification({ type: 'error', message: msg });
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: updated, error: err } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (err) throw err;
        setProjects((prev) => prev.map((p) => (p.id === id ? (updated as Project) : p)));
      } else {
        const updated = mockDb.updateProject(id, updates);
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      }
      setNotification({ type: 'success', message: 'Project updated successfully.' });
    } catch (err: any) {
      const msg = err.message || 'Failed to update project.';
      setNotification({ type: 'error', message: msg });
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error: err } = await supabase.from('projects').delete().eq('id', id);
        if (err) throw err;
      } else {
        mockDb.deleteProject(id);
      }
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setTasks((prev) => prev.filter((t) => t.project_id !== id));
      setNotification({ type: 'success', message: 'Project and associated tasks deleted.' });
    } catch (err: any) {
      const msg = err.message || 'Failed to delete project.';
      setNotification({ type: 'error', message: msg });
      throw err;
    }
  };

  // Task Actions
  const addTask = async (data: { projectId: string; title: string; description?: string; status: Status; priority: Priority; dueDate?: string }) => {
    if (!user) return;
    try {
      let createdTask: Task;
      if (isSupabaseConfigured && supabase) {
        const { data: newTask, error: err } = await supabase
          .from('tasks')
          .insert({
            project_id: data.projectId,
            user_id: user.id,
            title: data.title,
            description: data.description || '',
            status: data.status,
            priority: data.priority,
            due_date: data.dueDate || null,
          })
          .select()
          .single();

        if (err) throw err;
        createdTask = newTask as Task;
      } else {
        createdTask = mockDb.addTask(user.id, data);
      }

      const updatedTasks = [createdTask, ...tasks];
      setTasks(updatedTasks);

      // Auto Sync Project Status
      syncProjectStatusForTasks(data.projectId, updatedTasks);

      setNotification({ type: 'success', message: `Task "${data.title}" added successfully.` });
    } catch (err: any) {
      const msg = err.message || 'Failed to add task.';
      setNotification({ type: 'error', message: msg });
      throw err;
    }
  };

  const updateTaskStatus = async (taskId: string, status: Status) => {
    const prevTasks = [...tasks];
    const updatedTasks = tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    setTasks(updatedTasks);

    const targetTask = tasks.find((t) => t.id === taskId);
    if (targetTask) {
      syncProjectStatusForTasks(targetTask.project_id, updatedTasks);
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: err } = await supabase
          .from('tasks')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', taskId);

        if (err) throw err;
      } else {
        mockDb.updateTaskStatus(taskId, status);
      }
      setNotification({ type: 'success', message: `Task status changed to ${status}.` });
    } catch (err: any) {
      setTasks(prevTasks);
      const msg = err.message || 'Failed to update task status.';
      setNotification({ type: 'error', message: msg });
    }
  };

  const deleteTask = async (taskId: string) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    const updatedTasks = tasks.filter((t) => t.id !== taskId);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: err } = await supabase.from('tasks').delete().eq('id', taskId);
        if (err) throw err;
      } else {
        mockDb.deleteTask(taskId);
      }
      setTasks(updatedTasks);
      if (targetTask) {
        syncProjectStatusForTasks(targetTask.project_id, updatedTasks);
      }
      setNotification({ type: 'success', message: 'Task deleted successfully.' });
    } catch (err: any) {
      const msg = err.message || 'Failed to delete task.';
      setNotification({ type: 'error', message: msg });
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        tasks,
        loading,
        error,
        notification,
        clearNotification,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTaskStatus,
        deleteTask,
        refreshData: fetchProjectData,
        overallStats,
        projectsWithStats,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProjects(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}
