import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Mail, Lock, Github, Chrome, Facebook, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login
    login({
      name: formData.email.split('@')[0],
      email: formData.email,
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
    });

    toast({
      title: 'Welcome back!',
      description: 'You have successfully logged in.',
    });

    navigate('/workspace');
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      // Google OAuth configuration
      const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
      const redirectUri = 'https://pf-workspace.vercel.app/oauth/success';
      const scope = 'email profile';
      
      // Construct Google OAuth URL
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`;
      
      // Redirect to Google OAuth
      window.location.href = googleAuthUrl;
      return;
    }

    // Simulate social login for other providers
    login({
      name: `User from ${provider}`,
      email: `user@${provider.toLowerCase()}.com`,
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
    });

    toast({
      title: 'Welcome!',
      description: `You have successfully logged in with ${provider}.`,
    });

    navigate('/workspace');
  };

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center animate-slide-down">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-tertiary shadow-lg">
            <span className="text-2xl font-bold text-white">PF</span>
          </div>
          <h1 className="font-display mb-2 text-3xl font-normal text-foreground">Welcome Back</h1>
          <p className="font-sans text-gray-600">Sign in to access your workspace</p>
        </div>

        {/* Login Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="font-ui mb-2 block text-m font-medium text-gray-200">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 w-full rounded-lg border border-gray-700 bg-white pl-10 pr-4 text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="enter your mail"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="font-ui mb-2 block text-m font-medium text-gray-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 w-full rounded-lg border border-gray-700 bg-white pl-10 pr-4 text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="enter your password"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="ml-2 text-sm text-gray-200">Remember me</span>
              </label>
              <button type="button" className="text-sm font-medium text-primary hover:text-primary/80">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="font-ui h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Sign In
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('Google')}
              className="h-12 border-2 hover:border-primary hover:bg-primary/5"
            >
              <Chrome className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('Facebook')}
              className="h-12 border-2 hover:border-primary hover:bg-primary/5"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('Github')}
              className="h-12 border-2 hover:border-primary hover:bg-primary/5"
            >
              <Github className="h-5 w-5" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
