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

  // ================= FETCH TASKS =================
  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const res = await api.getTasks(user.id, {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          sort: sortOption,
        });

        setTasks(res.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, statusFilter, sortOption]);

  // ================= FILTER + SEARCH =================
  useEffect(() => {
    let result = [...tasks];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(term) ||
          (task.description && task.description.toLowerCase().includes(term))
      );
    }

    if (statusFilter === 'active') result = result.filter(task => !task.completed);
    if (statusFilter === 'completed') result = result.filter(task => task.completed);

    setFilteredTasks(result);
  }, [tasks, statusFilter, searchTerm]);

  // ================= TASK HANDLERS =================
  const handleCreateTask = async (data: Partial<Task>) => {
    if (!user || !data.title) return;

    try {
      const res = await api.createTask(user.id, { title: data.title, description: data.description });
      setTasks(prev => [res.data, ...prev]);
      setShowCreateModal(false);
      showToast('Task created successfully 🎉', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to create task', 'error');
    }
  };

  const handleUpdateTask = async (data: Partial<Task>) => {
    if (!user || !editingTask) return;

    try {
      const res = await api.updateTask(user.id, editingTask.id, { title: data.title, description: data.description });
      setTasks(prev => prev.map(t => (t.id === editingTask.id ? res.data : t)));
      setEditingTask(null);
      showToast('Task updated successfully ✅', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!user || !window.confirm('Delete this task?')) return;

    try {
      await api.deleteTask(user.id, id);
      setTasks(prev => prev.filter(task => task.id !== id));
      showToast('Task deleted 🗑️', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    if (!user) return;

    try {
      const res = await api.toggleTaskCompletion(user.id, id, completed);
      setTasks(prev => prev.map(task => (task.id === id ? res.data : task)));
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  if (!user) return null;

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 text-white">
      <Navbar />

      <main className="h-[calc(100vh-64px)]">
        <div className="grid grid-cols-12 h-full">
          {/* ===== LEFT SIDEBAR ===== */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 p-6 border-r border-white/10 backdrop-blur-md bg-white/5">
            <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

            <Button className="w-full mb-6" onClick={() => setShowCreateModal(true)}>
              + Add New Task
            </Button>

            {/* ===== FILTER CONTROLS ===== */}
            <FilterControls
              statusFilter={statusFilter}
              sortOption={sortOption}
              searchTerm={searchTerm}
              onStatusChange={setStatusFilter}
              onSortChange={setSortOption}
              onSearchChange={setSearchTerm}
            />
          </aside>

          {/* ===== RIGHT CONTENT ===== */}
          <section className="col-span-12 md:col-span-8 lg:col-span-9 p-8 overflow-y-auto">
            {error && <ErrorMessage message={error} />}

            {loading ? (
              <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-semibold mb-2">No Tasks Yet 🚀</h2>
                <p className="text-white/70 mb-6">Create your first task and stay productive</p>
                <Button onClick={() => setShowCreateModal(true)}>Create Task</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ===== MODALS ===== */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title=''>
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      {editingTask && (
        <Modal isOpen onClose={() => setEditingTask(null)} title="">
          <TaskForm initialData={editingTask} onSubmit={handleUpdateTask} onCancel={() => setEditingTask(null)} />
        </Modal>
      )}
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
