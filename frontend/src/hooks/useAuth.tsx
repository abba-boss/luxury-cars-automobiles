import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { localDb } from '@/lib/database';

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Try to get user profile using stored token
          const response = await localDb.auth.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // If token is invalid, clear it
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        // If there's an error, clear the token
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phone: string) => {
    try {
      const response = await localDb.auth.register(email, password, fullName, phone);
      if (response.success && response.data) {
        setUser(response.data);
        return { error: null };
      } else {
        return { error: new Error(response.message || 'Registration failed') };
      }
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await localDb.auth.login(email, password);
      if (response.success && response.data) {
        setUser(response.data);
        return { error: null };
      } else {
        return { error: new Error(response.message || 'Login failed') };
      }
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await localDb.auth.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if backend logout fails, clear local state
      localStorage.removeItem('auth_token');
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
    signOut
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
