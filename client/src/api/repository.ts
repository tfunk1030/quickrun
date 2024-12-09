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
  console.log("Sending search request to backend with query:", query);
  try {
    const response = await api.get(`/repositories/search?query=${query}`);
    console.log("Received response from backend:", response.data);
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
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        url: 'https://github.com/facebook/react',
        name: 'react',
        language: 'JavaScript',
        status: 'ready',
        buildLogs: ['Installing dependencies...', 'Build successful!']
      });
    }, 500);
  });
};

// Build Repository
// POST /repositories/build
// Request: { url: string }
// Response: Repository
export const buildRepository = async (url: string): Promise<Repository> => {
  // Mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '3',
        url,
        name: url.split('/').pop() || '',
        language: 'Unknown',
        status: 'pending',
        buildLogs: []
      });
    }, 500);
  });
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