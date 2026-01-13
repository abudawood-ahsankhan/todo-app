import { useState } from 'react';
import { taskApi } from '../lib/api';

interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TaskItemProps {
  task: Task;
  onToggleCompletion: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggleCompletion, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!editTitle.trim()) {
      setError('Title is required');
      return;
    }

    if (editTitle.length < 1 || editTitle.length > 200) {
      setError('Title must be between 1 and 200 characters');
      return;
    }

    if (editDescription && editDescription.length > 1000) {
      setError('Description must be no more than 1000 characters');
      return;
    }

    setError('');

    try {
      const updatedTask = await taskApi.updateTask(task.id, {
        title: editTitle,
        description: editDescription
      });
      onUpdate(updatedTask);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(task.id);
        onDelete(task.id);
      } catch (err) {
        setError('Failed to delete task');
        console.error('Error deleting task:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <li className="py-4">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="border rounded p-4 bg-yellow-50">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-2">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="mb-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              maxLength={200}
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={2}
              maxLength={1000}
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditTitle(task.title);
                setEditDescription(task.description || '');
                setError('');
              }}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-start">
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={onToggleCompletion}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span
                className={`ml-3 text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
              >
                {task.title}
              </span>
            </div>
            {task.description && (
              <p className="ml-7 text-sm text-gray-500 mt-1">{task.description}</p>
            )}
            <p className="ml-7 text-xs text-gray-400 mt-1">
              Created: {formatDate(task.created_at)} | Updated: {formatDate(task.updated_at)}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}