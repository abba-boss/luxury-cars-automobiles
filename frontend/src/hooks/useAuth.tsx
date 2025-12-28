import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService } from '@/services';
import { ApiError } from '@/lib/api';
import type { User } from '@/types/api';

interface AuthContextType {
  user: User | null;
  session: { user: User } | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await authService.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Invalid token - clear it
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      }
    } catch (error) {
      // Network error or invalid token - clear auth state
      console.warn('Auth refresh failed:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      await refreshUser();
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const response = await authService.register(email, password, fullName, phone);
      if (response.success && response.data) {
        setUser(response.data);
        return { error: null };
      } else {
        return { error: new Error(response.message || 'Registration failed') };
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Registration failed';
      return { error: new Error(message) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setUser(response.data);
        return { error: null };
      } else {
        return { error: new Error(response.message || 'Login failed') };
      }
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Login failed';
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    session: user ? { user } : null,
    loading,
    isAdmin: user?.role === 'admin',
    signUp,
    signIn,
    signOut,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
