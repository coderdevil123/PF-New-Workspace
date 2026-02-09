import { useEffect } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import AdminRoles from '../components/admin/AdminRoles';
import AdminAssignments from '../components/admin/AdminAssignments';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.isAdmin) navigate('/workspace');
    document.title = 'Admin Console | Pristine Forests';
  }, [user, navigate]);

  if (!user?.isAdmin) return null;

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">
      
      {/* HEADER */}
      <section className="relative overflow-hidden bg-forest-gradient px-6 py-8 lg:px-12">
        <div className="relative mx-auto max-w-5xl flex items-center gap-4">

          <Button
            onClick={() => navigate('/workspace')}
            variant="ghost"
            className="rounded-lg text-white/90 hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>

            <div>
              <h1 className="font-display text-4xl font-normal text-white">
                Admin Console
              </h1>
              <p className="font-sans text-lg text-white/80">
                Manage roles, departments & access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-14">

          {/* ROLES */}
          <AdminRoles />

          {/* ASSIGNMENTS */}
          <AdminAssignments />

        </div>
      </section>
    </div>
  );
}
