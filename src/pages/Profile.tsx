import { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Camera, Edit3, Save, X, MessageSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
// import { supabase } from '../lib/supabase';

const mapProfile = (data: any) => ({
  name: data.name,
  email: data.email,
  phone: data.phone || '',
  location: data.location || '',
  bio: data.bio || '',
  mattermost: data.mattermost || '',
  avatar: data.avatar_url || '',
  role: data.role || 'Member',
  department: data.department || 'General',
  joinDate: data.created_at
    ? new Date(data.created_at).toLocaleDateString()
    : '—',
});

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const [profileData, setProfileData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Profile | Pristine Forests';
  }, []);

  // Handle browser back/forward and link clicks
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Intercept navigation attempts
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!hasUnsavedChanges) return;
      
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.href.includes(location.pathname)) {
        e.preventDefault();
        setShowDialog(true);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [hasUnsavedChanges, location.pathname]);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      setProfileData(mapProfile(data));
      setEditData(mapProfile(data));
    });
}, []);

  useEffect(() => {
    const isDifferent = JSON.stringify(editData) !== JSON.stringify(profileData);
    setHasUnsavedChanges(isDifferent && isEditing);
  }, [editData, profileData, isEditing]);

  if (!profileData || !editData) {
  return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">
      Loading profile...
    </div>
  );
}

  const handleSave = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: editData.name,
        phone: editData.phone,
        bio: editData.bio,
        location: editData.location,
        mattermost: editData.mattermost,
        avatar_url: editData.avatar,
      }),
    });

    if (!res.ok) {
      toast({
        title: 'Update failed',
        description: 'Could not save profile',
        variant: 'destructive',
      });
      return;
    }

    const updated = await res.json();
    setProfileData(mapProfile(updated));
    setEditData(mapProfile(updated));
    setIsEditing(false);
    setHasUnsavedChanges(false);

    toast({
      title: 'Profile updated',
      description: 'Changes saved successfully',
    });
  };

