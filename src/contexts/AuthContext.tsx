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

  // ── Hydrate user from localStorage instantly (no flicker on refresh) ────────
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ── Derive isAdmin purely from user.role — single source of truth ────────────
  // Also check localStorage directly so it's available immediately on refresh
  const isAdmin = user?.role === 'admin';

  // ── ONE API call: fetch role + enrich user object ────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // If we already have a role saved, skip the fetch — avoids flicker
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.role) {
          setUser(parsed); // role already in localStorage, use it immediately
          return;          // no need to fetch
        }
      } catch {}
    }

    // Role not cached yet — fetch it once
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/team/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error('Not ok'); return res.json(); })
      .then(profile => {
        setUser(prev => {
          if (!prev) return prev;
          const enriched = {
            ...prev,
            role:       profile.role,
            department: profile.department,
          };
          // Persist enriched user — next refresh won't need to re-fetch
          localStorage.setItem('user', JSON.stringify(enriched));
          return enriched;
        });
      })
      .catch(() => {}); // silent fail — app still works, just no admin button
  }, []); // run once on mount

  // ── Login: save user + immediately fetch role ────────────────────────────────
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // Fetch role right after login so admin button shows without page refresh
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/team/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error('Not ok'); return res.json(); })
      .then(profile => {
        const enriched = {
          ...userData,
          role:       profile.role,
          department: profile.department,
        };
        setUser(enriched);
        localStorage.setItem('user', JSON.stringify(enriched));
      })
      .catch(() => {});
  };

  // ── Logout: clear everything ─────────────────────────────────────────────────
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