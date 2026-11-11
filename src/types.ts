export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: { theme: 'light' | 'dark' | 'pastel' };
  createdAt: string;
}

export type TaskCategory = 'personal' | 'work' | 'study' | 'health' | 'creative' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: string | null;
  completed: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
