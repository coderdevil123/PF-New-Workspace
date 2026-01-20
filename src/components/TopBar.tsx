import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, User, LogOut, Settings, Users, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
import { CheckSquare } from 'lucide-react';

// import { useAnnouncements } from '../contexts/AnnouncementsContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  // const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
  if (!user) {
    setAnnouncements([]);
    return;
  }

  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/announcements`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then(res => res.json())
    .then(data => setAnnouncements(Array.isArray(data) ? data : []))
    .catch(() => setAnnouncements([]));
}, [user]);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account.',
    });
    navigate('/workspace');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({
      title: 'Theme updated',
      description: `Theme changed to ${newTheme}.`,
    });
  };

  // Get unread announcements from localStorage
  // const getUnreadCount = () => {
  //   const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
  //   const readAnnouncements = JSON.parse(localStorage.getItem('readAnnouncements') || '[]');
  //   return announcements.filter((a: any) => !readAnnouncements.includes(a.id)).length;
  // };

  // const getLatestAnnouncements = () => {
  //   const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
  //   const readAnnouncements = JSON.parse(localStorage.getItem('readAnnouncements') || '[]');
  //   return announcements
  //     .filter((a: any) => !readAnnouncements.includes(a.id))
  //     .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  //     .slice(0, 3);
  // };

  const unreadCount = announcements.filter(a => !a.is_read).length;
  const latestAnnouncements = announcements
  .filter(a => !a.is_read)
  .slice(0, 3);

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[theme];

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
        
        {/* <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text transition-colors" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search tools..."
            className="h-10 w-64 rounded-full border border-border bg-light-gray dark:bg-dark-card pl-10 pr-4 text-sm text-heading-dark dark:text-dark-text placeholder:text-muted-text dark:placeholder:text-dark-muted transition-all focus:border-mint-accent focus:bg-white dark:focus:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
          />
        </div> */}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* <Button
          onClick={() => setSearchOpen(!searchOpen)}
          variant="ghost"
          size="sm"
          className="text-body-text dark:text-dark-muted hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent md:hidden"
        >
          <Search className="h-5 w-5" strokeWidth={1.5} />
        </Button> */}

        {/* Theme Toggle Dropdown */}
        <DropdownMenu>
          <Button
              onClick={() => navigate('/tasks')}
              variant="ghost"
              size="sm"
              className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105"
            >
              <CheckSquare className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105"
            >
              <ThemeIcon className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-popover text-popover-foreground">
            <DropdownMenuLabel className="text-popover-foreground">Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem 
              onClick={() => handleThemeChange('light')}
              className={`cursor-pointer ${theme === 'light' ? 'bg-accent' : ''}`}
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleThemeChange('dark')}
              className={`cursor-pointer ${theme === 'dark' ? 'bg-accent' : ''}`}
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleThemeChange('system')}
              className={`cursor-pointer ${theme === 'system' ? 'bg-accent' : ''}`}
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() => navigate('/team')}
          variant="ghost"
          size="sm"
          className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105"
        >
          <Users className="h-5 w-5" strokeWidth={1.5} />
        </Button>

        {/* Notifications with Preview */}
        {user && (
        <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105"
            >
              <Bell className="h-5 w-5" strokeWidth={1.5} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-mint-accent text-xs font-bold text-white shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover text-popover-foreground">
            <DropdownMenuLabel className="flex items-center justify-between text-popover-foreground">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-mint-accent/20 px-2 py-0.5 text-xs font-semibold text-mint-accent">
                  {unreadCount} new
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {latestAnnouncements.length > 0 ? (
              <>
                {latestAnnouncements.map((announcement: any) => (
                  <DropdownMenuItem 
                    key={announcement.id}
                    onClick={() => navigate('/announcements')}
                    className="cursor-pointer flex-col items-start gap-1 p-3 hover:bg-accent"
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-popover-foreground line-clamp-1">
                        {announcement.title}
                      </p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {announcement.content}
                    </p>
                    <span className={`mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      announcement.category === 'Tool Update' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' :
                      announcement.category === 'Holiday' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' :
                      announcement.category === 'Company Update' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'
                    }`}>
                      {announcement.category}
                    </span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => navigate('/announcements')}
                  className="cursor-pointer justify-center text-mint-accent hover:bg-accent"
                >
                  View all announcements
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <div className="p-8 text-center">
                  <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => navigate('/announcements')}
                  className="cursor-pointer justify-center text-mint-accent hover:bg-accent"
                >
                  View all announcements
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        )}
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
      {/* {searchOpen && (
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
      )} */}
    </header>
  );
}
