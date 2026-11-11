import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { api, setAccessToken, getAccessToken, apiError } from '../lib/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<{ data: User }>('/auth/me');
      setUser(res.data.data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (getAccessToken()) {
        await refreshUser();
      }
      setLoading(false);
    })();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<{ data: { user: User; accessToken: string } }>('/auth/login', {
        email,
        password,
      });
      setAccessToken(res.data.data.accessToken);
      setUser(res.data.data.user);
    },
    [],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.post<{ data: { user: User; accessToken: string } }>('/auth/register', {
        name,
        email,
        password,
        confirmPassword: password,
      });
      setAccessToken(res.data.data.accessToken);
      setUser(res.data.data.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((u) => (u ? { ...u, ...patch } : u));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { apiError };
