import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  google_id?: string;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  role?: string;
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

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const isAdmin = user?.role === 'admin';

  // ── ALWAYS re-fetch role on mount — never trust stale localStorage ───────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/team/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error('not ok'); return res.json(); })
      .then(profile => {
        if (!profile?.role) return;
        setUser(prev => {
          if (!prev) return prev;
          const enriched = { ...prev, role: profile.role, department: profile.department };
          localStorage.setItem('user', JSON.stringify(enriched));
          return enriched;
        });
      })
      .catch(() => {});
  }, []); // runs once on mount — always fetches fresh role

  const login = (userData: User) => {
    // Save basic user immediately so UI shows logged-in state
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // Fetch role right after — token is already in localStorage at this point
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/team/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error('not ok'); return res.json(); })
      .then(profile => {
        if (!profile?.role) return;
        const enriched = { ...userData, role: profile.role, department: profile.department };
        setUser(enriched);
        localStorage.setItem('user', JSON.stringify(enriched));
      })
      .catch(() => {});
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}