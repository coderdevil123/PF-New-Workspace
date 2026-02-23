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
  const isAdmin = user?.role === 'admin';

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
    <header className="flex h-16 items-center justify-between border-b border-border bg-white dark:bg-dark-bg px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Button onClick={onMenuClick} variant="ghost" size="sm"
          className="text-body-text dark:text-dark-muted hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent lg:hidden">
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </Button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Manager button — visible to all logged-in users */}
        {user && (
          <Button onClick={() => navigate('/manager')} variant="ghost"
            className="flex items-center gap-2 rounded-lg text-heading-dark dark:text-dark-text hover:bg-light-gray dark:hover:bg-dark-hover">
            <Briefcase className="h-5 w-5 text-mint-accent" />
            <span className="hidden sm:inline">Manager</span>
          </Button>
        )}

        {/* Admin button — only shown when user.role === 'admin' */}
        {isAdmin && user && (
          <Button onClick={() => navigate('/admin')} variant="ghost"
            className="flex items-center gap-2 rounded-lg text-heading-dark dark:text-dark-text hover:bg-light-gray dark:hover:bg-dark-hover">
            <Shield className="h-5 w-5 text-mint-accent" />
            <span className="hidden sm:inline">Admin</span>
          </Button>
        )}

        {/* Tasks */}
        {user && (
          <Tooltip label="Tasks">
            <Button onClick={() => navigate('/tasks')} variant="ghost" size="sm"
              className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105">
              <CheckSquare className="h-5 w-5" strokeWidth={1.5} />
            </Button>
          </Tooltip>
        )}

        {/* Theme toggle */}
        <DropdownMenu>
          <Tooltip label="Theme">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm"
                className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105">
                <ThemeIcon className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-40 bg-popover text-popover-foreground">
            <DropdownMenuLabel className="text-popover-foreground">Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(['light', 'dark', 'system'] as const).map(t => {
              const Icon = themeIcons[t];
              return (
                <DropdownMenuItem key={t} onClick={() => handleThemeChange(t)}
                  className={`cursor-pointer ${theme === t ? 'bg-accent' : ''}`}>
                  <Icon className="mr-2 h-4 w-4" />
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Team */}
        <Tooltip label="Team">
          <Button onClick={() => navigate('/team')} variant="ghost" size="sm"
            className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105">
            <Users className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </Tooltip>

        {/* Notifications */}
        {user && (
          <DropdownMenu open={notificationOpen} onOpenChange={setNotificationOpen}>
            <Tooltip label="Notifications">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm"
                  className="relative rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105">
                  <Bell className="h-5 w-5" strokeWidth={1.5} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-mint-accent text-xs font-bold text-white shadow-lg">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </Tooltip>
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

              {/* Loading state */}
              {annLoading && (
                <div className="p-6 text-center">
                  <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-mint-accent border-t-transparent" />
                  <p className="mt-2 text-xs text-muted-foreground">Loading...</p>
                </div>
              )}

              {!annLoading && latestAnnouncements.length > 0 && (
                <>
                  {latestAnnouncements.map((a: any) => (
                    <DropdownMenuItem key={a.id} onClick={() => navigate('/announcements')}
                      className="cursor-pointer flex-col items-start gap-1 p-3 hover:bg-accent">
                      <div className="flex w-full items-start justify-between gap-2">
                        <p className="font-semibold text-sm text-popover-foreground line-clamp-1">{a.title}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(a.created_at || a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
                      <span className={`mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        a.category === 'Tool Update'     ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' :
                        a.category === 'Holiday'         ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' :
                        a.category === 'Company Update'  ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' :
                                                           'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'
                      }`}>{a.category}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}

              {!annLoading && latestAnnouncements.length === 0 && (
                <div className="p-8 text-center">
                  <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                </div>
              )}

              <DropdownMenuItem onClick={() => navigate('/announcements')}
                className="cursor-pointer justify-center text-mint-accent hover:bg-accent">
                View all announcements
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Account */}
        <DropdownMenu>
          <Tooltip label="Account">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm"
                className="rounded-lg text-body-text dark:text-dark-muted transition-all hover:bg-light-gray dark:hover:bg-dark-hover hover:scale-105">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-forest-green to-mint-accent shadow-md">
                  <User className="h-4 w-4 text-white" strokeWidth={1.5} />
                </div>
              </Button>
            </DropdownMenuTrigger>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground">
            <DropdownMenuLabel className="text-popover-foreground">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'guest@pristineforests.com'}</p>
                {/* Show role badge so it's clear what role is loaded */}
                {user?.role && (
                  <span className="mt-1 w-fit rounded-full bg-mint-accent/10 px-2 py-0.5 text-xs font-medium text-mint-accent capitalize">
                    {user.role.replace('_', ' ')}
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(user ? '/profile' : '/login')}
              className="cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground">
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}
              className="cursor-pointer text-popover-foreground hover:bg-accent hover:text-accent-foreground">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}
              className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}