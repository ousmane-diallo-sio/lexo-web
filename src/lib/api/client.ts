import axios from 'axios';
import type { ServerResponse } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: async <T>(url: string) => {
    const response = await apiClient.get<ServerResponse<T>>(url);
    return response.data;
  },
  post: async <T>(url: string, data?: any) => {
    const response = await apiClient.post<ServerResponse<T>>(url, data);
    return response.data;
  },
  patch: async <T>(url: string, data?: any) => {
    const response = await apiClient.patch<ServerResponse<T>>(url, data);
    return response.data;
  },
  delete: async <T>(url: string, config?: { data?: any }) => {
    const response = await apiClient.delete<ServerResponse<T>>(url, config);
    return response.data;
  },
}; 