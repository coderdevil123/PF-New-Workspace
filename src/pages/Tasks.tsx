import { useEffect, useState } from 'react';
import { ArrowLeft, CheckSquare, Check, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

type Task = {
  id: string;
  title: string;
  description?: string;
  // is_completed: boolean;
  created_at?: string;
  status: 'pending' | 'completed' | 'wrong' | null;
  issue_reported?: boolean;
};

const formatTaskDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const STATUS_STYLES = {
  pending: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  wrong: 'bg-red-100 text-red-700',
};

const DUMMY_TASKS: Task[] = [
  {
    id: '1',
    title: 'Prepare weekly security report',
    description: 'Based on last team meeting',
    created_at: '2026-01-29T10:45:00Z',
    status: 'pending',
    issue_reported: false,
  },
  {
    id: '2',
    title: 'Review Pristine Forests workspace RBAC',
    description: 'Check intern vs admin permissions',
    created_at: '2026-01-29T11:10:00Z',
    status: 'completed',
    issue_reported: false,
  },
  {
    id: '3',
    title: 'Sync Mattermost meeting notes',
    description: 'Extract tasks from meeting summary',
    created_at: '2026-01-29T12:30:00Z',
    status: 'wrong',
    issue_reported: true,
  },
];

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [openDropdownTaskId, setOpenDropdownTaskId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'wrong'>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');


  // 🔐 Auth guard (SAFE – no hook violation)
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 🧪 Dummy task loader
  useEffect(() => {
    if (!user) return;

    document.title = 'Tasks | Pristine Forests';
    setTasks(DUMMY_TASKS);
  }, [user]);

  // ✅ LOCAL toggle ONLY (no backend in dummy mode)
  // const toggleTask = (id: string) => {
  //   setTasks(prev =>
  //     prev.map(task =>
  //       task.id === id
  //         ? { ...task, completed: !task.completed }
  //         : task
  //     )
  //   );
  // };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const filteredTasks = tasks.filter(task => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (dateFilter && !task.created_at?.startsWith(dateFilter)) return false;
      return true;
    });


  const saveEditedTask = () => {
    if (!editingTask) return;

    updateTask(editingTask.id, {
      title: editTitle,
      description: editDescription,
    });

    setEditingTask(null);
  };

  const updateTask = (id: string, updates: Partial<any>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  // Prevent render until auth resolved
  if (!user) return null;

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

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                onClick={() => navigate('/workspace')}
                variant="ghost"
                className="group -ml-3 rounded-lg text-white/90 transition-all hover:bg-white/10 hover:text-white animate-slide-down"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg animate-slide-up">
                  <CheckSquare className="h-7 w-7 text-white" />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <h1 className="font-display mb-1 text-2xl sm:text-4xl font-normal text-white">
                    My Tasks
                  </h1>
                  <p className="font-sans text-sm sm:text-lg text-white/80">
                    Tasks assigned to you from meetings
                  </p>
                </div>
              </div>
            </div>
            </div>
        </div>
      </section>

      {/* Search & Filters */}
        <section className="px-6 pt-6 lg:px-12">
          <div className="mx-auto max-w-5xl flex flex-wrap gap-4 items-center">
            
            {/* Search */}
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-64 rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="wrong">Wrong</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
            />

          </div>
        </section>

      {/* Task List */}
    <div className="mx-auto max-w-5xl space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-4">
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="flex justify-between gap-6 rounded-xl border
                        bg-white/5 dark:bg-dark-card p-6
                        shadow-card hover:shadow-card-hover transition-all"
            >
              {/* LEFT: Task Content */}
              <div className="flex-1">
                <h3
                  className={`text-lg font-medium ${
                    task.status === 'completed'
                      ? 'line-through text-gray-400 dark:text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="mt-1 text-sm text-muted-text">
                    {task.description}
                  </p>
                )}

                {task.created_at && (
                  <div className="mt-3 text-xs text-muted-text">
                    {formatTaskDate(task.created_at)}
                  </div>
                )}
              </div>

              {/* RIGHT: Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() =>
                    setOpenDropdownTaskId(
                      openDropdownTaskId === task.id ? null : task.id
                    )
                  }
                  className="rounded-lg border px-4 py-2 text-sm
                            bg-white dark:bg-dark-bg
                            text-gray-800 dark:text-gray-200
                            hover:bg-gray-100 dark:hover:bg-dark-hover
                            transition"
                >
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium
                      ${task.status ? STATUS_STYLES[task.status] : 'bg-gray-200 text-gray-700'}`}
                  >
                    {task.status ? task.status.toUpperCase() : 'SET STATUS'} ▾
                  </span>
                </button>

                {openDropdownTaskId === task.id && (
                  <div className="absolute right-0 z-30 mt-2 w-56 rounded-xl border
                                  bg-white dark:bg-dark-card shadow-xl p-2">
                    {['pending', 'completed', 'wrong'].map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          updateTask(task.id, { status: option as Task['status'] });
                          setOpenDropdownTaskId(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm
                          hover:bg-gray-100 dark:hover:bg-dark-hover
                          ${task.status === option ? STATUS_STYLES[option] : 'text-gray-700 dark:text-gray-200'}`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                        {task.status === option && <Check className="h-4 w-4" />}
                      </button>
                    ))}

                    <hr className="my-2 border-gray-200 dark:border-dark-border" />

                    <button
                      onClick={() => {
                        openEditModal(task);
                        setOpenDropdownTaskId(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-mint-accent hover:underline"
                    >
                      ✏️ Edit Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* EDIT MODAL */}
          {editingTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md rounded-2xl bg-white dark:bg-dark-card p-6 shadow-2xl">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    <Pencil className="h-4 w-4" />
                  </h3>

                  <input
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="mb-3 w-full rounded-lg border px-3 py-2
                              bg-white dark:bg-dark-bg
                              text-gray-900 dark:text-white
                              focus:outline-none focus:ring-2 focus:ring-mint-accent"
                    placeholder="Task title"
                  />

                  <textarea
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                    className="mb-4 w-full rounded-lg border px-3 py-2
                              bg-white dark:bg-dark-bg
                              text-gray-900 dark:text-white
                              focus:outline-none focus:ring-2 focus:ring-mint-accent"
                    rows={3}
                    placeholder="Task description"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditingTask(null)}
                      className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEditedTask}
                      className="rounded-lg bg-mint-accent px-4 py-2 text-sm font-medium text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
        </section>
      </div>
    </div>
  );
}
