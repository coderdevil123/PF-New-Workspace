import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

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

  // Save JWT
  localStorage.setItem('authToken', token);

  // Login with token
  login(token);

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
