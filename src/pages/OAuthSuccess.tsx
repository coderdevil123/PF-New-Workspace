import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  google_id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      toast({
        title: 'Authentication Failed',
        description: 'No token received',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // 🔐 Decode JWT
    const decoded = jwtDecode<JwtPayload>(token);

    // ✅ Store token
    localStorage.setItem('authToken', token);

    // ✅ LOGIN WITH USER DATA (NOT TOKEN)
    login(decoded);

    toast({
      title: 'Welcome!',
      description: 'Logged in successfully with Google',
    });

    navigate('/workspace');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Completing authentication...</p>
    </div>
  );
}
