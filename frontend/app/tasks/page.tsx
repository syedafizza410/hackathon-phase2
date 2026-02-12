// app/tasks/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import FilterControls from '@/components/FilterControls';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { Task } from '@/types';
import { api } from '@/lib/api';

const TasksPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortOption, setSortOption] = useState<'created_desc' | 'created_asc' | 'title_asc' | 'title_desc'>('created_desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Default page size
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tasks when component mounts or when filters change
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.getTasks(user.id, { 
          status: statusFilter !== 'all' ? statusFilter : undefined,
          sort: sortOption,
          page: currentPage,
          pageSize: pageSize
        });
        
        setTasks(response.data);
        // Assuming the backend returns pagination metadata
        // If not, we'll calculate totalPages based on response length
        if (response.meta) {
          setTotalPages(response.meta.totalPages);
        } else {
          // Fallback: calculate based on response length
          setTotalPages(Math.ceil(response.data.length / pageSize));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, statusFilter, sortOption, currentPage, pageSize]);

  // Apply filters, search and sorting to tasks
  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter === 'active') {
      result = result.filter(task => !task.completed);
    } else if (statusFilter === 'completed') {
      result = result.filter(task => task.completed);
    }

    // Apply sorting
    switch (sortOption) {
      case 'created_asc':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'created_desc':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredTasks(result);
  }, [tasks, statusFilter, sortOption, searchTerm]);

  const handleCreateTask = async (taskData: Partial<Task>) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.createTask(user.id, {
        title: taskData.title!,
        description: taskData.description
      });
      
      setTasks([response.data, ...tasks]);
      setShowCreateModal(false);
      showToast('Task created successfully!', 'success');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create task';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!user || !editingTask) return;

    try {
      setLoading(true);
      const response = await api.updateTask(user.id, editingTask.id, {
        title: taskData.title,
        description: taskData.description
      });
      
      setTasks(tasks.map(t => t.id === editingTask.id ? response.data : t));
      setEditingTask(null);
      showToast('Task updated successfully!', 'success');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update task';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!user) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await api.deleteTask(user.id, taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
        showToast('Task deleted successfully!', 'success');
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to delete task';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleComplete = async (taskId: number, completed: boolean) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.toggleTaskCompletion(user.id, taskId, completed);
      
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data : task
      ));
      showToast(`Task marked as ${completed ? 'completed' : 'pending'}!`, 'success');
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
    <div className="min-h-screen bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-lg">
      <Navbar />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Your Tasks</h1>
              <Button onClick={() => setShowCreateModal(true)}>
                Add New Task
              </Button>
            </div>

            {error && <ErrorMessage message={error} />}

            <FilterControls
              statusFilter={statusFilter}
              sortOption={sortOption}
              searchTerm={searchTerm}
              onStatusChange={setStatusFilter}
              onSortChange={setSortOption}
              onSearchChange={setSearchTerm}
            />

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : (
              <div>
                {filteredTasks.length === 0 ? (
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new task.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Add New Task
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(task) => setEditingTask(task)}
                        onDelete={handleDeleteTask}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create Task Modal */}
            <Modal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              title="Create New Task"
            >
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowCreateModal(false)}
              />
            </Modal>

            {/* Edit Task Modal */}
            {editingTask && (
              <Modal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                title="Edit Task"
              >
                <TaskForm
                  initialData={editingTask}
                  onSubmit={handleUpdateTask}
                  onCancel={() => setEditingTask(null)}
                />
              </Modal>
            )}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative ml-3 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, filteredTasks.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredTasks.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                          currentPage === 1 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-400 hover:bg-gray-50 focus:outline-offset-0'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M12.79 5.23a1 1 0 01-.54 1.36l-2.87 2.87 2.87 2.87a1 1 0 11-1.42 1.42l-3.59-3.59a1 1 0 010-1.42l3.59-3.59a1 1 0 011.38-.04z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      
                      {/* Page numbers */}
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              currentPage === pageNum
                                ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                          currentPage === totalPages 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-white text-gray-400 hover:bg-gray-50 focus:outline-offset-0'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
  );
};

export default function TasksPageWrapper() {
  return (
    <ProtectedRoute>
      <TasksPage />
    </ProtectedRoute>
  );
}
