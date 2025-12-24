import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, User, LogOut, Settings, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useToast } from '../hooks/use-toast';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    });
    navigate('/workspace');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white dark:bg-dark-bg px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Button
          onClick={onMenuClick}
          variant="ghost"
          size="sm"
          className="text-body-text dark:text-dark-muted hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent lg:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </Button>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text transition-colors" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search tools..."
            className="h-10 w-64 rounded-full border border-border bg-light-gray dark:bg-dark-card pl-10 pr-4 text-sm text-heading-dark dark:text-dark-text placeholder:text-muted-text dark:placeholder:text-dark-muted transition-all focus:border-mint-accent focus:bg-white dark:focus:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setSearchOpen(!searchOpen)}
          variant="ghost"
          size="sm"
          className="text-body-text dark:text-dark-muted hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent md:hidden"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </Button>

        <Button
          onClick={() => navigate('/team')}
          variant="ghost"
          size="sm"
          className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105"
        >
          <Users className="h-5 w-5" strokeWidth={1.5} />
        </Button>

        <Button
          onClick={() => navigate('/announcements')}
          variant="ghost"
          size="sm"
          className="relative rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105"
        >
          <Bell className="h-5 w-5" strokeWidth={1.5} />
          <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-mint-accent"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:scale-105"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-forest-green to-mint-accent shadow-md">
                <User className="h-4 w-4 text-white" strokeWidth={1.5} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground">
            <DropdownMenuLabel className="text-popover-foreground">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'guest@pristineforests.com'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => {
                if (!user) {
                  navigate('/login');
                } else {
                  navigate('/profile');
                }
              }}
              className="cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate('/settings')}
              className="cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Search */}
      {searchOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-border bg-white dark:bg-dark-bg p-4 shadow-lg animate-slide-down md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text dark:text-dark-muted" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search tools..."
              className="h-10 w-full rounded-full border border-border bg-light-gray dark:bg-dark-card pl-10 pr-4 text-sm text-heading-dark dark:text-dark-text placeholder:text-muted-text dark:placeholder:text-dark-muted transition-all focus:border-mint-accent focus:bg-white dark:focus:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
            />
          </div>
        </div>
      )}
    </header>
  );
}
