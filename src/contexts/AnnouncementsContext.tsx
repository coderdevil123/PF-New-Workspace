import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

interface AnnouncementsContextType {
  announcements: any[];
  unreadCount: number;
  refresh: () => void;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | null>(null);

export function AnnouncementsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const fetchAnnouncements = async () => {
    if (!user) {
      setAnnouncements([]);
      return;
    }

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/announcements`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const data = await res.json();
    setAnnouncements(Array.isArray(data) ? data : []);
  };

  // Initial fetch
  useEffect(() => {
    fetchAnnouncements();
  }, [user]);

  // 🔥 REALTIME LISTENER (THIS FIXES YOUR ISSUE)
  useEffect(() => {
    if (!user?.email) return;

    const channel = supabase
      .channel('realtime-announcements-global')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        () => {
          fetchAnnouncements(); // 🔥 instant refresh
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcement_reads' },
        () => {
          fetchAnnouncements();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcement_pins' },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email]);

  const unreadCount = announcements.filter(a => !a.is_read).length;

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
        unreadCount,
        refresh: fetchAnnouncements,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const ctx = useContext(AnnouncementsContext);
  if (!ctx) throw new Error('useAnnouncements must be used inside AnnouncementsProvider');
  return ctx;
}
