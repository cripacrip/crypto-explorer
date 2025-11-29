import { api, type User } from './_api';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

/**
 * Register a new user
 */
export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = (await api.post('/auth/register', { username, email, password }, { needRaw: true })) as AuthResponse;

  if (response.success && response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response;
};

/**
 * Login user
 */
export const login = async (usernameOrEmail: string, password: string): Promise<AuthResponse> => {
  const response = (await api.post('/auth/login', { usernameOrEmail, password }, { needRaw: true })) as AuthResponse;

  if (response.success && response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getToken();
    if (!token) return null;

    const response = (await api.get('/auth/me', {}, { needRaw: true })) as any;
    return response.success ? response.data.user : null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Save token to localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    // Call backend logout endpoint to clear refresh token
    await api.post('/auth/logout', {}, { needRaw: true });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always remove token from localStorage, even if backend call fails
    removeToken();
  }
};
