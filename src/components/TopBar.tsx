import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, User, LogOut, Settings, Users, Moon, Sun, Monitor, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useToast } from '../hooks/use-toast';
import { CheckSquare } from 'lucide-react';
import { Tooltip } from '../components/ui/Tooltip';

interface TopBarProps { onMenuClick: () => void; }

export default function TopBar({ onMenuClick }: TopBarProps) {
  const navigate    = useNavigate();
  const { toast }   = useToast();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // ── Derive isAdmin directly from user object — always reactive ──────────────
  const isAdmin = user?.is_admin === true;
  
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [announcements, setAnnouncements]       = useState<any[]>([]);
  const [annLoading, setAnnLoading]             = useState(false);

  // ── Fetch announcements only when notification dropdown opens ───────────────
  // This avoids an API call on every page load / navigation
  useEffect(() => {
    if (!notificationOpen || !user) return;
    if (announcements.length > 0) return; // already loaded, don't re-fetch

    setAnnLoading(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/announcements`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(r => r.json())
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(() => setAnnouncements([]))
      .finally(() => setAnnLoading(false));
  }, [notificationOpen, user]);

  // Clear announcements cache when user logs out
  useEffect(() => {
    if (!user) setAnnouncements([]);
  }, [user]);

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out successfully', description: 'You have been logged out of your account.' });
    navigate('/workspace');
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    toast({ title: 'Theme updated', description: `Theme changed to ${newTheme}.` });
  };

  const unreadCount          = announcements.filter(a => !a.is_read).length;
  const latestAnnouncements  = announcements.filter(a => !a.is_read).slice(0, 3);
  const themeIcons           = { light: Sun, dark: Moon, system: Monitor };
  const ThemeIcon            = themeIcons[theme];

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white dark:bg-dark-bg px-3 sm:px-4 md:px-6 shadow-sm overflow-hidden">
      
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Button
          onClick={onMenuClick}
          variant="ghost"
          size="sm"
          className="text-body-text dark:text-dark-muted hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent lg:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </Button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0">

        {/* Manager */}
        {isAdmin && (
          <Button
            onClick={() => navigate('/manager')}
            variant="ghost"
            className="hidden sm:flex items-center gap-2 rounded-lg text-heading-dark dark:text-dark-text hover:bg-light-gray dark:hover:bg-dark-hover shrink-0"
          >
            <Briefcase className="h-5 w-5 text-mint-accent" />
            <span className="hidden md:inline">Manager</span>
          </Button>
        )}

        {/* Admin */}
        {isAdmin && user && (
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="hidden sm:flex items-center gap-2 rounded-lg text-heading-dark dark:text-dark-text hover:bg-light-gray dark:hover:bg-dark-hover shrink-0"
          >
            <Shield className="h-5 w-5 text-mint-accent" />
            <span className="hidden md:inline">Admin</span>
          </Button>
        )}

        {/* Tasks */}
        {user && (
          <Tooltip label="Tasks">
            <Button
              onClick={() => navigate('/tasks')}
              variant="ghost"
              size="sm"
              className="rounded-lg shrink-0"
            >
              <CheckSquare className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          </Tooltip>
        )}

        {/* Theme */}
        <DropdownMenu>
          <Tooltip label="Theme">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-lg shrink-0">
                <ThemeIcon className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(['light', 'dark', 'system'] as const).map(t => {
              const Icon = themeIcons[t];
              return (
                <DropdownMenuItem key={t} onClick={() => handleThemeChange(t)}>
                  <Icon className="mr-2 h-4 w-4" />
                  {t}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Team (hide on xs) */}
        <Tooltip label="Team">
          <Button
            onClick={() => navigate('/team')}
            variant="ghost"
            size="sm"
            className="hidden sm:flex rounded-lg shrink-0"
          >
            <Users className="h-5 w-5" />
          </Button>
        </Tooltip>

        {/* Notifications */}
        {user && (
          <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
            <Tooltip label="Notifications">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative shrink-0">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mint-accent text-[10px] text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </Tooltip>

            {/* keep your existing dropdown content SAME */}
            <DropdownMenuContent align="end" className="w-72 sm:w-80">
              {/* NO CHANGE INSIDE */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* More Menu (for small screens) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="sm:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {isAdmin && (
              <DropdownMenuItem onClick={() => navigate('/manager')}>
                <Briefcase className="mr-2 h-4 w-4" /> Manager
              </DropdownMenuItem>
            )}
            {isAdmin && (
              <DropdownMenuItem onClick={() => navigate('/admin')}>
                <Shield className="mr-2 h-4 w-4" /> Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => navigate('/team')}>
              <Users className="mr-2 h-4 w-4" /> Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account */}
        <DropdownMenu>
          <Tooltip label="Account">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="shrink-0">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-gradient-to-br from-forest-green to-mint-accent">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </DropdownMenuTrigger>
          </Tooltip>

          {/* KEEP YOUR EXISTING ACCOUNT DROPDOWN SAME */}
          <DropdownMenuContent align="end" className="w-56">
            {/* no change */}
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}