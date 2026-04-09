import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('eyecare_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.getMe();
        if (mounted) {
          setUser(response.data);
        }
      } catch (error) {
        localStorage.removeItem('eyecare_token');
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const response = await api.login({ email, password });
    const nextToken = response.data.token;
    localStorage.setItem('eyecare_token', nextToken);
    setToken(nextToken);
    setUser({
      id: response.data.userId,
      email: response.data.email,
      name: response.data.name,
      role: response.data.role,
    });
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.register(payload);
    const nextToken = response.data.token;
    localStorage.setItem('eyecare_token', nextToken);
    setToken(nextToken);
    setUser({
      id: response.data.userId,
      email: response.data.email,
      name: response.data.name,
      role: response.data.role,
    });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('eyecare_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, isAuthenticated: Boolean(token) }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
