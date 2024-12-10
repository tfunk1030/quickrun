import axios from 'axios';

export const getBaseUrl = async () => {
  const defaultPort = 3000;
  const maxPort = 3010; // Set a reasonable upper limit
  for (let port = defaultPort; port <= maxPort; port++) {
    try {
      const response = await axios.get(`http://localhost:${port}/api/health`);
      if (response.status === 200) {
        console.log(`API is running on port ${port}`);
        return `http://localhost:${port}/api`;
      }
    } catch (error) {
      console.error(`Error checking port ${port}:`, error.toString());
    }
  }
  throw new Error('No available port found for the API');
};

const Api = axios.create({
  baseURL: await getBaseUrl(),
});

Api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('authToken');
  console.log('Auth token from localStorage:', token); // New log
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers['Authorization']); // New log
  } else {
    console.log('No auth token found in localStorage'); // New log
  }
  return config;
}, error => {
  console.error('Error in request interceptor:', error);
  return Promise.reject(error);
});

export default Api;