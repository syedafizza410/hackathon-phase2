// app/tasks/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import TaskForm from '@/components/TaskForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Button from '@/components/Button';
import { Task } from '@/types';
import { api } from '@/lib/api';

const TaskDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      if (!user || !id) return;

      try {
        setLoading(true);
        setError(null);

        const taskId = parseInt(Array.isArray(id) ? id[0] : id);
        const response = await api.getTaskById(user.id, taskId);

        setTask(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [user, id]);

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!user || !task) return;

    try {
      setLoading(true);
      const response = await api.updateTask(user.id, task.id, {
        title: taskData.title,
        description: taskData.description
      });
      
      setTask(response.data);
      setIsEditing(false);
      showToast('Task updated successfully!', 'success');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update task';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!user || !task) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await api.deleteTask(user.id, task.id);
        showToast('Task deleted successfully!', 'success');
        router.push('/tasks'); // Redirect to tasks list after deletion
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to delete task';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleComplete = async () => {
    if (!user || !task) return;

    try {
      setLoading(true);
      const response = await api.toggleTaskCompletion(user.id, task.id, !task.completed);
      
      setTask(response.data);
      showToast(`Task marked as ${!task.completed ? 'completed' : 'pending'}!`, 'success');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update task status';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {error && <ErrorMessage message={error} />}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : task ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {isEditing ? (
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Task</h3>
                    <TaskForm
                      initialData={task}
                      onSubmit={handleUpdateTask}
                      onCancel={() => setIsEditing(false)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`text-lg leading-6 font-medium ${
                            task.completed ? 'line-through text-gray-900' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            ID: {task.id} | Created: {new Date(task.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={() => setIsEditing(true)} variant="secondary">
                            Edit
                          </Button>
                          <Button onClick={handleDeleteTask} variant="destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-4 py-5 sm:p-6">
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500">Description</h4>
                        <div className="mt-1 text-gray-900">
                          {task.description || <span className="text-gray-500 italic">No description provided</span>}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500">Status</h4>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.completed 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.completed ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500">Updated</h4>
                        <div className="mt-1 text-gray-900">
                          {new Date(task.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 mr-3">Mark as:</span>
                        <Button
                          onClick={handleToggleComplete}
                          variant={task.completed ? "outline" : "default"}
                        >
                          {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="px-4 py-4 bg-gray-50 sm:px-6">
                  <Button variant="outline" onClick={() => router.push('/tasks')}>
                    Back to Tasks
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Task not found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  The task you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <div className="mt-6">
                  <Button onClick={() => router.push('/tasks')}>
                    Back to Tasks
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default TaskDetailPage;