import api from './api';

// Repository Type
export type Repository = {
  id: string;
  url: string;
  name: string;
  language: string;
  status: 'pending' | 'building' | 'ready' | 'error';
  buildLogs: string[];
  error?: string;
};

// Search Repositories
// GET /repositories/search
// Request: { query: string }
// Response: Repository[]
export const searchRepositories = async (query: string): Promise<Repository[]> => {
  try {
    const response = await api.get(`/repositories/search?query=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Error in searchRepositories:", error);
    throw error;
  }
};

// Get Repository
// GET /repositories/:id
// Response: Repository
export const getRepository = async (id: string): Promise<Repository> => {
  try {
    const response = await api.get(`/repositories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching repository:", error);
    throw error;
  }
};

// Build Repository
export const buildRepository = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post(`/repositories/${id}/build`);
    return response.data;
  } catch (error) {
    console.error("Error building repository:", error);
    throw error;
  }
};

// Run Repository
export const runRepository = async (id: string): Promise<{ success: boolean; logs: string[] }> => {
  try {
    const response = await api.post(`/repositories/${id}/run`);
    return response.data;
  } catch (error) {
    console.error("Error running repository:", error);
    throw error;
  }
};