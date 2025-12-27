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

  if (token) {
    localStorage.setItem('authToken', token);

    login({
      name: 'Google User',
      email: 'google-user',
      phone: '',
      location: '',
    });

    toast({
      title: 'Welcome!',
      description: 'Logged in with Google',
    });

    navigate('/workspace');
  } else {
    navigate('/login');
  }
}, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
