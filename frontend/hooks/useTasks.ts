// hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { Task, GetTasksRequest } from '@/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (params?: GetTasksRequest) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getTasks(user.id, params);
      setTasks(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.createTask(user.id, {
        title: taskData.title,
        description: taskData.description,
      });
      
      setTasks(prev => [response.data, ...prev]);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId: number, taskData: Partial<Task>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.updateTask(user.id, taskId, taskData);
      setTasks(prev => prev.map(t => t.id === taskId ? response.data : t));
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      await api.deleteTask(user.id, taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      
      const response = await api.toggleTaskCompletion(user.id, taskId, !task.completed);
      setTasks(prev => prev.map(t => t.id === taskId ? response.data : t));
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to toggle task completion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
  };
};