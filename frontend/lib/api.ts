// lib/api.ts
import { getToken } from '@/utils/tokenStorage';
import {
  GetTasksResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  GetTaskByIdResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
  ToggleTaskCompletionRequest,
  ToggleTaskCompletionResponse,
  GetTasksRequest,
  PaginationMeta,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';


// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // For successful responses, parse JSON
  if (response.ok) {
    const data = await response.json();
    return data;
  }

  // For error responses, parse the error data
  let errorData;
  try {
    errorData = await response.json();
  } catch (e) {
    // If response is not JSON, create a generic error
    errorData = { detail: `HTTP error ${response.status}` };
  }

  // Handle specific error statuses
  if (response.status === 401) {
    // Redirect to login if unauthorized
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token'); // Clear invalid token
      window.location.href = '/signin';
    }
    throw new Error('Unauthorized: Please log in again');
  }

  if (response.status === 403) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  throw new Error(errorData.detail || errorData.error || `API request failed with status ${response.status}`);
};

// Note: Removed mock data functionality to ensure real backend errors are surfaced
// If backend is not available, proper error handling will occur

// API functions
export const api = {
  // Get all tasks for a user
  async getTasks(userId: string, params?: GetTasksRequest) {
    let url = `/${userId}/tasks`;
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.append('status', params.status);
      if (params.sort) searchParams.append('sort', params.sort);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
      url += `?${searchParams.toString()}`;
    }
    
    return apiRequest<GetTasksResponse>(url, { method: 'GET' });
  },

  // Create a new task
  async createTask(userId: string, taskData: CreateTaskRequest) {
    return apiRequest<CreateTaskResponse>(`/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Get a specific task by ID
  async getTaskById(userId: string, taskId: number) {
    return apiRequest<GetTaskByIdResponse>(`/${userId}/tasks/${taskId}`, {
      method: 'GET',
    });
  },

  // Update a task
  async updateTask(userId: string, taskId: number, taskData: UpdateTaskRequest) {
    return apiRequest<UpdateTaskResponse>(`/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Delete a task
  async deleteTask(userId: string, taskId: number) {
    return apiRequest<DeleteTaskResponse>(`/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  // Toggle task completion status
  async toggleTaskCompletion(userId: string, taskId: number, completed: boolean) {
    return apiRequest<ToggleTaskCompletionResponse>(
      `/${userId}/tasks/${taskId}/complete`,
      {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      }
    );
  },
};

export default api;