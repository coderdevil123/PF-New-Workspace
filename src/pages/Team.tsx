import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Users, Mail, MessageSquare, Phone, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { useAuth } from '../contexts/AuthContext';
import { teamMembers as defaultTeam } from '../data/teamMembers';

type TeamMember = {
  id: string | number;
  name: string; email: string; role: string; department: string;
  bio?: string; phone?: string; location?: string;
  mattermost?: string; image?: string; avatar_url?: string;
};

const formatRole = (role: string) => {
  if (!role) return '';
  return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
const formatDepartment = (dept: string) => {
  if (!dept) return '';
  return dept.charAt(0).toUpperCase() + dept.slice(1);
};

// Skeleton card for loading state
function MemberCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-white dark:bg-dark-card shadow-card overflow-hidden animate-pulse">
      <div className="h-48 sm:h-56 bg-gray-100 dark:bg-dark-hover" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="h-4 bg-gray-100 dark:bg-dark-hover rounded w-3/4" />
        <div className="h-3 bg-gray-100 dark:bg-dark-hover rounded w-1/2" />
        <div className="h-3 bg-gray-100 dark:bg-dark-hover rounded w-1/3" />
        <div className="border-t border-border pt-3 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-gray-100 dark:bg-dark-hover" />
          <div className="h-3 bg-gray-100 dark:bg-dark-hover rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading]               = useState(true);
  const [members, setMembers]               = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [editingMember, setEditingMember]   = useState<TeamMember | null>(null);
  const [rbacOpen, setRbacOpen]             = useState(false);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const isAdmin = user?.role === 'admin';

  // ── Load team ─────────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Our Team | Pristine Forests';

    const token    = localStorage.getItem('token');
    const endpoint = token
      ? `${import.meta.env.VITE_BACKEND_URL}/api/team`
      : `${import.meta.env.VITE_BACKEND_URL}/api/team/public`;

    fetch(endpoint, { headers: token ? { Authorization: `Bearer ${token}` } : undefined })
      .then(r => { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(dbMembers => {
        if (!Array.isArray(dbMembers)) { setMembers(defaultTeam); return; }

        const dbMap = new Map(dbMembers.map((m: any) => [m.email, m]));

        const merged = defaultTeam.map(def => {
          const db = dbMap.get(def.email);
          if (!db) return { ...def, role: def.role || 'member', department: def.department || 'general' };
          return {
            ...def, ...db,
            role:       db.role       || def.role       || 'member',
            department: db.department || def.department || 'general',
            avatar_url: db.avatar_url || def.image,
          };
        });

        const dbOnly = dbMembers.filter((db: any) => !defaultTeam.some(def => def.email === db.email));
        setMembers([...merged, ...dbOnly]);
      })
      .catch(() => setMembers(defaultTeam))
      .finally(() => setLoading(false));
  }, []);

  // ── Grouped by role ───────────────────────────────────────────────────────
  const leadership = members.filter(m => m.role === 'admin');
  const heads      = members.filter(m => m.role === 'team_lead');
  const interns    = members.filter(m => m.role === 'intern');
  const others     = members.filter(m => !['admin', 'team_lead', 'intern'].includes(m.role));

  const handleMattermostClick = (mattermost: string) => {
    window.open(`https://chat.pristineforests.com/pristine-forests/messages/${mattermost}`, '_blank');
  };

  // ── Section renderer — shows skeletons while loading ─────────────────────
  const renderSection = (
    title: string,
    sectionMembers: TeamMember[],
    bgClass = ''
  ) => (
    <section className={`px-6 py-12 lg:px-12 ${bgClass}`}>
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">
          {title}
        </h2>
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <MemberCardSkeleton key={i} />)
            : sectionMembers.map((member, index) => (
                <MemberCard key={member.email} member={member} index={index}
                  onClick={() => setSelectedMember(member)} />
              ))
          }
        </div>
        {/* Empty state — only show after loading */}
        {!loading && sectionMembers.length === 0 && (
          <p className="text-muted-text text-sm mt-2">No members in this group yet.</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">

      {/* ── HEADER ── */}
      <section className="relative overflow-hidden bg-forest-gradient px-6 py-8 lg:px-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <Button onClick={() => navigate('/workspace')} variant="ghost"
            className="group mb-6 -ml-3 rounded-lg text-white/90 transition-all hover:bg-white/10 hover:text-white animate-slide-down">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg animate-slide-up">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h1 className="font-display mb-1 text-4xl font-normal text-white">Meet Our Team</h1>
                <p className="font-sans text-lg text-white/80">The talented people behind Pristine Forests</p>
              </div>
            </div>
            {/* {isAdmin && (
              <Button onClick={() => setRbacOpen(true)}
                className="rounded-full bg-mint-accent text-forest-dark font-semibold hover:bg-mint-accent/90">
                Manage Roles
              </Button>
            )} */}
          </div>
        </div>
      </section>

      {/* ── TEAM SECTIONS ── */}
      {renderSection('Leadership', leadership)}
      {renderSection('Department Heads', heads, 'border-t border-border bg-light-gray dark:bg-dark-card')}
      {renderSection('Interns', interns)}
      {(!loading && others.length > 0) && renderSection('Team Members', others)}

      {/* ── MEMBER DETAIL MODAL ── */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-[90vw] max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-dark-card border-border">
          {selectedMember && (
            <div className="relative">
              <button onClick={() => setSelectedMember(null)}
                className="absolute right-3 top-3 md:right-4 md:top-4 z-20 flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110">
                <X className="h-4 w-4 md:h-5 md:w-5 text-heading-dark dark:text-dark-text" />
              </button>
              <div className="grid grid-cols-5">
                {/* Image */}
                <div className="col-span-2 relative group">
                  <div ref={tiltRef}
                    className="relative h-full min-h-[400px] sm:min-h-[450px] md:min-h-[500px] overflow-hidden bg-light-gray dark:bg-dark-hover transition-transform duration-300 ease-out"
                    style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
                    onMouseMove={e => {
                      if (!tiltRef.current) return;
                      const rect = tiltRef.current.getBoundingClientRect();
                      const x = e.clientX - rect.left - rect.width / 2;
                      const y = e.clientY - rect.top - rect.height / 2;
                      tiltRef.current.style.transform = `rotateX(${y / 25}deg) rotateY(${-x / 25}deg) scale(1.05)`;
                    }}
                    onMouseLeave={() => {
                      if (tiltRef.current)
                        tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                    }}>
                    <img src={selectedMember.avatar_url || selectedMember.image} alt={selectedMember.name}
                      className="h-full w-full object-cover object-top pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
                  </div>
                </div>
                {/* Details */}
                <div className="col-span-3 p-4 sm:p-5 md:p-8 flex flex-col justify-center">
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    <div>
                      <h2 className="font-display mb-1 sm:mb-2 text-lg sm:text-xl md:text-3xl font-normal text-heading-dark dark:text-dark-text">
                        {selectedMember.name}
                      </h2>
                      <p className="font-ui mb-0.5 sm:mb-1 text-sm sm:text-base md:text-lg font-medium text-mint-accent">
                        {formatRole(selectedMember.role)}
                      </p>
                      <p className="font-ui text-xs sm:text-sm text-body-text dark:text-dark-muted">
                        {formatDepartment(selectedMember.department)}
                      </p>
                      {user?.email === selectedMember.email && (
                        <Button onClick={() => navigate('/profile')}
                          className="w-full rounded-full bg-mint-accent text-forest-dark font-semibold hover:bg-mint-accent/90 mt-3">
                          Edit My Profile
                        </Button>
                      )}
                    </div>
                    <p className="font-sans text-xs sm:text-sm md:text-base leading-relaxed text-body-text dark:text-dark-text-secondary line-clamp-4 sm:line-clamp-none">
                      {selectedMember.bio || 'No bio added yet.'}
                    </p>
                    <div className="space-y-2 sm:space-y-3 border-t border-border pt-3 sm:pt-4 md:pt-6">
                      {[
                        { icon: Mail, label: 'Email', value: selectedMember.email, href: `mailto:${selectedMember.email}` },
                        { icon: Phone, label: 'Phone', value: selectedMember.phone || '—', href: selectedMember.phone ? `tel:${selectedMember.phone}` : undefined },
                        { icon: MessageSquare, label: 'Mattermost', value: selectedMember.mattermost || '—', href: undefined },
                      ].map(({ icon: Icon, label, value, href }) => (
                        <div key={label} className="flex items-center gap-2 sm:gap-3">
                          <div className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-lg bg-soft-mint dark:bg-mint-accent/20">
                            <Icon className="h-4 w-4 md:h-5 md:w-5 text-forest-green dark:text-mint-accent" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-ui text-[10px] sm:text-xs text-muted-text dark:text-dark-muted">{label}</p>
                            {href
                              ? <a href={href} className="font-sans text-xs sm:text-sm text-heading-dark dark:text-dark-text hover:text-mint-accent transition-colors truncate block">{value}</a>
                              : <p className="font-sans text-xs sm:text-sm text-heading-dark dark:text-dark-text">{value}</p>
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => selectedMember.mattermost && handleMattermostClick(selectedMember.mattermost)}
                      className="w-full h-9 sm:h-10 md:h-11 rounded-full bg-mint-accent text-forest-dark text-xs sm:text-sm md:text-base font-semibold hover:bg-mint-accent/90">
                      <MessageSquare className="mr-1.5 sm:mr-2 h-4 w-4 md:h-5 md:w-5" />
                      Chat on Mattermost
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── CTA ── */}
      <section className="border-t border-border bg-light-gray dark:bg-dark-card px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display mb-4 text-3xl font-normal text-heading-dark dark:text-dark-text animate-slide-up">
            Want to Join Our Team?
          </h2>
          <p className="font-sans mb-8 text-lg text-body-text dark:text-dark-muted animate-slide-up" style={{ animationDelay: '0.1s' }}>
            We're always looking for talented individuals to join our mission
          </p>
          <Button className="rounded-full bg-mint-accent px-8 text-base font-medium text-forest-dark hover:bg-mint-accent/90 animate-slide-up"
            style={{ animationDelay: '0.2s' }}>
            View Open Positions
          </Button>
        </div>
      </section>

      {/* ── RBAC MODAL ── */}
      <Dialog open={rbacOpen} onOpenChange={setRbacOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-dark-card border-border text-heading-dark dark:text-dark-text">
          <h2 className="text-xl font-semibold mb-4">Manage Team Roles</h2>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {members.map(member => (
              <div key={member.email}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-light-gray dark:hover:bg-dark-hover">
                <div>
                  <p className="font-medium text-heading-dark dark:text-dark-text">{member.name}</p>
                  <p className="text-xs text-muted-text dark:text-dark-muted">{member.email}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingMember(member)}>Edit</Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── ROLE EDITOR ── */}
      {editingMember && (
        <Dialog open onOpenChange={() => setEditingMember(null)}>
          <DialogContent className="max-w-md bg-white dark:bg-dark-card border-border text-heading-dark dark:text-dark-text">
            <h3 className="text-lg font-semibold mb-4">Update {editingMember.name}</h3>
            <label className="text-sm font-medium">Role</label>
            <select className="w-full mt-1 mb-3 rounded-lg border border-border p-2 bg-transparent text-heading-dark dark:text-dark-text"
              value={editingMember.role}
              onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="team_lead">Team Lead</option>
              <option value="intern">Intern</option>
              <option value="member">Member</option>
            </select>
            {['team_lead', 'intern'].includes(editingMember.role) && (
              <>
                <label className="text-sm font-medium">Department</label>
                <select className="w-full mt-1 mb-4 rounded-lg border border-border p-2 bg-transparent"
                  value={editingMember.department}
                  onChange={e => setEditingMember({ ...editingMember, department: e.target.value })}>
                  <option value="technology">Technology</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                </select>
              </>
            )}
            <Button className="w-full bg-mint-accent text-forest-dark hover:bg-mint-accent/90"
              onClick={async () => {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/update-role`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                  body: JSON.stringify({ email: editingMember.email, role: editingMember.role, department: editingMember.department }),
                });
                if (!res.ok) { alert('Failed to update role'); return; }
                setMembers(prev => prev.map(m =>
                  m.email === editingMember.email
                    ? { ...m, role: editingMember.role, department: editingMember.department }
                    : m
                ));
                setEditingMember(null);
                setRbacOpen(false);
              }}>
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ── Member Card ───────────────────────────────────────────────────────────────
function MemberCard({ member, index, onClick }: {
  member: TeamMember; index: number; onClick: () => void;
}) {
  const handleMattermostClick = (mattermost: string) => {
    window.open(`https://chat.pristineforests.com/pristine-forests/messages/${mattermost}`, '_blank');
  };

  return (
    <div className="group cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={onClick}>
      <div className="mint-corner-accent overflow-hidden rounded-xl border border-border bg-white dark:bg-dark-card shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover">
        <div className="relative h-48 sm:h-56 overflow-hidden bg-light-gray dark:bg-dark-hover">
          <img src={member.avatar_url || member.image} alt={member.name}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <button onClick={e => { e.stopPropagation(); member.mattermost && handleMattermostClick(member.mattermost); }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 hover:bg-mint-accent">
              <MessageSquare className="h-5 w-5 text-forest-green hover:text-white" />
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <h3 className="font-display mb-1 text-base sm:text-lg font-normal text-heading-dark dark:text-dark-text transition-colors group-hover:text-forest-green dark:group-hover:text-mint-accent">
            {member.name}
          </h3>
          <p className="font-ui mb-1 text-xs sm:text-sm font-medium text-mint-accent">
            {formatRole(member.role)}
          </p>
          <p className="font-ui text-xs text-muted-text dark:text-dark-muted">
            {formatDepartment(member.department)}
          </p>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 border-t border-border pt-3">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-text dark:text-dark-muted flex-shrink-0" />
            <a href={`mailto:${member.email}`} onClick={e => e.stopPropagation()}
              className="font-sans text-xs text-body-text dark:text-dark-muted hover:text-mint-accent transition-colors truncate">
              {member.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}