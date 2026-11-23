'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  adminLogin: (email: string, password: string, twoFactorCode?: string) => Promise<{ success: boolean; requires2FA?: boolean; message?: string }>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateLoyaltyPoints: (newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  adminLogin: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  updateLoyaltyPoints: () => {},
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('cafex_token');
    const savedUser = localStorage.getItem('cafex_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('cafex_token');
        localStorage.removeItem('cafex_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('cafex_token', data.token);
        localStorage.setItem('cafex_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed.' };
    } catch {
      // Offline fallback demo mode
      if (email && password) {
        const demoUser: User = {
          id: 'demo-user-1',
          fullName: 'Sarah Jenkins',
          email,
          role: 'customer',
          loyalty: { points_balance: 250, lifetime_points: 480, tier: 'Silver' },
        };
        setUser(demoUser);
        setToken('demo_token_123');
        localStorage.setItem('cafex_token', 'demo_token_123');
        localStorage.setItem('cafex_user', JSON.stringify(demoUser));
        return { success: true };
      }
      return { success: false, message: 'Server unreachable.' };
    }
  };

  const adminLogin = async (email: string, password: string, twoFactorCode?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, twoFactorCode }),
      });

      const data = await res.json();
      if (data.requires2FA) {
        return { success: false, requires2FA: true, message: data.message };
      }

      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('cafex_token', data.token);
        localStorage.setItem('cafex_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Administrative login rejected.' };
    } catch {
      if (email.includes('admin') && password === 'Admin@Cafex2026') {
        const demoAdmin: User = {
          id: 'demo-admin-1',
          fullName: 'Cafex Executive Admin',
          email,
          role: 'super_admin',
        };
        setUser(demoAdmin);
        setToken('demo_admin_jwt');
        localStorage.setItem('cafex_token', 'demo_admin_jwt');
        localStorage.setItem('cafex_user', JSON.stringify(demoAdmin));
        return { success: true };
      }
      return { success: false, message: 'Server unreachable.' };
    }
  };

  const register = async (fullName: string, email: string, password: string, phone?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, phone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('cafex_token', data.token);
        localStorage.setItem('cafex_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed.' };
    } catch {
      const newUser: User = {
        id: `user-${Date.now()}`,
        fullName,
        email,
        phone,
        role: 'customer',
        loyalty: { points_balance: 50, lifetime_points: 50, tier: 'Bronze' },
      };
      setUser(newUser);
      setToken('demo_token_reg');
      localStorage.setItem('cafex_token', 'demo_token_reg');
      localStorage.setItem('cafex_user', JSON.stringify(newUser));
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cafex_token');
    localStorage.removeItem('cafex_user');
  };

  const updateLoyaltyPoints = (newBalance: number) => {
    if (user && user.loyalty) {
      const updated = { ...user, loyalty: { ...user.loyalty, points_balance: newBalance } };
      setUser(updated);
      localStorage.setItem('cafex_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, adminLogin, register, logout, updateLoyaltyPoints }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
