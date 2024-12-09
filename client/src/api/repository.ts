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
// POST /repositories/build
// Request: { id: string }
// Response: Repository
export const buildRepository = async (url: string): Promise<Repository> => {
  console.log("buildRepository called with URL:", url);
  try {
    const response = await api.post('/repositories/build', { id: url });
    console.log("buildRepository response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in buildRepository:", error);
    throw error;
  }
};

// Run Repository
// POST /repositories/:id/run
// Response: { success: boolean, logs: string[] }
export const runRepository = async (id: string) => {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        logs: ['Starting application...', 'Application running on port 3000']
      });
    }, 500);
  });
};