import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Extract token and user data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    const name = urlParams.get('name');

    if (token && email) {
      // Store token in localStorage
      localStorage.setItem('authToken', token);

      // Log the user in
      login({
        name: name || email.split('@')[0],
        email: email,
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
      });

      toast({
        title: 'Welcome!',
        description: 'You have successfully logged in with Google.',
      });

      // Redirect to workspace
      navigate('/workspace');
    } else {
      // If no token, redirect to login
      toast({
        title: 'Authentication Failed',
        description: 'Unable to authenticate. Please try again.',
        variant: 'destructive',
      });
      navigate('/login');
    }
  }, [login, navigate, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
