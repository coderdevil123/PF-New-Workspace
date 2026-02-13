import { useEffect, useState } from 'react';
import { ArrowLeft, Briefcase, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../lib/utils';

type Task = {
  id: string;
  title: string;
  status: string;
  priority?: string;
  created_at?: string;
  assigned_to_email: string;
  department?: string;
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
    const [reminderOpen, setReminderOpen] = useState(false);
    const [reminderDept, setReminderDept] = useState('');
    const [reminderEmail, setReminderEmail] = useState('');
    const [reminderMessage, setReminderMessage] = useState('');
    const [sendingReminder, setSendingReminder] = useState(false);

    body: JSON.stringify({
      title: 'Task Reminder',
      content: reminderMessage,
      category: 'Task',
      recipients: 'specific',
      tagged_emails: [reminderEmail],
      created_by: user?.email,
      created_by_name: user?.name,
    }),

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
            m => m.department.toLowerCase() === department
        );

        setFilteredMembers(filtered);
    }, [department, members]);

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/manager/tasks`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (!res.ok) {
          setTasks([]);
          return;
        }

        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load manager tasks', err);
        setTasks([]);
      }
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
    if (department && task.department !== department) return false;
    if (memberEmail && task.assigned_to_email !== memberEmail) return false;
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    return true;
  });


const getMemberName = (email: string) => {
  return members.find(m => m.email === email)?.name || email;
};

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

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
            onClick={() => setReminderOpen(true)}
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

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
            <option value="on-hold">On Hold</option>
          </select>

          {/* Department */}
          <select
            value={department}
            onChange={e => {
                  setDepartment(e.target.value);
                  setMemberEmail('');
                  setSearchQuery('');
                  setStatusFilter('all');
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
            <div
              className="
                mx-auto max-w-5xl space-y-4
                max-h-[70vh] overflow-y-auto
                pr-2
              "
            >
            {visibleTasks.map(task => (
            <div
                key={task.id}
                className="rounded-xl border p-5 bg-white dark:bg-dark-card"
            >
                <div className="rounded-xl border p-5 bg-white dark:bg-dark-card">
                <h3 className="text-lg font-medium">{task.title}</h3>

                <p className="text-xs text-muted-text mt-1">
                  Assigned to: {getMemberName(task.assigned_to_email)}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  {/* STATUS */}
                  <span className="rounded-full px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700">
                    {task.status.toUpperCase()}
                  </span>

                  {/* PRIORITY */}
                  {task.priority && (
                    <span className="rounded-full px-3 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">
                      PRIORITY: {task.priority.toUpperCase()}
                    </span>
                  )}

                  {/* DATE */}
                  {task.created_at && (
                    <span className="text-xs text-muted-text">
                      {formatDate(task.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            ))}

            {visibleTasks.length === 0 && (
            <p className="text-muted-text">
                No tasks found for selected filters.
            </p>
            )}

        </div>
        </section>
        {reminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-dark-card p-6 shadow-2xl">

            <h3 className="text-xl font-semibold mb-4">
                Send Task Reminder
            </h3>

            {/* Department */}
            <select
                value={reminderDept}
                onChange={e => {
                  setDepartment(e.target.value);
                  setMemberEmail('');
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg"
            >
                <option value="">Select Department</option>
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
            </select>

            {/* Team Member */}
            <select
                disabled={!reminderDept}
                value={reminderEmail}
                onChange={e => setReminderEmail(e.target.value)}
                className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg"
            >
                <option value="">Select Team Member</option>

                {members
                .filter(m => m.department === reminderDept)
                .map(m => (
                    <option key={m.email} value={m.email}>
                    {m.name}
                    </option>
                ))}
            </select>

            {/* Message */}
            <textarea
                value={reminderMessage}
                onChange={e => setReminderMessage(e.target.value)}
                placeholder="Write a short reminder message…"
                rows={4}
                className="w-full rounded-lg border px-3 py-2 mb-4 bg-white dark:bg-dark-bg"
            />

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <Button
                variant="outline"
                onClick={() => setReminderOpen(false)}
                >
                Cancel
                </Button>

                <Button
                disabled={!reminderEmail || !reminderMessage || sendingReminder}
                onClick={async () => {
                    setSendingReminder(true);

                    await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/api/announcements`,
                    {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({
                        title: 'Task Reminder',
                        content: reminderMessage,
                        category: 'Task',
                        recipients: 'specific',
                        tagged_emails: [reminderEmail],
                        }),
                    }
                    );

                    setSendingReminder(false);
                    setReminderOpen(false);
                    setReminderDept('');
                    setReminderEmail('');
                    setReminderMessage('');
                }}
                className="bg-mint-accent text-forest-dark hover:bg-mint-accent/90"
                >
                {sendingReminder ? 'Sending...' : 'Send Reminder'}
                </Button>
            </div>

            </div>
        </div>
        )}

    </div>
  );
}
