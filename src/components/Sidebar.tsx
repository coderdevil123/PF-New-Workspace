import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, Palette, Megaphone, Settings, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { useAuth } from "../contexts/AuthContext";
import AuthRequiredModal from "../components/AuthRequiredModal";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const categories = [
  { id: 'productivity', label: 'Productivity', icon: Zap },
  { id: 'content', label: 'Content Creation', icon: Sparkles },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'operations', label: 'Operations', icon: Settings },
];

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isHoveringDesktop, setIsHoveringDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const shouldBeOpen = isMobile ? isOpen : (isOpen || isHoveringDesktop);

  const AnimatedText = ({ text, isVisible }: { text: string; isVisible: boolean }) => {
    return (
      <span className="inline-flex overflow-hidden">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="inline-block transition-all duration-300"
            style={{
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${index * 30}ms`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full border-r border-border bg-white dark:bg-dark-bg shadow-lg transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 ${
          shouldBeOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${shouldBeOpen ? 'w-64' : 'lg:w-20'}`}
        onMouseEnter={() => !isMobile && setIsHoveringDesktop(true)}
        onMouseLeave={() => !isMobile && setIsHoveringDesktop(false)}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center justify-between border-b border-border bg-light-gray dark:bg-dark-card px-6">
            {shouldBeOpen && (
              <Link to="/workspace" className="flex items-center gap-3 transition-transform hover:scale-105">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-forest-green to-mint-accent shadow-md transition-transform duration-300 hover:rotate-12">
                  <span className="text-sm font-bold text-white">PF</span>
                </div>
                <span className="font-display overflow-hidden text-lg font-normal text-heading-dark dark:text-dark-text">
                  <AnimatedText text="Pristine Forests" isVisible={shouldBeOpen} />
                </span>
              </Link>
            )}
            {!shouldBeOpen && (
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-forest-green to-mint-accent shadow-md transition-transform hover:scale-110 hover:rotate-12">
                <span className="text-sm font-bold text-white">PF</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-6">
            <nav className="space-y-2">
              <Link
                to="/workspace"
                className={`font-ui group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                  location.pathname === '/workspace' 
                    ? 'bg-soft-mint dark:bg-mint-accent/20 text-forest-green dark:text-mint-accent' 
                    : 'text-body-text dark:text-dark-muted hover:bg-light-gray dark:hover:bg-dark-hover'
                }`}
                onMouseEnter={() => setHoveredItem('dashboard')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {location.pathname === '/workspace' && (
                  <div className="absolute left-0 h-8 w-1 rounded-r-full bg-mint-accent transition-all duration-300" />
                )}
                <LayoutDashboard 
                  className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                    hoveredItem === 'dashboard' ? 'scale-110 rotate-12' : ''
                  }`} 
                  strokeWidth={1.5} 
                />
                {shouldBeOpen && (
                  <span className="overflow-hidden">
                    <AnimatedText text="Dashboard" isVisible={shouldBeOpen} />
                  </span>
                )}
                {!shouldBeOpen && hoveredItem === 'dashboard' && (
                  <div className="absolute left-full ml-2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg animate-scale-in">
                    Dashboard
                  </div>
                )}
              </Link>

              <div className="my-4 border-t border-gray-200" />

              {categories.map((category, index) => {
                const Icon = category.icon;
                const isActive = location.pathname === `/workspace/${category.id}`;
                
                return (
                  <Link
                    key={category.id}
                    to={`/workspace/${category.id}`}
                    className={`font-ui group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-soft-mint dark:bg-mint-accent/20 text-forest-green dark:text-mint-accent' 
                        : 'text-body-text dark:text-dark-muted hover:bg-light-gray dark:hover:bg-dark-hover'
                    }`}
                    style={{ 
                      transitionDelay: shouldBeOpen ? `${index * 50}ms` : '0ms',
                    }}
                    onMouseEnter={() => setHoveredItem(category.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {isActive && (
                      <div className="absolute left-0 h-8 w-1 rounded-r-full bg-mint-accent transition-all duration-300" />
                    )}
                    <Icon 
                      className={`h-5 w-5 flex-shrink-0 transition-all duration-300 ${
                        hoveredItem === category.id ? 'scale-110 rotate-12' : ''
                      }`} 
                      strokeWidth={1.5} 
                    />
                    {shouldBeOpen && (
                      <span className="overflow-hidden">
                        <AnimatedText text={category.label} isVisible={shouldBeOpen} />
                      </span>
                    )}
                    {!shouldBeOpen && hoveredItem === category.id && (
                      <div className="absolute left-full ml-2 whitespace-nowrap rounded-lg bg-heading-dark dark:bg-dark-card px-3 py-2 text-xs text-white shadow-lg animate-scale-in">
                        {category.label}
                      </div>
                    )}
                  </Link> 
                  // </button>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Toggle Button */}
          <div className="border-t border-border bg-light-gray dark:bg-dark-card p-4">
            <Button
              onClick={onToggle}
              variant="ghost"
              size="sm"
              className="w-full rounded-xl text-body-text dark:text-dark-muted transition-all duration-300 hover:bg-soft-mint dark:hover:bg-dark-hover hover:text-forest-green dark:hover:text-mint-accent hover:scale-105"
            >
              {shouldBeOpen ? (
                <>
                  <ChevronLeft className="h-5 w-5 transition-transform duration-300" strokeWidth={1.5} />
                  <span className="ml-2 text-sm overflow-hidden">
                    <AnimatedText text="Collapse" isVisible={shouldBeOpen} />
                  </span>
                </>
              ) : (
                <ChevronRight className="h-5 w-5 transition-transform duration-300" strokeWidth={1.5} />
              )}
            </Button>
          </div>
        </div>
      </aside>
      <AuthRequiredModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
