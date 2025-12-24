import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Calendar, User, Pin, TrendingUp, Plus, X, Users as UsersIcon } from 'lucide-react';
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

const initialAnnouncements = [
  {
    id: 1,
    title: 'New Design Tool Added: Framer',
    author: 'Design Team',
    date: '2024-01-15',
    category: 'Tool Update',
    isPinned: true,
    content: 'We\'re excited to announce that Framer has been added to our design tools collection. This powerful prototyping tool will help our team create more interactive and dynamic designs.',
    color: 'from-purple-500 to-pink-500',
    recipients: 'all',
  },
  {
    id: 2,
    title: 'Holiday Schedule - Winter Break',
    author: 'HR Team',
    date: '2024-01-10',
    category: 'Holiday',
    isPinned: true,
    content: 'Our office will be closed from December 24th to January 2nd for the winter holidays. Emergency support will be available via email. Happy holidays to everyone!',
    color: 'from-blue-500 to-cyan-500',
    recipients: 'all',
  },
  {
    id: 3,
    title: 'Q1 2024 Goals and Objectives',
    author: 'Leadership Team',
    date: '2024-01-08',
    category: 'Company Update',
    isPinned: false,
    content: 'As we kick off the new year, here are our key objectives for Q1: Expand our tool library by 20%, improve user onboarding experience, and launch the mobile app beta.',
    color: 'from-green-500 to-emerald-500',
    recipients: 'all',
  },
];

export default function Announcements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>('all');
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [userRole] = useState<'admin' | 'user'>('admin'); // Simulated role
  
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

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.category === filter);

  const categories = ['all', ...Array.from(new Set(announcements.map(a => a.category)))];

  const categoryColors: Record<string, string> = {
    'Tool Update': 'from-purple-500 to-pink-500',
    'Holiday': 'from-blue-500 to-cyan-500',
    'Company Update': 'from-green-500 to-emerald-500',
    'Security': 'from-red-500 to-orange-500',
    'Event': 'from-indigo-500 to-purple-500',
    'Issue': 'from-orange-500 to-red-500',
    'Message': 'from-cyan-500 to-blue-500',
  };

  const adminCategories = ['Tool Update', 'Holiday', 'Company Update', 'Security', 'Event'];
  const userCategories = ['Issue', 'Message'];

  const availableCategories = userRole === 'admin' ? adminCategories : userCategories;

  const teamMembers = ['John Doe', 'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim'];

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const announcement = {
      id: announcements.length + 1,
      title: newAnnouncement.title,
      author: user?.name || 'Anonymous',
      date: new Date().toISOString().split('T')[0],
      category: newAnnouncement.category,
      isPinned: false,
      content: newAnnouncement.content,
      color: categoryColors[newAnnouncement.category] || 'from-gray-500 to-gray-600',
      recipients: newAnnouncement.recipients,
      taggedUsers: newAnnouncement.taggedUsers,
    };

    setAnnouncements([announcement, ...announcements]);
    setCreateModalOpen(false);
    setNewAnnouncement({
      title: '',
      category: userRole === 'admin' ? 'Tool Update' : 'Issue',
      content: '',
      recipients: 'all',
      taggedUsers: [],
    });

    toast({
      title: 'Announcement Created',
      description: 'Your announcement has been published successfully.',
    });
  };

  const toggleTaggedUser = (userName: string) => {
    setNewAnnouncement(prev => ({
      ...prev,
      taggedUsers: prev.taggedUsers.includes(userName)
        ? prev.taggedUsers.filter(u => u !== userName)
        : [...prev.taggedUsers, userName],
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/workspace')}
                variant="ghost"
                className="group -ml-3 rounded-lg text-white/90 transition-all hover:bg-white/10 hover:text-white animate-slide-down"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg animate-slide-up">
                  <Bell className="h-7 w-7 text-white" />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <h1 className="font-display mb-1 text-4xl font-normal text-white">
                    Announcements
                  </h1>
                  <p className="font-sans text-lg text-white/80">
                    Stay updated with the latest news
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setCreateModalOpen(true)}
              className="rounded-full bg-mint-accent text-forest-dark font-semibold shadow-lg shadow-mint hover:bg-mint-accent/90 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Announcement
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
          {filteredAnnouncements.map((announcement, index) => (
            <div
              key={announcement.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white dark:bg-dark-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`h-2 bg-gradient-to-r ${announcement.color}`} />

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
                      <span className={`rounded-full bg-gradient-to-r ${announcement.color} px-3 py-1 text-xs font-medium text-white`}>
                        {announcement.category}
                      </span>
                      {announcement.recipients !== 'all' && (
                        <div className="flex items-center gap-1 rounded-full bg-soft-mint dark:bg-mint-accent/20 px-3 py-1 text-xs font-medium text-forest-green dark:text-mint-accent">
                          <UsersIcon className="h-3 w-3" />
                          Tagged
                        </div>
                      )}
                    </div>
                    <h3 className="font-display mb-2 text-2xl font-normal text-heading-dark dark:text-dark-text transition-colors group-hover:text-forest-green dark:group-hover:text-mint-accent">
                      {announcement.title}
                    </h3>
                  </div>
                </div>

                <p className="font-sans mb-6 leading-relaxed text-body-text dark:text-dark-text-secondary">
                  {announcement.content}
                </p>

                <div className="flex items-center gap-6 text-sm text-muted-text dark:text-dark-muted">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{announcement.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(announcement.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>

              <div className={`absolute inset-0 bg-gradient-to-r ${announcement.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border bg-light-gray dark:bg-dark-card px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Bell, label: 'Total Announcements', value: announcements.length, color: 'from-blue-500 to-cyan-500' },
              { icon: Pin, label: 'Pinned', value: announcements.filter(a => a.isPinned).length, color: 'from-purple-500 to-pink-500' },
              { icon: TrendingUp, label: 'This Month', value: announcements.filter(a => new Date(a.date).getMonth() === new Date().getMonth()).length, color: 'from-green-500 to-emerald-500' },
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
                  <div className="rounded-lg border border-border bg-light-gray dark:bg-dark-hover p-4">
                    <p className="mb-3 text-sm font-medium text-body-text dark:text-dark-text">Tag Users:</p>
                    <div className="flex flex-wrap gap-2">
                      {teamMembers.map(member => (
                        <button
                          key={member}
                          onClick={() => toggleTaggedUser(member)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                            newAnnouncement.taggedUsers.includes(member)
                              ? 'bg-mint-accent text-white'
                              : 'bg-white dark:bg-dark-card border border-border text-body-text dark:text-dark-muted hover:border-mint-accent/50'
                          }`}
                        >
                          {member}
                        </button>
                      ))}
                    </div>
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
