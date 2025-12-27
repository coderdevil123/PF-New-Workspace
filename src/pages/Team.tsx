import { useEffect, useState } from 'react';
import { ArrowLeft, Users, Mail, MessageSquare, Phone, X, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { teamMembers } from '../data/teamMembers';

export default function Team() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Our Team | Pristine Forests';
  }, []);

  const handleMemberClick = (member: typeof teamMembers[0]) => {
    setSelectedMember(member);
  };

  const handleMattermostClick = (mattermost: string) => {
    window.open(`https://mattermost.com/direct/${mattermost}`, '_blank');
  };

  // Group members by category
  const leadership = teamMembers.filter(m => m.department === 'Leadership');
  const heads = teamMembers.filter(m => ['Technology', 'Marketing', 'Design', 'Operations'].includes(m.department) && m.role !== 'Intern');
  const interns = teamMembers.filter(m => m.role === 'Intern');

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

        <div className="relative mx-auto max-w-7xl">
          <Button
            onClick={() => navigate('/workspace')}
            variant="ghost"
            className="group mb-6 -ml-3 rounded-lg text-white/90 transition-all hover:bg-white/10 hover:text-white animate-slide-down"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg animate-slide-up">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="font-display mb-1 text-4xl font-normal text-white">
                Meet Our Team
              </h1>
              <p className="font-sans text-lg text-white/80">
                The talented people behind Pristine Forests
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">
            Leadership
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {leadership.map((member, index) => (
              <MemberCard 
                key={member.id} 
                member={member} 
                index={index}
                onClick={() => handleMemberClick(member)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Department Heads Section */}
      <section className="border-t border-border bg-light-gray dark:bg-dark-card px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">
            Department Heads
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {heads.map((member, index) => (
              <MemberCard 
                key={member.id} 
                member={member} 
                index={index}
                onClick={() => handleMemberClick(member)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Interns Section */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">
            Interns
          </h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
            {interns.map((member, index) => (
              <MemberCard 
                key={member.id} 
                member={member} 
                index={index}
                onClick={() => handleMemberClick(member)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Member Detail Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-dark-card border-border">
          {selectedMember && (
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 hover:bg-white dark:hover:bg-dark-card"
              >
                <X className="h-5 w-5 text-heading-dark dark:text-dark-text" />
              </button>

              <div className="grid md:grid-cols-5">
                {/* Member Image - 3D Hover Effect */}
                <div className="md:col-span-2 relative group">
                  <div 
                    className="relative h-64 md:h-full md:min-h-[500px] overflow-hidden bg-light-gray dark:bg-dark-hover transition-all duration-500"
                    style={{
                      perspective: '1000px',
                    }}
                  >
                    <img
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="h-full w-full object-cover object-top transition-all duration-500 group-hover:scale-105"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                      onMouseMove={(e) => {
                        if (window.innerWidth >= 768) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          const centerX = rect.width / 2;
                          const centerY = rect.height / 2;
                          const rotateX = (y - centerY) / 20;
                          const rotateY = (centerX - x) / 20;
                          e.currentTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (window.innerWidth >= 768) {
                          e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Member Details */}
                <div className="md:col-span-3 p-6 md:p-8 flex flex-col justify-center">
                  <div className="space-y-4 md:space-y-6">
                    <div>
                      <h2 className="font-display mb-2 text-2xl md:text-3xl font-normal text-heading-dark dark:text-dark-text">
                        {selectedMember.name}
                      </h2>
                      <p className="font-ui mb-1 text-base md:text-lg font-medium text-mint-accent">
                        {selectedMember.role}
                      </p>
                      <p className="font-ui text-sm text-body-text dark:text-dark-muted">
                        {selectedMember.department}
                      </p>
                    </div>

                    <p className="font-sans text-sm md:text-base leading-relaxed text-body-text dark:text-dark-text-secondary">
                      {selectedMember.bio}
                    </p>

                    {/* Contact Information */}
                    <div className="space-y-3 border-t border-border pt-4 md:pt-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-soft-mint dark:bg-mint-accent/20">
                          <Mail className="h-5 w-5 text-forest-green dark:text-mint-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-ui text-xs text-muted-text dark:text-dark-muted">Email</p>
                          <a 
                            href={`mailto:${selectedMember.email}`}
                            className="font-sans text-sm text-heading-dark dark:text-dark-text hover:text-mint-accent transition-colors truncate block"
                          >
                            {selectedMember.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-soft-mint dark:bg-mint-accent/20">
                          <Phone className="h-5 w-5 text-forest-green dark:text-mint-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-ui text-xs text-muted-text dark:text-dark-muted">Phone</p>
                          <a 
                            href={`tel:${selectedMember.phone}`}
                            className="font-sans text-sm text-heading-dark dark:text-dark-text hover:text-mint-accent transition-colors"
                          >
                            {selectedMember.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-soft-mint dark:bg-mint-accent/20">
                          <MessageSquare className="h-5 w-5 text-forest-green dark:text-mint-accent" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-ui text-xs text-muted-text dark:text-dark-muted">Mattermost</p>
                          <p className="font-sans text-sm text-heading-dark dark:text-dark-text">
                            {selectedMember.mattermost}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Button */}
                    <Button
                      onClick={() => handleMattermostClick(selectedMember.mattermost)}
                      className="w-full rounded-full bg-mint-accent text-forest-dark font-semibold hover:bg-mint-accent/90"
                    >
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Chat on Mattermost
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="border-t border-border bg-light-gray dark:bg-dark-card px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display mb-4 text-3xl font-normal text-heading-dark dark:text-dark-text animate-slide-up">
            Want to Join Our Team?
          </h2>
          <p className="font-sans mb-8 text-lg text-body-text dark:text-dark-muted animate-slide-up" style={{ animationDelay: '0.1s' }}>
            We're always looking for talented individuals to join our mission
          </p>
          <Button 
            className="rounded-full bg-mint-accent px-8 text-base font-medium text-forest-dark hover:bg-mint-accent/90 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            View Open Positions
          </Button>
        </div>
      </section>
    </div>
  );
}

// Member Card Component
function MemberCard({ member, index, onClick }: { 
  member: typeof teamMembers[0]; 
  index: number;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMattermostClick = (mattermost: string) => {
    window.open(`https://mattermost.com/direct/${mattermost}`, '_blank');
  };

  return (
    <div
      className="group cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="mint-corner-accent overflow-hidden rounded-xl border border-border bg-white dark:bg-dark-card shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover">
        {/* Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-light-gray dark:bg-dark-hover">
          <img
            src={member.image}
            alt={member.name}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Mattermost Icon - Appears on Hover */}
          <div className="absolute bottom-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMattermostClick(member.mattermost);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 hover:bg-mint-accent"
            >
              <MessageSquare className="h-5 w-5 text-forest-green hover:text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3 className="font-display mb-1 text-base sm:text-lg font-normal text-heading-dark dark:text-dark-text transition-colors group-hover:text-forest-green dark:group-hover:text-mint-accent">
            {member.name}
          </h3>
          <p className="font-ui mb-1 text-xs sm:text-sm font-medium text-mint-accent">
            {member.role}
          </p>
          <p className="font-ui text-xs text-muted-text dark:text-dark-muted">
            {member.department}
          </p>

          {/* Email */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2 border-t border-border pt-3">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-text dark:text-dark-muted flex-shrink-0" />
            <a
              href={`mailto:${member.email}`}
              onClick={(e) => e.stopPropagation()}
              className="font-sans text-xs text-body-text dark:text-dark-muted hover:text-mint-accent transition-colors truncate"
            >
              {member.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
