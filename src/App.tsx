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

function App() {
  return (
    <ThemeProvider>
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
            <Route path="/team" element={<Team />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth/success" element={<OAuthSuccess />} />
          </Routes>
          </AppLayout>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
