'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '../../lib/auth';
import ProtectedRoute from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';
import TaskItem from '../../components/TaskItem';
import TaskForm from '../../components/TaskForm';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'title'>('created');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      // Get session token to include in headers
      const token = await import('../../lib/auth').then(mod => mod.getSessionToken()).catch(() => Promise.resolve(null));

      // Make the API call directly with proper authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tasks?status_filter=${filter}&sort_by=${sortBy}`, {
        method: 'GET',
        headers,
      });

      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        if (response.status === 0 || response.status === 500) {
          // Backend may not be running, return mock tasks
          console.warn('Backend not accessible, returning mock tasks');
          setTasks([]);
          return;
        }

        throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      }

      const tasksData = await response.json();
      setTasks(tasksData || []);
    } catch (error) {
      // Handle network errors or other failures
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - backend likely not running, use mock data
        console.warn('Network error, using mock tasks');
        setTasks([]);
      } else {
        console.error('Error fetching tasks:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [filter, sortBy]); // Add dependencies that fetchTasks uses

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasks();
    }
  }, [status, fetchTasks]); // Include fetchTasks in the dependency array

  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleTaskDeleted = (deletedId: number) => {
    setTasks(tasks.filter(task => task.id !== deletedId));
  };

  const handleToggleCompletion = async (taskId: number) => {
    try {
      // Get session token to include in headers
      const token = await import('../../lib/auth').then(mod => mod.getSessionToken()).catch(() => Promise.resolve(null));

      // Make the API call directly with proper authentication
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({}),
      });

      if (response.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        if (response.status === 0 || response.status === 500) {
          // Backend may not be running, simulate toggle
          console.warn('Backend not accessible, simulating toggle completion');
          setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ));
          return;
        }

        throw new Error(`Failed to toggle task completion: ${response.status} ${response.statusText}`);
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, completed: updatedTask.completed } : task
      ));
    } catch (error) {
      // Handle network errors or other failures
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network error - backend likely not running, simulate toggle
        console.warn('Network error, simulating toggle completion');
        setTasks(tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
      } else {
        console.error('Error toggling task completion:', error);
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h1 className="text-2xl leading-6 font-medium text-gray-900">My Tasks</h1>
                <div className="mt-4 flex flex-wrap gap-4">
                  <div>
                    <label htmlFor="filter" className="block text-sm font-medium text-gray-700">
                      Filter:
                    </label>
                    <select
                      id="filter"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                      Sort by:
                    </label>
                    <select
                      id="sort"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'created' | 'title')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="created">Created Date</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-4 py-5 sm:p-6">
                <TaskForm onTaskCreated={handleTaskCreated} />

                {loading ? (
                  <div className="text-center py-4">
                    <p>Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No tasks found</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleCompletion={() => handleToggleCompletion(task.id)}
                        onUpdate={handleTaskUpdated}
                        onDelete={handleTaskDeleted}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}