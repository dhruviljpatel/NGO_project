import { createContext, useContext, useState, type ReactNode } from 'react';
import { login as loginApi, register as registerApi } from '../services/auth.service';

export type Role = 'ADMIN' | 'NGO_STAFF' | 'VOLUNTEER' | 'DONOR' | 'BENEFICIARY';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved) return JSON.parse(saved);
    return null;
  });

  const login = async (credentials: any) => {
    const result = await loginApi(credentials);
    const loggedInUser = result.user;
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', result.token);
  };

  const register = async (data: any) => {
    const result = await registerApi(data);
    const registeredUser = result.user;
    setUser(registeredUser);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    localStorage.setItem('token', result.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
