import { api } from '@/lib/api';
import type { User } from '@/types/api';

/**
 * Refresh the user's permissions by fetching the latest profile
 * This ensures that any recently granted permissions are available
 */
export const refreshUserPermissions = async (): Promise<User | null> => {
  try {
    const response = await api.get('/auth/me');
    if (response.success && response.data) {
      // Update the user in local storage if needed
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        // The user data is already updated in the response
        return response.data;
      }
    }
    return null;
  } catch (error) {
    console.error('Error refreshing user permissions:', error);
    return null;
  }
};

/**
 * Force refresh the user's JWT token by re-authenticating with current credentials
 * This is useful when permissions have been updated and need to be reflected immediately
 */
export const forceTokenRefresh = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.token) {
      // Update the stored token with fresh permissions
      localStorage.setItem('auth_token', response.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error forcing token refresh:', error);
    return false;
  }
};