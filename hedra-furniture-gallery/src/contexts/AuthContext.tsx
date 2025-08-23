import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface AdminUser {
  id: string;
  name: string; // ✅ ADDED
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });

      const userData: AdminUser = {
        id: response.data.id,
        name: response.data.name, // ✅ Make sure backend returns this
        email: response.data.email,
        role: response.data.role,
        token: response.data.token,
      };

      setUser(userData);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      console.log(userData)
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
