// hooks/useOptimisticUpdates.ts
import { useState } from 'react';
import { Task } from '@/types';

export const useOptimisticUpdates = () => {
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>([]);

  const addOptimisticTask = (newTask: Omit<Task, 'id'>) => {
    const tempId = Date.now(); // Temporary ID for optimistic update
    const optimisticTask = {
      ...newTask,
      id: tempId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Task;

    setOptimisticTasks(prev => [optimisticTask, ...prev]);
    return tempId;
  };

  const updateOptimisticTask = (taskId: number, updatedFields: Partial<Task>) => {
    setOptimisticTasks(prev =>
      prev.map(task => 
        task.id === taskId ? { ...task, ...updatedFields, updatedAt: new Date().toISOString() } : task
      )
    );
  };

  const removeOptimisticTask = (taskId: number) => {
    setOptimisticTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const commitOptimisticUpdate = (tempId: number, actualTask: Task) => {
    setOptimisticTasks(prev =>
      prev.map(task => 
        task.id === tempId ? actualTask : task
      )
    );
  };

  const rollbackOptimisticUpdate = (tempId: number) => {
    setOptimisticTasks(prev => prev.filter(task => task.id !== tempId));
  };

  return {
    optimisticTasks,
    addOptimisticTask,
    updateOptimisticTask,
    removeOptimisticTask,
    commitOptimisticUpdate,
    rollbackOptimisticUpdate,
  };
};