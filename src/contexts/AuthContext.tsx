import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  google_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  role?: 'admin' | 'user';
}


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (jwtToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
const [token, setToken] = useState<string | null>(
  () => localStorage.getItem('authToken')
);

  const isAuthenticated = !!user;

  const login = (jwtToken: string) => {
  localStorage.setItem('authToken', jwtToken);
  setToken(jwtToken);
};


  const logout = () => {
  localStorage.removeItem('authToken');
  setUser(null);
  setToken(null);
};


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
