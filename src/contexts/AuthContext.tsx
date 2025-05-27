import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, JWTPayload } from '../types';
import { api } from '../lib/api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Decode JWT token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1])) as JWTPayload;
        if (payload.exp * 1000 > Date.now()) {
          // Token is still valid
          fetchUser();
        } else {
          // Token expired
          localStorage.removeItem('token');
          setLoading(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const payload = JSON.parse(atob(token.split('.')[1])) as JWTPayload;
      const userId = payload.id;
      const response = await api.get<User>(`/users/${userId}`);
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<User>('/users/login', {
        email,
        password,
      });
      console.log('Login API response:', response);
      if (response.jwt) {
        localStorage.setItem('token', response.jwt);
        setUser(response.data || null);
      } else {
        throw new Error('No token received');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 