const uploadAvatar = async (file: File) => {
  const form = new FormData();
  form.append('avatar', file);

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: form,
  });

  const data = await res.json();
  setEditData((prev: any) => ({ ...prev, avatar: data.avatar_url }));
};


  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleSaveAndNavigate = () => {
    handleSave();
    setShowDialog(false);
  };

  const handleDiscardAndNavigate = () => {
    setEditData(profileData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setShowDialog(false);
  };

  const handleCancelNavigation = () => {
    setShowDialog(false);
  };

  const handleNavigateAway = () => {
    if (hasUnsavedChanges) {
      setShowDialog(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1
        }
      });

      const options = {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000
      };

      const recorder = new MediaRecorder(stream, options);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

    } catch (err) {
      console.error("Mic error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  const deleteRecording = () => {
    setAudioURL(null);
  };

  const retryRecording = () => {
    setAudioURL(null);
    startRecording();
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
            onClick={() => {
              if (hasUnsavedChanges) {
                setShowDialog(true);
              } else {
                navigate('/workspace');
              }
            }}
            variant="ghost"
            className="group mb-6 -ml-3 rounded-lg text-white/90 transition-all hover:bg-white/10 hover:text-white animate-slide-down"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display mb-2 text-4xl sm:text-4xl font-normal text-white animate-slide-up">
                My Profile
              </h1>
              <p className="font-sans text-lg text-white/80 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Manage your account information and preferences
              </p>
            </div>
            
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-mint-accent text-forest-dark font-semibold shadow-lg shadow-mint hover:bg-mint-accent/90 animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="rounded-full border-2 border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="rounded-full bg-mint-accent text-forest-dark font-semibold shadow-lg shadow-mint hover:bg-mint-accent/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="mint-corner-accent rounded-2xl border border-border bg-white dark:bg-dark-card p-5 sm:p-8 shadow-card animate-slide-up">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-6 h-24 w-24 sm:h-32 sm:w-32">
                    {profileData.avatar ? (
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="h-full w-full rounded-full object-cover shadow-lg"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-forest-green to-mint-accent text-4xl font-bold text-white shadow-lg">
                        {profileData.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    )}
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          id="avatar-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadAvatar(file);
                          }}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110"
                        >
                          <Camera className="h-5 w-5 text-gray-600" />
                        </label>
                      </>
                    )}
                  </div>

                  <h2 className="font-display mb-2 text-2xl font-normal text-heading-dark dark:text-dark-text">
                    {profileData.name}
                  </h2>
                  <p className="font-ui mb-1 text-mint-accent font-medium">
                    {profileData.role}
                  </p>
                  <p className="font-sans text-body-text dark:text-dark-muted">
                    {profileData.department}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 space-y-4 border-t border-border pt-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-text" />
                    <span className="text-body-text">Joined {profileData.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-text" />
                    <span className="text-body-text">{profileData.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="mint-corner-accent rounded-2xl border border-border bg-white dark:bg-dark-card p-5 sm:p-8 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="font-display mb-6 text-xl font-normal text-heading-dark dark:text-dark-text">
                  Profile Information
                </h3>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="font-ui mb-2 block text-sm font-medium text-body-text">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-4 py-3 text-heading-dark dark:text-dark-text transition-all focus:border-mint-accent focus:bg-white dark:focus:bg-dark-card focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                      />
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-light-gray dark:bg-dark-hover px-4 py-3">
                        <User className="h-5 w-5 text-muted-text dark:text-dark-muted" />
                        <span className="text-heading-dark dark:text-dark-text">{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="font-ui mb-2 block text-sm font-medium text-body-text">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="opacity-60 cursor-not-allowed"
                      />
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-light-gray px-4 py-3">
                        <Mail className="h-5 w-5 text-muted-text" />
                        <span className="text-heading-dark">{profileData.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="font-ui mb-2 block text-sm font-medium text-body-text">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full rounded-lg border border-border bg-light-gray px-4 py-3 text-heading-dark transition-all focus:border-mint-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                      />
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-light-gray px-4 py-3">
                        <Phone className="h-5 w-5 text-muted-text" />
                        <span className="text-heading-dark">{profileData.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Mattermost */}
                  <div>
                    <label className="font-ui mb-2 block text-sm font-medium text-body-text">
                      Mattermost ID
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.mattermost}
                        onChange={(e) =>
                          setEditData({ ...editData, mattermost: e.target.value })
                        }
                        placeholder="@username"
                        className="w-full rounded-lg border border-border bg-light-gray px-4 py-3 text-heading-dark transition-all focus:border-mint-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                      />
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-light-gray px-4 py-3">
                        <MessageSquare className="h-5 w-5 text-muted-text" />
                        <span className="text-heading-dark">
                          {profileData.mattermost || '—'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="font-ui mb-2 block text-sm font-medium text-body-text">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        className="w-full rounded-lg border border-border bg-light-gray px-4 py-3 text-heading-dark transition-all focus:border-mint-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                      />
                    ) : (
                      <div className="flex items-center gap-3 rounded-lg border border-border bg-light-gray px-4 py-3">
                        <MapPin className="h-5 w-5 text-muted-text" />
                        <span className="text-heading-dark">{profileData.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="font-ui mb-2 block text-sm font-medium text-body-text">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-border bg-light-gray px-4 py-3 text-heading-dark transition-all focus:border-mint-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-mint-accent/20"
                      />
                    ) : (
                      <div className="rounded-lg border border-border bg-light-gray px-4 py-3">
                        <p className="text-heading-dark leading-relaxed">{profileData.bio}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-ui mb-2 block text-sm font-medium text-body-text">
                      Voice Sample
                    </label>

                    <Button
                      onClick={() => setVoiceDialogOpen(true)}
                      variant="outline"
                      className="
                        w-full justify-start rounded-lg border border-border
                        bg-light-gray text-heading-dark
                        dark:bg-dark-hover dark:text-dark-text
                        hover:bg-white dark:hover:bg-dark-card
                      "
                    >
                      🎙 Record Voice Sample
                    </Button>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {[
                  { label: 'Tools Used', value: '24' },
                  { label: 'Projects', value: '12' },
                  { label: 'Team Size', value: '8' },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border bg-white dark:bg-dark-card p-6 text-center shadow-card transition-all hover:shadow-card-hover animate-slide-up"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="mx-auto mb-3 h-12 w-12 rounded-lg bg-soft-mint dark:bg-mint-accent/20 flex items-center justify-center text-forest-green dark:text-mint-accent font-bold text-lg">
                      {stat.value}
                    </div>
                    <p className="font-ui text-sm font-medium text-body-text dark:text-dark-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unsaved Changes Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-popover text-popover-foreground">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              You have unsaved changes. Do you want to save them before leaving?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancelNavigation}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleDiscardAndNavigate}
              className="border-gray-300 text-destructive hover:bg-destructive/10"
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleSaveAndNavigate}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={voiceDialogOpen} onOpenChange={setVoiceDialogOpen}>
        <DialogContent className="max-w-2xl bg-white dark:bg-dark-card">
          <DialogHeader>
            <DialogTitle className="text-heading-dark dark:text-dark-text">
              Reading Sample
            </DialogTitle>
            <DialogDescription className="text-body-text dark:text-dark-muted">
              Please read the following paragraph clearly and naturally.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-64 overflow-y-auto rounded-lg border border-border bg-light-gray dark:bg-dark-hover p-4 text-sm leading-relaxed text-heading-dark dark:text-dark-text space-y-3">
            <p>
              Hello, this is my voice sample for identification and verification purposes.
              I am speaking in a calm, natural tone at a comfortable pace...
            </p>

            <p>
              The quick brown fox jumps over the lazy dog near the quiet river bank at sunset.
              She sells sea shells by the seashore...
            </p>

            <p>
              Red leather, yellow leather.
              Unique New York, unique New York.
              Freshly fried flying fish.
            </p>

            <p>
              Clear communication requires clarity, confidence, and consistency in delivery.
            </p>

            <p>
              Thank you for listening. This concludes my voice enrollment sample.
            </p>
          </div>

          {/* Recording Controls */}
          <div className="mt-6 flex flex-col gap-4">

            {!isRecording && !audioURL && (
              <Button
                onClick={startRecording}
                className="bg-mint-accent text-forest-dark hover:bg-mint-accent/90"
              >
                🎙 Start Recording
              </Button>
            )}

            {isRecording && (
              <Button
                onClick={stopRecording}
                variant="destructive"
              >
                ⏹ Stop Recording
              </Button>
            )}

            {audioURL && (
              <div className="space-y-4">
                <audio controls src={audioURL} className="w-full" />

                <div className="flex gap-3">
                  <Button variant="outline" onClick={retryRecording}>
                    Retry
                  </Button>

                  <Button variant="outline" onClick={deleteRecording}>
                    Delete
                  </Button>

                  <Button className="bg-mint-accent text-forest-dark hover:bg-mint-accent/90">
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


