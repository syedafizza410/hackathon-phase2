// types/index.ts

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string; // ISO date string
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiErrorResponse {
  success: boolean;
  error: string;
  details?: any;
}

// Specific response types for each endpoint
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetTasksResponse {
  success: boolean;
  data: Task[];
  meta?: PaginationMeta;
}

export type TaskStatus = 'all' | 'active' | 'completed';
export type TaskSortOption = 'created_desc' | 'created_asc' | 'title_asc' | 'title_desc';

export interface GetTasksRequest {
  status?: TaskStatus;
  sort?: TaskSortOption;
  page?: number;
  pageSize?: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface CreateTaskResponse {
  success: boolean;
  data: Task;
}

export interface GetTaskByIdResponse {
  success: boolean;
  data: Task;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
}

export interface UpdateTaskResponse {
  success: boolean;
  data: Task;
}

export interface DeleteTaskResponse {
  success: boolean;
  data: {
    message: string;
  };
}

export interface ToggleTaskCompletionRequest {
  completed: boolean;
}

export interface ToggleTaskCompletionResponse {
  success: boolean;
  data: Task;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface SignupRequest extends LoginRequest {
  name: string;
}

export interface SignupResponse extends LoginResponse {}