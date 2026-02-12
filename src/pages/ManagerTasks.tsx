import { useEffect, useState } from 'react';
import { ArrowLeft, Briefcase, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

type Task = {
  id: string;
  title: string;
  status: string;
  priority?: string;
  created_at?: string;
  assigned_to_email: string;
};

type TeamMember = {
  name: string;
  email: string;
  department: string;
};

export default function ManagerTasks() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [department, setDepartment] = useState('');
    const [memberEmail, setMemberEmail] = useState('');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        async function loadMembers() {
            const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/team`,
            {
                headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
            );

            const data = await res.json();
            setMembers(Array.isArray(data) ? data : []);
        }

        loadMembers(); 
    }, []);

    useEffect(() => {
        if (!department) {
            setFilteredMembers([]);
            return;
        }

        const filtered = members.filter(
            m => m.department === department
        );

        setFilteredMembers(filtered);
    }, [department, members]);

    const fetchTasks = async () => {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/manager/tasks`,
        {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        }
    );

    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
    fetchTasks();
    }, []);


  useEffect(() => {
    if (!user) navigate('/login');
    // if (user && user.role !== 'manager') navigate('/manager');
    if (user) navigate('/manager');
    
    document.title = 'Manager Console | Pristine Forests';
  }, [user, navigate]);

  if (!user) return null;

  const visibleTasks = tasks.filter(task => {
    if (department) {
        const member = members.find(
        m => m.email === task.assigned_to_email
        );
        if (!member || member.department !== department) return false;
    }

    if (memberEmail && task.assigned_to_email !== memberEmail) {
        return false;
    }

    if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
        return false;
    }

    if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
    }

    return true;
});


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

            {filteredMembers.map(member => (
                <option key={member.email} value={member.email}>
                {member.name}
                </option>
            ))}
            </select>
        </div>
      </section>

      {/* TASK LIST */}
      <section className="px-6 pb-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-4">

            {visibleTasks.map(task => (
            <div
                key={task.id}
                className="rounded-xl border p-5 bg-white dark:bg-dark-card"
            >
                <h3 className="text-lg font-medium">
                {task.title}
                </h3>

                <p className="text-xs text-muted-text mt-1">
                Assigned to: {task.assigned_to_email}
                </p>

                <span className="inline-block mt-2 rounded-full px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700">
                {task.status.toUpperCase()}
                </span>
            </div>
            ))}

            {visibleTasks.length === 0 && (
            <p className="text-muted-text">
                No tasks found for selected filters.
            </p>
            )}

        </div>
        </section>

    </div>
  );
}
