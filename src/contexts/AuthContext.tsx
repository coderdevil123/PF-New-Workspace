import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  google_id?: string;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  role?: 'admin' | 'user' | 'intern' | 'team_lead';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  // 🔥 FETCH ROLE FROM BACKEND
  useEffect(() => {
    const enrichUserWithRole = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/team/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) return;

        const profile = await res.json();

        const updatedUser = {
          ...user,
          role: profile.role,
          department: profile.department,
        };

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Failed to fetch user role', err);
      }
    };

    enrichUserWithRole();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
