// Since Better Auth handles authentication automatically with interceptors,
// we don't need to manually add tokens to headers
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // In a real implementation with Better Auth, the token would be retrieved from the session
    // For now, we'll add a placeholder - in the real app, Better Auth would automatically add the token
    // headers['Authorization'] = `Bearer ${token}`;

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
          throw new Error('Unauthorized - please sign in');
        } else if (response.status === 403) {
          throw new Error('Forbidden - you do not have permission to access this resource');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        }
        throw new Error(`GET request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
          throw new Error('Unauthorized - please sign in');
        } else if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Bad request - invalid data provided');
        } else if (response.status === 422) {
          throw new Error('Validation error - check your input');
        }
        throw new Error(`POST request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
          throw new Error('Unauthorized - please sign in');
        } else if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Bad request - invalid data provided');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        }
        throw new Error(`PUT request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
          throw new Error('Unauthorized - please sign in');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        }
        throw new Error(`DELETE request failed: ${response.status} ${response.statusText}`);
      }

      // DELETE requests typically return no content (204), so handle differently
      if (response.status === 204) {
        return { success: true } as any as T;
      }
      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
          throw new Error('Unauthorized - please sign in');
        } else if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Bad request - invalid data provided');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        }
        throw new Error(`PATCH request failed: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - please check your connection');
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();

// Specific task-related API functions
// These functions will be updated to work with session context in the components
// For now, they remain as is, and the authentication will be handled by Better Auth
// when properly configured
export const taskApi = {
  getTasks: (status?: 'all' | 'pending' | 'completed', sort?: 'created' | 'title') => {
    const params = new URLSearchParams();
    if (status) params.append('status_filter', status);
    if (sort) params.append('sort_by', sort);
    const queryString = params.toString();
    return apiClient.get(`/api/tasks${queryString ? `?${queryString}` : ''}`);
  },

  createTask: (taskData: { title: string; description?: string }) => {
    return apiClient.post('/api/tasks', taskData);
  },

  getTask: (id: number) => {
    return apiClient.get(`/api/tasks/${id}`);
  },

  updateTask: (id: number, taskData: { title?: string; description?: string }) => {
    return apiClient.put(`/api/tasks/${id}`, taskData);
  },

  deleteTask: (id: number) => {
    return apiClient.delete(`/api/tasks/${id}`);
  },

  toggleTaskCompletion: (id: number) => {
    return apiClient.patch(`/api/tasks/${id}/complete`, {});
  }
};