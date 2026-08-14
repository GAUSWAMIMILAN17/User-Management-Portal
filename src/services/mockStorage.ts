import type { Project, Task, UserProfile, Status, Priority } from '../types';

const STORAGE_KEYS = {
  USERS: 'warehouse_portal_users',
  CURRENT_USER: 'warehouse_portal_current_user',
  PROJECTS: 'warehouse_portal_projects',
  TASKS: 'warehouse_portal_tasks',
};

// INITIAL DEMO USER & DATA
const DEMO_USER_ID = 'usr-demo-1';

const INITIAL_USERS: (UserProfile & { password_hash: string })[] = [
  {
    id: DEMO_USER_ID,
    email: 'manager@warehouse.com',
    full_name: 'Alex Mercer',
    role: 'Warehouse Manager',
    password_hash: 'password123',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-demo-1',
    user_id: DEMO_USER_ID,
    name: 'Zone A Barcode Scanner Upgrade',
    description: 'Replace handheld scanners with RFID Bluetooth terminals across Zone A aisles.',
    status: 'In-Progress',
    priority: 'High',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'proj-demo-2',
    user_id: DEMO_USER_ID,
    name: 'Cold Storage Temperature Audit',
    description: 'Quarterly HVAC and IoT sensor audit in Freezer Units #1 through #4.',
    status: 'Pending',
    priority: 'High',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'proj-demo-3',
    user_id: DEMO_USER_ID,
    name: 'High-Bay Racking Safety Check',
    description: 'Structural safety check and load limit verification for Racks 10-24.',
    status: 'Completed',
    priority: 'Medium',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-demo-1',
    project_id: 'proj-demo-1',
    user_id: DEMO_USER_ID,
    title: 'Unbox and configure 25 Zebra RFID scanners',
    description: 'Flash firmware v4.2 and pair with warehouse Wi-Fi network.',
    status: 'In-Progress',
    priority: 'High',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'task-demo-2',
    project_id: 'proj-demo-1',
    user_id: DEMO_USER_ID,
    title: 'Train Zone A shift leads on charging dock placement',
    description: 'Conduct 20-minute safety walk with shift leads.',
    status: 'Pending',
    priority: 'Medium',
    due_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'task-demo-3',
    project_id: 'proj-demo-1',
    user_id: DEMO_USER_ID,
    title: 'Decommission legacy 1D laser readers',
    description: 'Return old barcode units to IT inventory storage.',
    status: 'Completed',
    priority: 'Low',
    due_date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'task-demo-4',
    project_id: 'proj-demo-2',
    user_id: DEMO_USER_ID,
    title: 'Inspect backup generator battery levels',
    description: 'Check voltage levels on standby cooling generator.',
    status: 'Pending',
    priority: 'High',
    due_date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'task-demo-5',
    project_id: 'proj-demo-2',
    user_id: DEMO_USER_ID,
    title: 'Verify IoT wireless gateway connectivity in Unit #3',
    description: 'Ensure temperature telemetry is reporting every 60 seconds.',
    status: 'Pending',
    priority: 'Medium',
    due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-demo-6',
    project_id: 'proj-demo-3',
    user_id: DEMO_USER_ID,
    title: 'Inspect floor anchor bolts on Rack #12',
    description: 'Torque check anchor bolts to 120 ft-lbs.',
    status: 'Completed',
    priority: 'Medium',
    due_date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-demo-7',
    project_id: 'proj-demo-3',
    user_id: DEMO_USER_ID,
    title: 'Replace missing aisle end-guard bumpers',
    description: 'Install yellow safety bumpers on aisle ends 15 and 16.',
    status: 'Completed',
    priority: 'Low',
    due_date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

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
    return profile;
  },

  loginUser: (email: string, pass: string): UserProfile => {
    const users = mockDb.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password_hash === pass
    );
    if (!user) {
      throw new Error('Invalid email or password. Click "Fill Demo Credentials" below to test.');
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

  addProject: (
    userId: string,
    data: { name: string; description: string; status: Status; priority: Priority }
  ): Project => {
    const projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      user_id: userId,
      name: data.name,
      description: data.description,
      status: data.status,
      priority: data.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    projects.unshift(newProj);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return newProj;
  },

  updateProject: (id: string, updates: Partial<Project>): Project => {
    const projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');

    const updated = {
      ...projects[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    projects[index] = updated;
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return updated;
  },

  deleteProject: (id: string) => {
    const projects: Project[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]');
    const filtered = projects.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));

    // Also delete associated tasks
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const filteredTasks = tasks.filter((t) => t.project_id !== id);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filteredTasks));
  },

  // Task Operations
  getTasks: (userId: string): Task[] => {
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    return tasks.filter((t) => t.user_id === userId);
  },

  addTask: (
    userId: string,
    data: {
      projectId: string;
      title: string;
      description?: string;
      status: Status;
      priority: Priority;
      dueDate?: string;
    }
  ): Task => {
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const newTask: Task = {
      id: `task-${Date.now()}`,
      project_id: data.projectId,
      user_id: userId,
      title: data.title,
      description: data.description || '',
      status: data.status,
      priority: data.priority,
      due_date: data.dueDate || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return newTask;
  },

  updateTaskStatus: (taskId: string, status: Status): Task => {
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) throw new Error('Task not found');

    const updated = {
      ...tasks[index],
      status,
      updated_at: new Date().toISOString(),
    };
    tasks[index] = updated;
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return updated;
  },

  deleteTask: (taskId: string) => {
    const tasks: Task[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    const filtered = tasks.filter((t) => t.id !== taskId);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
  },
};
