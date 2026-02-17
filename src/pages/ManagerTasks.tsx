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
    const normalize = (v?: string) => v?.toLowerCase().trim() || '';
    const [memberTasks, setMemberTasks] = useState<Task[]>([]);
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [reminderStatus, setReminderStatus] = useState('');

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
  if (!reminderDept) {
    setFilteredMembers(members);
    return;
  }

  const filtered = members.filter(
    m => normalize(m.department) === normalize(reminderDept)
  );

  setFilteredMembers(filtered);
}, [reminderDept, members]);

    useEffect(() => {
    if (!selectedTaskId) return;

    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return;

    setReminderStatus(task.status);
    setReminderEmail(task.assigned_to_email);
    setReminderDept(task.department || '');
  }, [selectedTaskId]);

    useEffect(() => {
      if (!reminderEmail) {
        setMemberTasks([]);
        setSelectedTaskId('');
        return;
      }

      const tasksOfMember = tasks.filter(
        t =>
          t.assigned_to_email === reminderEmail &&
          normalize(t.department) === normalize(reminderDept)
      );

      setMemberTasks(tasksOfMember);
    }, [reminderEmail, tasks]);

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
    if (
      department &&
      normalize(task.department) !== normalize(department)
    ) return false;
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
        <div className="
          mx-auto max-w-5xl
          flex flex-col sm:flex-row
          gap-3 sm:gap-4
        ">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
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
            className="rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
          >
            <option value="">Select Department</option>
            <option value="technology">Technology</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="operations">Operations</option>
          </select>

          {/* Team Member */}
          <select
            value={memberEmail}
            onChange={e => setMemberEmail(e.target.value)}
            className="rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
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
      <div className="mx-auto max-w-6xl space-y-4 max-h-[70vh] overflow-y-auto overflow-x-visible px-2">
          <section className="px-4 sm:px-6 pb-12 lg:px-12">
            <div
              className="
                mx-auto max-w-5xl space-y-6
              "
            >
            {visibleTasks.map(task => (
            <div
                key={task.id}
                className="
                  w-full
                  rounded-2xl border
                  bg-white/5 dark:bg-dark-card
                  p-4 sm:p-6
                  shadow-card hover:shadow-card-hover
                  transition-all
                "
              >
                <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {task.title}
                </h3>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Assigned to: {getMemberName(task.assigned_to_email)}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  {/* STATUS */}
                  <span className="rounded-full px-3 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {task.status.toUpperCase()}
                  </span>

                  {/* PRIORITY */}
                  {task.priority && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200'
                          : task.priority === 'medium'
                          ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
                      }`}
                    >
                      PRIORITY: {task.priority.toUpperCase()}
                    </span>
                  )}

                  {/* DEPARTMENT */}
                  {task.department && (
                    <span className="
                      rounded-full px-3 py-1 text-xs
                      bg-blue-100 text-blue-700
                      dark:bg-blue-900/40 dark:text-blue-200
                    ">
                      {task.department.toUpperCase()}
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
      </div>
        {reminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="
              w-[92vw] sm:w-full
              max-w-md
              rounded-2xl
              bg-white dark:bg-dark-card
              p-5 sm:p-6
              shadow-2xl
            ">

            <h3 className="text-xl font-semibold mb-4">
                Send Task Reminder
            </h3>

            {/* Department */}
            <select
                value={reminderDept}
                onChange={e => {
                  setReminderDept(e.target.value);
                  setReminderEmail('');
                }}
                className="w-full mb-3 rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
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
                className="w-full mb-3 rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
            >
                <option value="">Select Team Member</option>

                {(reminderDept
                  ? members.filter(m => normalize(m.department) === normalize(reminderDept))
                  : members
                ).map(m => (
                    <option key={m.email} value={m.email}>
                    {m.name}
                    </option>
                ))}
            </select>

            {/* TASK SELECTOR */}
              <select
                disabled={!memberTasks.length}
                value={selectedTaskId}
                onChange={e => setSelectedTaskId(e.target.value)}
                className="w-full mb-3 rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
              >
                <option value="">Select Task</option>

                {memberTasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>

                {/* TASK STATUS UPDATE */}
              <select
                value={reminderStatus}
                onChange={e => setReminderStatus(e.target.value)}
                disabled={!selectedTaskId}
                className="w-full mb-3 rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
              >
                <option value="">Update Task Status (optional)</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
                <option value="on-hold">On Hold</option>
              </select>

            {/* Message */}
            <textarea
                value={reminderMessage}
                onChange={e => setReminderMessage(e.target.value)}
                placeholder="Write a short reminder message…"
                rows={4}
                className="w-full rounded-lg border px-3 py-2 mb-4
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
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
                    const token = localStorage.getItem('token');

                    // 1️⃣ Update task status
                    if (selectedTaskId && reminderStatus) {
                      await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/manager/update-task-status`,
                        {
                          method: 'PATCH',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            taskId: selectedTaskId,
                            status: reminderStatus,
                          }),
                        }
                      );
                    }

                    // 2️⃣ Announcement
                    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/announcements`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        title: 'Task Reminder',
                        content: reminderMessage,
                        category: 'Task',
                        recipients: 'specific',
                        tagged_emails: [reminderEmail],
                        related_task_id: selectedTaskId || null,
                        created_by: user?.email,
                        created_by_name: user?.name,
                      }),
                    });

                    // 3️⃣ Reset
                    setSendingReminder(false);
                    setReminderOpen(false);
                    setReminderDept('');
                    setReminderEmail('');
                    setSelectedTaskId('');
                    setReminderStatus('');
                    setReminderMessage('');
                  }}
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
