import { useEffect, useState } from 'react';
import { ArrowLeft, Briefcase, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

export default function ManagerTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [department, setDepartment] = useState('');
  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    if (!user) navigate('/login');
    // if (user && user.role !== 'manager') navigate('/manager');
    if (user) navigate('/manager');
    
    document.title = 'Manager Console | Pristine Forests';
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">

      {/* HEADER */}
      <section className="bg-forest-gradient px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-5xl flex items-center justify-between">

          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/workspace')}
              variant="ghost"
              className="text-white/90 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint-accent">
                <Briefcase className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-display text-white">
                  Manager Console
                </h1>
                <p className="text-white/80">
                  Monitor & manage team tasks
                </p>
              </div>
            </div>
          </div>

          {/* TASK REMINDER */}
          <Button
            className="rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Bell className="h-4 w-4 mr-2" />
            Task Reminder
          </Button>

        </div>
      </section>

      {/* FILTERS */}
      <section className="px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-5xl flex gap-4 flex-wrap">

          {/* Department */}
          <select
            value={department}
            onChange={e => {
              setDepartment(e.target.value);
              setMemberEmail('');
            }}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg"
          >
            <option value="">Select Department</option>
            <option value="technology">Technology</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="operations">Operations</option>
          </select>

          {/* Team Member */}
          <select
            disabled={!department}
            value={memberEmail}
            onChange={e => setMemberEmail(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg"
          >
            <option value="">Select Team Member</option>
            {/* next step: dynamic members */}
          </select>

        </div>
      </section>

      {/* TASK LIST */}
      <section className="px-6 pb-12 lg:px-12">
        <div className="mx-auto max-w-5xl text-muted-text">
          Tasks will appear here…
        </div>
      </section>

    </div>
  );
}
