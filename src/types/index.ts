export type Status = 'Pending' | 'In-Progress' | 'Completed';
export type Priority = 'Low' | 'Medium' | 'High';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: Status;
  priority: Priority;
  created_at: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  due_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectWithStats extends Project {
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
}

export interface FilterOptions {
  searchQuery: string;
  statusFilter: Status | 'All';
  priorityFilter: Priority | 'All';
  sortBy: 'name' | 'created_at' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
