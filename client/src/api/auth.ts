import api from './api';

// Login
// POST /auth/login
// Request: { email: string, password: string }
// Response: { success: boolean, message: string, token: string }
export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting login with email:', email);
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      console.log('Auth token stored in localStorage');
    } else {
      console.log('No token received in login response');
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register
// POST /auth/register
// Request: { email: string, password: string }
// Response: { success: boolean, message: string, token: string }
export const register = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      console.log('Registration successful, token stored');
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error('Email already in use');
    }
    throw error;
  }
};

// Logout
// POST /auth/logout
// Response: { success: boolean, message: string }
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    console.log('Logout successful, token removed');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};