import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AdminUser } from '../types';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, company: string) => Promise<string | true>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      console.error('Supabase login error:', error);
      return false;
    }
    setUser({
      id: data.user.id,
      name: data.user.user_metadata?.name || '',
      email: data.user.email || '',
      company: data.user.user_metadata?.company || '',
      role: data.user.user_metadata?.role || 'Recruiter',
      avatar: data.user.user_metadata?.avatar || undefined,
    });
    return true;
  };

  const signup = async (name: string, email: string, password: string, company: string): Promise<string | true> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, company, role: 'Recruiter' },
      },
    });
    if (error || !data.user) {
      console.error('Supabase signup error:', error);
      return error?.message || 'Signup failed. Please try again.';
    }
    setUser({
      id: data.user.id,
      name,
      email,
      company,
      role: 'Recruiter',
      avatar: undefined,
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
