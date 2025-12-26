import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Footer from './Footer';
import { useAuth } from '../contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('sidebarOpen');
    return stored !== null ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Pages that should not show footer
  const noFooterPages = ['/login', '/signup'];
  const showFooter = !noFooterPages.includes(location.pathname);

  // Show footer on dashboard only if not authenticated
  const isDashboard = location.pathname === '/workspace';
  const shouldShowFooter = showFooter && (!isDashboard || !isAuthenticated);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-y-auto">
          {children}
          {shouldShowFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}
