import axios from 'axios';
import type { Project, ProjectCreate, TaskLog, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  githubLogin: async (userData: {
    github_id: string;
    username: string;
    email?: string;
    avatar_url?: string;
  }): Promise<User> => {
    const { data } = await api.post('/api/auth/github-login', userData);
    return data;
  },

  getCurrentUser: async (userId: number): Promise<User> => {
    const { data } = await api.get(`/api/auth/me?user_id=${userId}`);
    return data;
  },
};

// Projects API
export const projectsAPI = {
  create: async (project: ProjectCreate, userId: number = 1): Promise<Project> => {
    const { data } = await api.post(`/api/projects?user_id=${userId}`, project);
    return data;
  },

  list: async (userId: number = 1, skip: number = 0, limit: number = 20): Promise<Project[]> => {
    const { data } = await api.get(`/api/projects?user_id=${userId}&skip=${skip}&limit=${limit}`);
    return data;
  },

  get: async (projectId: number, userId: number = 1): Promise<Project> => {
    const { data } = await api.get(`/api/projects/${projectId}?user_id=${userId}`);
    return data;
  },

  update: async (projectId: number, updates: Partial<Project>, userId: number = 1): Promise<Project> => {
    const { data } = await api.patch(`/api/projects/${projectId}?user_id=${userId}`, updates);
    return data;
  },

  delete: async (projectId: number, userId: number = 1): Promise<void> => {
    await api.delete(`/api/projects/${projectId}?user_id=${userId}`);
  },

  getLogs: async (projectId: number, userId: number = 1): Promise<TaskLog[]> => {
    const { data } = await api.get(`/api/projects/${projectId}/logs?user_id=${userId}`);
    return data;
  },

  // SSE streaming URL
  getStreamURL: (projectId: number, userId: number = 1): string => {
    return `${API_BASE_URL}/api/projects/${projectId}/stream?user_id=${userId}`;
  },
};

// Uploads API
export const uploadsAPI = {
  upload: async (files: File[]): Promise<{ files: Array<{ filename: string; path: string; size: number }> }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const { data } = await api.post('/api/uploads/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  download: async (filename: string): Promise<Blob> => {
    const { data } = await api.get(`/api/uploads/files/${filename}`, {
      responseType: 'blob',
    });
    return data;
  },

  delete: async (filename: string): Promise<void> => {
    await api.delete(`/api/uploads/files/${filename}`);
  },
};

export default api;
