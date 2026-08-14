import type { Project, Task, UserProfile, Status, Priority } from '../types';

const STORAGE_KEYS = {
  USERS: 'warehouse_portal_users',
  CURRENT_USER: 'warehouse_portal_current_user',
  PROJECTS: 'warehouse_portal_projects',
  TASKS: 'warehouse_portal_tasks',
};

// Clean Fresh State - No Initial Seed Data
const INITIAL_USERS: (UserProfile & { password_hash: string })[] = [];
const INITIAL_PROJECTS: Project[] = [];
const INITIAL_TASKS: Task[] = [];

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
  }
}

initStorage();

export function resetAllStorage() {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  initStorage();
}

export const mockDb = {
  // Auth Operations
  getUsers: (): (UserProfile & { password_hash: string })[] => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  getCurrentUser: (): UserProfile | null => {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: UserProfile | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  registerUser: (name: string, email: string, role: string, pass: string): UserProfile => {
    const users = mockDb.getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      email,
      full_name: name,
      role: role || 'Warehouse Manager',
      password_hash: pass,
      created_at: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const profile: UserProfile = {
      id: newUser.id,
      email: newUser.email,
      full_name: newUser.full_name,
      role: newUser.role,
      created_at: newUser.created_at,
    };
    mockDb.setCurrentUser(profile);
    return profile;
  },

  loginUser: (email: string, pass: string): UserProfile => {
    const users = mockDb.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === pass
    );
    if (!user) {
      throw new Error('Invalid email or password. Please try again or create an account.');
    }
    const profile: UserProfile = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      created_at: user.created_at,
    };
    mockDb.setCurrentUser(profile);
    return profile;
  },

  // Project Operations
  getProjects: (userId: string): Project[] => {
    const projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    return projects.filter((p) => p.user_id === userId);
  },

  addProject: (userId: string, data: { name: string; description: string; status: Status; priority: Priority }): Project => {
    const projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      user_id: userId,
      name: data.name,
      description: data.description,
      status: data.status,
      priority: data.priority,
      created_at: new Date().toISOString(),
    };
    projects.unshift(newProj);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProj;
  },

  updateProject: (id: string, updates: Partial<Project>): Project => {
    const projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    projects[index] = {
      ...projects[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return projects[index];
  },

  deleteProject: (id: string) => {
    let projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    projects = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));

    // Delete associated tasks
    let tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    tasks = tasks.filter((t) => t.project_id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Task Operations
  getTasks: (userId: string): Task[] => {
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    return tasks.filter((t) => t.user_id === userId);
  },

  addTask: (userId: string, data: { projectId: string; title: string; description?: string; status: Status; priority: Priority; dueDate?: string }): Task => {
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const newTask: Task = {
      id: `task-${Date.now()}`,
      project_id: data.projectId,
      user_id: userId,
      title: data.title,
      description: data.description || '',
      status: data.status,
      priority: data.priority,
      due_date: data.dueDate,
      created_at: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return newTask;
  },

  updateTaskStatus: (taskId: string, status: Status): Task => {
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    tasks[index] = {
      ...tasks[index],
      status,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return tasks[index];
  },

  deleteTask: (taskId: string) => {
    let tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    tasks = tasks.filter((t) => t.id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },
};
