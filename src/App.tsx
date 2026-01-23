import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './components/AppLayout';
import WorkspaceDashboard from './pages/WorkspaceDashboard';
import CategoryDetail from './pages/CategoryDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Announcements from './pages/Announcements';
import Team from './pages/Team';
import Login from './pages/Login';
// import Signup from './pages/Signup';
import OAuthSuccess from './pages/OAuthSuccess';
import { LanguageProvider } from './contexts/LanguageContext';
// import { AnnouncementsProvider } from './contexts/AnnouncementsContext';
import Tasks from './pages/Tasks';
// import ManagerTasks from './pages/ManagerTasks';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/workspace" replace />} />
            <Route path="/workspace" element={<WorkspaceDashboard />} />
            <Route path="/workspace/:categoryId" element={<CategoryDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/announcements" element={<Announcements />} />
            {/* <Route path="/manager/tasks" element={<ManagerTasks />} /> */}
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/team" element={<Team />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth/success" element={<OAuthSuccess />} />
          </Routes>
          </AppLayout>
          <Toaster />
        </Router>
      </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
