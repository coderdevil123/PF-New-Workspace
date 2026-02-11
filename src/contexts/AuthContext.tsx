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
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!user;

  // 🔥 FETCH ROLE FROM BACKEND
  useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');

  if (!token || !savedUser) return;

  const enrichUserWithRole = async () => {
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
      const parsedUser = JSON.parse(savedUser);

      // ⬇️ NORMALIZE ROLE CASE
      const updatedUser = {
        ...parsedUser,
        role: profile.role, // Admin | Team Lead | Intern | User
        department: profile.department,
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
    }
  };

  enrichUserWithRole();
}, []); // 👈 RUN ONLY ONCE

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (res.ok) setIsAdmin(true);
      else setIsAdmin(false);
    })
    .catch(() => setIsAdmin(false));
}, []);


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
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
