import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Shield, Palette, Globe, Monitor, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useTheme, type Theme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-primary' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState(() => {
    const userKey = `appSettings:${localStorage.getItem('user_email')}`;
    const saved = localStorage.getItem(userKey);
    const defaultSettings = {
      notifications: {
        email: true,
        push: true,
        desktop: false,
        marketing: false,
      },
      privacy: {
        profileVisibility: 'team',
        activityStatus: true,
        dataSharing: false,
      },
      appearance: {
        language: 'en',
        timezone: 'America/New_York',
      },
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium',
      },
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to ensure all properties exist
      return {
        notifications: { ...defaultSettings.notifications, ...parsed.notifications },
        privacy: { ...defaultSettings.privacy, ...parsed.privacy },
        appearance: { ...defaultSettings.appearance, ...parsed.appearance },
        accessibility: { ...defaultSettings.accessibility, ...parsed.accessibility },
      };
    }
    return defaultSettings;
  });
  const { setLanguage } = useLanguage();

  const handleLanguageChange = (lang: string) => {
    handleSettingChange('appearance', 'language', lang);
    setLanguage(lang as any);
  };

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('text-sm', 'text-base', 'text-lg');

    if (settings.accessibility.fontSize === 'small') {
      root.classList.add('text-sm');
    } else if (settings.accessibility.fontSize === 'large') {
      root.classList.add('text-lg');
    } else {
      root.classList.add('text-base');
    }
  }, [settings.accessibility.fontSize]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Settings | Pristine Forests';
  }, []);

  useEffect(() => {
    const userKey = `appSettings:${localStorage.getItem('user_email')}`;
    localStorage.setItem(userKey, JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
    
    toast({
      title: 'Setting updated',
      description: 'Your preference has been saved.',
    });
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: 'Theme updated',
      description: `Theme changed to ${newTheme}.`,
    });
  };

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">
      {/* Header */}
      <section className="relative overflow-hidden bg-forest-gradient px-6 py-8 lg:px-12">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <Button
            onClick={() => navigate('/workspace')}
            variant="ghost"
            className="group mb-6 -ml-3 rounded-lg text-white/90 transition-all hover:bg-white/10 hover:text-white animate-slide-down"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Button>
          
          <h1 className="font-display mb-2 text-4xl font-normal text-white animate-slide-up">
            Settings
          </h1>
          <p className="font-sans text-lg text-white/80 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Customize your workspace experience and preferences
          </p>
        </div>
      </section>

      {/* Settings Content */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-8">

          {/* Appearance */}
          <div className="rounded-2xl border border-border bg-white dark:bg-dark-card p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-display text-xl font-normal text-heading-dark dark:text-dark-text">Appearance</h3>
                <p className="font-sans text-sm text-body-text dark:text-dark-muted">Customize the look and feel</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-light-gray dark:bg-dark-hover p-4">
                <div className="mb-3">
                  <p className="font-medium text-heading-dark dark:text-dark-text">Theme</p>
                  <p className="text-sm text-body-text dark:text-dark-muted">Choose your preferred theme</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light' as Theme, label: 'Light', icon: Sun },
                    { value: 'dark' as Theme, label: 'Dark', icon: Moon },
                    { value: 'system' as Theme, label: 'System', icon: Monitor },
                  ].map((themeOption) => {
                    const Icon = themeOption.icon;
                    return (
                      <button
                        key={themeOption.value}
                        onClick={() => handleThemeChange(themeOption.value)}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                          theme === themeOption.value
                            ? 'border-mint-accent bg-soft-mint dark:bg-mint-accent/20 text-forest-green dark:text-mint-accent'
                            : 'border-border bg-white dark:bg-dark-card text-body-text dark:text-dark-muted hover:border-mint-accent/50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{themeOption.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-light-gray dark:bg-dark-hover p-4">
                  <div className="mb-3">
                    <p className="font-medium text-heading-dark dark:text-dark-text">Language</p>
                    <p className="text-sm text-body-text dark:text-dark-muted">Interface language</p>
                  </div>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full rounded-lg border border-border bg-white dark:bg-dark-card px-3 py-2 text-heading-dark dark:text-dark-text focus:border-mint-accent focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                  >
                    <option value="en" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">English</option>
                    <option value="es" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Español</option>
                    <option value="fr" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Français</option>
                    <option value="de" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Deutsch</option>
                  </select>
                </div>

                <div className="rounded-lg border border-border bg-light-gray dark:bg-dark-hover p-4">
                  <div className="mb-3">
                    <p className="font-medium text-heading-dark dark:text-dark-text">Timezone</p>
                    <p className="text-sm text-body-text dark:text-dark-muted">Your local timezone</p>
                  </div>
                  <select
                    value={settings.appearance.timezone}
                    onChange={(e) => handleSettingChange('appearance', 'timezone', e.target.value)}
                    className="w-full rounded-lg border border-border bg-white dark:bg-dark-card px-3 py-2 text-heading-dark dark:text-dark-text focus:border-mint-accent focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                  >
                    <option value="America/New_York" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Eastern Time</option>
                    <option value="America/Chicago" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Central Time</option>
                    <option value="America/Denver" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Mountain Time</option>
                    <option value="America/Los_Angeles" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Pacific Time</option>
                    <option value="Europe/London" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">London</option>
                    <option value="Europe/Paris" className="bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">Paris</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="rounded-2xl border border-border bg-white dark:bg-dark-card p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/20">
                <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-display text-xl font-normal text-heading-dark dark:text-dark-text">Accessibility</h3>
                <p className="font-sans text-sm text-body-text dark:text-dark-muted">Make the platform more accessible</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* {[
                { key: 'reducedMotion', label: 'Reduced Motion', description: 'Minimize animations and transitions' },
                { key: 'highContrast', label: 'High Contrast', description: 'Increase color contrast for better visibility' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border border-border bg-light-gray dark:bg-dark-hover p-4">
                  <div>
                    <p className="font-ui font-medium text-heading-dark dark:text-dark-text">{item.label}</p>
                    <p className="font-sans text-sm text-body-text dark:text-dark-muted">{item.description}</p>
                  </div>
                  <ToggleSwitch
                    enabled={settings.accessibility[item.key as keyof typeof settings.accessibility]}
                    onChange={(value) => handleSettingChange('accessibility', item.key, value)}
                  />
                </div>
              ))} */}

              <div className="rounded-lg border border-border bg-light-gray dark:bg-dark-hover p-4">
                <div className="mb-3">
                  <p className="font-medium text-heading-dark dark:text-dark-text">Font Size</p>
                  <p className="text-sm text-body-text dark:text-dark-muted">Adjust text size for better readability</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                  ].map((size) => (
                    <button
                      key={size.value}
                      onClick={() => handleSettingChange('accessibility', 'fontSize', size.value)}
                      className={`rounded-lg border-2 p-3 text-center transition-all ${
                        settings.accessibility.fontSize === size.value
                          ? 'border-mint-accent bg-soft-mint dark:bg-mint-accent/20 text-forest-green dark:text-mint-accent'
                          : 'border-border bg-white dark:bg-dark-card text-body-text dark:text-dark-muted hover:border-mint-accent/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{size.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => {
                toast({
                  title: 'Settings saved',
                  description: 'All your preferences have been saved successfully.',
                });
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save All Settings
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
