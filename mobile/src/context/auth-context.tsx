import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { api, setAuthToken } from '@/lib/api';
import { storage } from '@/lib/storage';

const TOKEN_KEY = 'fks_token';

export type SessionUser = {
  id: number;
  email: string;
  language: string;
  target_visa: string | null;
};

type AuthContextValue = {
  user: SessionUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await storage.getItem(TOKEN_KEY);
      if (token) {
        setAuthToken(token);
        try {
          const { data } = await api.get('/me');
          setUser(data);
        } catch {
          await storage.deleteItem(TOKEN_KEY);
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  async function persistSession(token: string, sessionUser: SessionUser) {
    await storage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
    setUser(sessionUser);
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    await persistSession(data.token, data.user);
  }

  async function register(email: string, password: string) {
    const { data } = await api.post('/auth/register', { email, password });
    await persistSession(data.token, data.user);
  }

  async function logout() {
    await storage.deleteItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, isLoading, login, register, logout }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
