import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Extract token from URL hash (Google OAuth returns token in hash)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      // Fetch user info from Google
      fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(res => res.json())
        .then(userData => {
          // Store token
          localStorage.setItem('authToken', accessToken);

          // Log the user in
          login({
            name: userData.name || userData.email.split('@')[0],
            email: userData.email,
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
          });

          toast({
            title: 'Welcome!',
            description: 'You have successfully logged in with Google.',
          });

          // Redirect to workspace
          navigate('/workspace');
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          toast({
            title: 'Authentication Failed',
            description: 'Unable to fetch user data. Please try again.',
            variant: 'destructive',
          });
          navigate('/login');
        });
    } else {
      toast({
        title: 'Authentication Failed',
        description: 'No access token found. Please try again.',
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
