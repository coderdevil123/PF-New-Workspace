import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Calendar, User, Pin, TrendingUp, Plus, X, Users as UsersIcon, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export default function Announcements() {
  const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Company Update':
      return 'from-blue-500 to-blue-600';
    case 'Holiday':
      return 'from-green-500 to-green-600';
    case 'Tool Update':
      return 'from-purple-500 to-purple-600';
    default:
      return 'from-gray-500 to-gray-600';
  }
};
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [userRole] = useState<'admin' | 'user'>('admin');
  const showDisabledToast = () => {
    toast({
      title: 'Currently Disabled',
      description: 'This feature will be available soon.',
    });
  };
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    category: 'Tool Update',
    content: '',
    recipients: 'all',
    taggedUsers: [] as string[],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Announcements | Pristine Forests';
  }, []);

  useEffect(() => {
  if (!token) return;

  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/announcements`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        setAnnouncements(data);
      } else {
        console.error('Announcements API did not return array:', data);
        setAnnouncements([]);
      }
    })
    .catch(err => {
      console.error('Announcement fetch error:', err);
      toast({
        title: 'Error',
        description: 'Failed to load announcements',
        variant: 'destructive',
      });
    });
  }, [token]);

  // Sort announcements: pinned first, then by date
  const sortedAnnouncements = Array.isArray(safeAnnouncements)
  ? [...safeAnnouncements].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.created_at).getTime() -
             new Date(a.created_at).getTime();
    })
  : [];

  const filteredAnnouncements = filter === 'all' 
    ? sortedAnnouncements 
    : sortedAnnouncements.filter((a: any) => a.category === filter);

  const categories = [
    'all',
    ...Array.from(
      new Set(
        Array.isArray(safeAnnouncements)
          ? safeAnnouncements.map((a: any) => a.category)
          : []
      )
    ),
  ];

  const adminCategories = ['Tool Update', 'Holiday', 'Company Update', 'Security', 'Event'];
  const userCategories = ['Issue', 'Message'];

  const availableCategories = userRole === 'admin' ? adminCategories : userCategories;

  const [teamMembers, setTeamMembers] = useState<
      { name: string; email: string }[]
    >([]);

  useEffect(() => {
  if (!token) return;

  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/team`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
    })
    .then(data => setTeamMembers(data))
    .catch(err => console.error('Team fetch error:', err));
  }, [token]);


  const handleCreateAnnouncement = () => {
    if (
      newAnnouncement.recipients === 'specific' &&
      newAnnouncement.taggedUsers.length === 0
    ) {
      toast({
        title: 'Select users',
        description: 'Please select at least one user.',
        variant: 'destructive',
      });
      return;
    }
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        category: newAnnouncement.category,
        recipients: newAnnouncement.recipients,
        taggedEmails: newAnnouncement.recipients === 'specific'
                    ? newAnnouncement.taggedUsers
                    : null,
      }),
    })

    .then(res => {
      if (!res.ok) throw new Error('Create failed');
      return res.json();
    })
    .then(() => {
      toast({
        title: 'Announcement Created',
        description: 'Your announcement has been published.',
      });

      setCreateModalOpen(false);
      setNewAnnouncement({
        title: '',
        category: 'Tool Update',
        content: '',
        recipients: 'all',
        taggedUsers: [],
      });

      // 🔥 RE-FETCH announcements
      return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/announcements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setAnnouncements(data);
      } else {
        setAnnouncements([]);
      }
    })

    .catch(err => {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to create announcement',
        variant: 'destructive',
      });
    });
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!token) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this announcement?'
    );

    if (!confirmDelete) return;

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/announcements/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      toast({
        title: 'Delete failed',
        description: 'You are not allowed to delete this announcement.',
        variant: 'destructive',
      });
      return;
    }

    // Optimistic UI update
    setAnnouncements(prev =>
      prev.filter(a => a.id !== id)
    );

    toast({
      title: 'Announcement deleted',
      description: 'The announcement has been removed.',
    });
  };


  const handleMarkAsRead = async (id: string) => {
  if (!token) return;

  await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/announcements/${id}/read`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Optimistic update
  setAnnouncements(prev =>
    prev.map(a =>
      a.id === id ? { ...a, is_read: true } : a
    )
  );
};

  const handleTogglePin = async (id: string) => {
    if (!token) return;

    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/announcements/${id}/pin`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Optimistic update
    setAnnouncements(prev =>
      prev.map(a =>
        a.id === id ? { ...a, is_pinned: !a.is_pinned } : a
      )
    );
  };

  const toggleTaggedUser = (email: string) => {
    setNewAnnouncement(prev => ({
      ...prev,
      taggedUsers: prev.taggedUsers.includes(email)
        ? prev.taggedUsers.filter(e => e !== email)
        : [...prev.taggedUsers, email],
    }));
  };


  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">
      {/* Header */}
      <section className="relative overflow-hidden bg-forest-gradient px-6 py-8 lg:px-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                onClick={() => navigate('/workspace')}
                variant="ghost"
                className="group -ml-3 rounded-lg text-white/90 transition-all hover:bg-white/10 hover:text-white animate-slide-down"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg animate-slide-up">
                  <Bell className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <h1 className="font-display mb-1 text-2xl sm:text-4xl font-normal text-white">
                    Announcements
                  </h1>
                  <p className="font-sans text-sm sm:text-lg text-white/80">
                    Stay updated with the latest news
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCreateModalOpen(true)}
              className="rounded-full bg-mint-accent text-forest-dark font-semibold shadow-lg shadow-mint hover:bg-mint-accent/90 animate-slide-up whitespace-nowrap"
              style={{ animationDelay: '0.2s' }}
            >
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Create Announcement</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-border bg-white dark:bg-dark-card px-6 py-4 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-2 animate-slide-up">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter === category
                    ? 'bg-mint-accent text-white shadow-md'
                    : 'bg-light-gray dark:bg-dark-hover text-body-text dark:text-dark-muted hover:bg-soft-mint dark:hover:bg-dark-accent hover:text-forest-green dark:hover:text-mint-accent'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements List */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-6">
          {filteredAnnouncements.map((announcement: any, index: number) => {
            const isRead = announcement.is_read;
            
            return (
              <div
                key={announcement.id}
                className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-dark-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover animate-slide-up ${
                  isRead ? 'border-border opacity-60' : 'border-mint-accent/30'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${getCategoryColor(announcement.category)}`} />

                <div className="p-8">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        {announcement.isPinned && (
                          <div className="flex items-center gap-1 rounded-full bg-mint-accent/10 border border-mint-accent/30 px-3 py-1 text-xs font-medium text-mint-accent">
                            <Pin className="h-3 w-3" />
                            Pinned
                          </div>
                        )}
                        <span className={`rounded-full bg-gradient-to-r ${getCategoryColor(announcement.category)} px-3 py-1 text-xs font-medium text-white`}>
                          {announcement.category}
                        </span>
                        {announcement.recipients !== 'all' && (
                          <div className="flex items-center gap-1 rounded-full bg-soft-mint dark:bg-mint-accent/20 px-3 py-1 text-xs font-medium text-forest-green dark:text-mint-accent">
                            <UsersIcon className="h-3 w-3" />
                            Tagged
                          </div>
                        )}
                        {isRead && (
                          <div className="flex items-center gap-1 rounded-full bg-green-600 dark:bg-green-500/20 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                            <Check className="h-3 w-3" />
                            Read
                          </div>
                        )}
                      </div>
                      <h3 className="font-display mb-2 text-2xl font-normal text-heading-dark dark:text-dark-text transition-colors group-hover:text-forest-green dark:group-hover:text-mint-accent">
                        {announcement.title}
                      </h3>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleTogglePin(announcement.id)}
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 rounded-lg p-0 transition ${
                          announcement.is_pinned
                            ? 'text-mint-accent'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Pin / Unpin"
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      {!isRead && (
                        <Button
                          onClick={() => handleMarkAsRead(announcement.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 rounded-lg p-0 text-green-600 hover:bg-green-100 dark:hover:bg-green-500/20"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    {announcement.created_by === user?.email && (
                      <Button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-lg p-0 text-destructive hover:bg-destructive/10"
                        title="Delete announcement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    </div>
                  </div>

                  <p className="font-sans mb-6 leading-relaxed text-body-text dark:text-dark-text-secondary">
                    {announcement.content}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-muted-text dark:text-dark-muted">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        {announcement.created_by_name || announcement.created_by}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(announcement.created_at || announcement.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>

                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${getCategoryColor(announcement.category)} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border bg-light-gray dark:bg-dark-card px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Bell, label: 'Total Announcements', value: safeAnnouncements.length, color: 'from-blue-500 to-cyan-500' },
              { icon: Pin, label: 'Pinned', value: safeAnnouncements.filter((a: any) => a.is_pinned).length, color: 'from-purple-500 to-pink-500' },
              { icon: TrendingUp, label: 'Unread', value: safeAnnouncements.filter(a => !a.is_read).length, color: 'from-green-500 to-emerald-500' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-white dark:bg-dark-card-elevated p-6 text-center shadow-card transition-all hover:shadow-card-hover animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mb-1 text-3xl font-bold text-heading-dark dark:text-dark-text">{stat.value}</div>
                  <div className="text-sm font-medium text-body-text dark:text-dark-muted">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Create Announcement Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-dark-card text-heading-dark dark:text-dark-text">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-normal">Create New Announcement</DialogTitle>
            <DialogDescription className="text-body-text dark:text-dark-muted">
              {userRole === 'admin' 
                ? 'Share important updates with your team' 
                : 'Report an issue or share a message with the team'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="font-ui mb-2 block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="h-11 w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-4 text-heading-dark dark:text-dark-text transition-all focus:border-mint-accent focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                placeholder="Enter announcement title"
              />
            </div>

            {/* Category */}
            <div>
              <label className="font-ui mb-2 block text-sm font-medium">
                Category
              </label>
              <select
                value={newAnnouncement.category}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                className="h-11 w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-4 text-heading-dark dark:text-dark-text transition-all focus:border-mint-accent focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
              >
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="font-ui mb-2 block text-sm font-medium">
                Content
              </label>
              <textarea
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                rows={5}
                className="w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-4 py-3 text-heading-dark dark:text-dark-text transition-all focus:border-mint-accent focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                placeholder="Write your announcement content..."
              />
            </div>

            {/* Recipients */}
            <div>
              <label className="font-ui mb-2 block text-sm font-medium">
                Recipients
              </label>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewAnnouncement({ ...newAnnouncement, recipients: 'all', taggedUsers: [] })}
                    className={`flex-1 rounded-lg border-2 p-3 text-center transition-all ${
                      newAnnouncement.recipients === 'all'
                        ? 'border-mint-accent bg-soft-mint dark:bg-mint-accent/20 text-forest-green dark:text-mint-accent'
                        : 'border-border bg-light-gray dark:bg-dark-hover text-body-text dark:text-dark-muted hover:border-mint-accent/50'
                    }`}
                  >
                    <UsersIcon className="mx-auto mb-1 h-5 w-5" />
                    <span className="text-sm font-medium">All Team</span>
                  </button>
                  <button
                    onClick={() => setNewAnnouncement({ ...newAnnouncement, recipients: 'specific' })}
                    className={`flex-1 rounded-lg border-2 p-3 text-center transition-all ${
                      newAnnouncement.recipients === 'specific'
                        ? 'border-mint-accent bg-soft-mint dark:bg-mint-accent/20 text-forest-green dark:text-mint-accent'
                        : 'border-border bg-light-gray dark:bg-dark-hover text-body-text dark:text-dark-muted hover:border-mint-accent/50'
                    }`}
                  >
                    <User className="mx-auto mb-1 h-5 w-5" />
                    <span className="text-sm font-medium">Specific Users</span>
                  </button>
                </div>

                {newAnnouncement.recipients === 'specific' && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {teamMembers.map(member => (
                        <button
                          key={member.email}
                          type="button"
                          onClick={() => toggleTaggedUser(member.email)}
                          className={`rounded-md border px-3 py-2 text-sm ${
                            newAnnouncement.taggedUsers.includes(member.email)
                              ? 'border-primary bg-primary/10'
                              : 'border-border'
                          }`}
                        >
                          {member.name}
                        </button>
                      ))}
                    </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-border pt-6">
              <Button
                onClick={() => setCreateModalOpen(false)}
                variant="outline"
                className="rounded-full border-border dark:border-dark-border text-body-text dark:text-dark-muted hover:bg-light-gray dark:hover:bg-dark-hover"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAnnouncement}
                className="rounded-full bg-mint-accent text-forest-dark font-semibold hover:bg-mint-accent/90"
              >
                Publish Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
