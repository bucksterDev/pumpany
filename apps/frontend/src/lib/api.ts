import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_URL ? `${API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

export interface Company {
  id: string;
  prompt: string;
  computeLevel: 'low' | 'medium' | 'high';
  tokenAddress?: string;
  tokenName?: string;
  tokenSymbol?: string;
  computeBalance: string;
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  companyId: string;
  role: 'design' | 'dev' | 'sales' | 'ops';
  containerId?: string;
  openclawAgentId?: string;
  status: 'active' | 'idle' | 'busy' | 'stopped';
  tasksCompleted: number;
  config?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  companyId: string;
  agentId?: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  output?: string;
  priority: number;
  createdAt: string;
  completedAt?: string;
}

export const companyAPI = {
  create: async (data: { prompt: string; computeLevel: 'low' | 'medium' | 'high' }) => {
    const response = await api.post<Company>('/companies', data);
    return response.data;
  },
  getAll: async () => {
    const response = await api.get<Company[]>('/companies');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },
};

export const agentAPI = {
  getByCompanyId: async (companyId: string) => {
    const response = await api.get<Agent[]>(`/agents/company/${companyId}`);
    return response.data;
  },
};

export const taskAPI = {
  getByCompanyId: async (companyId: string) => {
    const response = await api.get<Task[]>(`/tasks/company/${companyId}`);
    return response.data;
  },
};
