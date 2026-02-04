import { useEffect, useState } from 'react';
import { ArrowLeft, CheckSquare, Check, Pencil, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'wrong' | 'blocked' | 'on-hold';
type TaskPriority = 'high' | 'medium' | 'low';
type Task = {
  id: string;
  title: string;
  priority?: TaskPriority;
  meeting_summary?: string;
  description?: string;
  // is_completed: boolean;
  created_at?: string;
  status: TaskStatus | null;
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

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
  'in-progress':
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200',
  completed:
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200',
  wrong:
    'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200',
  blocked:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200',
  'on-hold':
    'bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-200',
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200',
  low: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200',
};

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [openDropdownTaskId, setOpenDropdownTaskId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'yesterday' | 'last7' | 'last14'>('all');
  const [wrongReasonTask, setWrongReasonTask] = useState<Task | null>(null);
  const [reassignModalTask, setReassignModalTask] = useState<Task | null>(null);
  const [teamMembers, setTeamMembers] = useState<{ name: string; email: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'reassign'>('tasks');
  const [reassignRequests, setReassignRequests] = useState<any[]>([]);
  const [openWrongSubmenuTaskId, setOpenWrongSubmenuTaskId] = useState<string | null>(null);
  const [openSummaryTaskId, setOpenSummaryTaskId] = useState<string | null>(null);
  const [summaryPosition, setSummaryPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);


  const fetchTasks = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const fetchReassignRequests = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks/reassign/inbox`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();
    setReassignRequests(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-summary-bubble]')) {
        setOpenSummaryTaskId(null);
      }
    };
    window.addEventListener('click', closeOnOutsideClick);
    return () => window.removeEventListener('click', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    fetchReassignRequests();
  }, [user]);


  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    document.title = 'Tasks | Pristine Forests';
    fetchTasks();
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/team`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setTeamMembers);
  }, []);

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const isWithinRange = (dateString: string, range: string) => {
    const taskDate = new Date(dateString);
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    switch (range) {
      case 'today':
        return taskDate >= startOfToday;

      case 'yesterday': {
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        return taskDate >= startOfYesterday && taskDate < startOfToday;
      }

      case 'last7': {
        const last7 = new Date();
        last7.setDate(last7.getDate() - 7);
        return taskDate >= last7;
      }

      case 'last14': {
        const last14 = new Date();
        last14.setDate(last14.getDate() - 14);
        return taskDate >= last14;
      }

      default:
        return true;
    }
  };

  const filteredTasks = tasks.filter(task => {
  if (
    searchQuery &&
    !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return false;
  }
  if (statusFilter !== 'all' && task.status !== statusFilter) {
    return false;
  }
  if (dateFilter && !task.created_at?.startsWith(dateFilter)) {
    return false;
  }
  if (
    dateRange !== 'all' &&
    task.created_at &&
    !isWithinRange(task.created_at, dateRange)
  ) {
    return false;
  }
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

  const updateTask = async (id: string, updates: Partial<Task>) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === id ? { ...task, ...updates } : task
    )
  );

  try {
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status: updates.status }),
      }
    );
  } catch (err) {
    console.error('Failed to update task', err);
  }
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

            {/* LEFT ZONE */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Back button (original position, NO extra icon) */}
              <Button
                onClick={() => navigate('/workspace')}
                variant="ghost"
                className="rounded-lg text-white/90 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>

              {/* Title block */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg">
                  <CheckSquare className="h-7 w-7 text-white" />
                </div>

                <div>
                  <h1 className="font-display text-2xl sm:text-4xl font-normal text-white">
                    My Tasks
                  </h1>
                  <p className="font-sans text-sm sm:text-lg text-white/80">
                    Tasks assigned to you from meetings
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT ZONE */}
            <div className="flex justify-start sm:justify-end">
              <Button
                onClick={() =>
                  setActiveTab(activeTab === 'tasks' ? 'reassign' : 'tasks')
                }
                className="relative rounded-full bg-white/10 px-5 py-2 text-white hover:bg-white/20 transition"
              >
                Reassignment Inbox
                {reassignRequests.length > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 px-2 text-xs">
                    {reassignRequests.length}
                  </span>
                )}
              </Button>
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
              <option value="blocked">Blocked</option>
              <option value="on-hold">On Hold</option>
              <option value="in-progress">In Progress</option>
            </select>

            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value as any)}
              className="rounded-lg border px-3 py-2
                        bg-white dark:bg-dark-bg
                        text-gray-900 dark:text-white
                        focus:outline-none focus:ring-2 focus:ring-mint-accent"
            >
              <option value="all">All Days</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 Days</option>
              <option value="last14">Last 14 Days</option>
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
     
    <div className="mx-auto max-w-6xl space-y-4 max-h-[70vh] overflow-y-auto overflow-x-visible px-2">
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-4">
          {activeTab === 'tasks' && filteredTasks.map(task => (
            <div
                key={task.id}
                className="
                  flex flex-col sm:flex-row
                  sm:justify-between
                  gap-4 sm:gap-6
                  rounded-xl border
                  bg-white/5 dark:bg-dark-card
                  p-4 sm:p-6
                  shadow-card hover:shadow-card-hover
                  transition-all relative
                "
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
                {task.priority && (
                  <div className="mt-2">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium
                        ${PRIORITY_STYLES[task.priority]}`}
                    >
                      Priority: {task.priority.toUpperCase()}
                    </span>
                  </div>
                )}
                {task.created_at && (
                  <div className="mt-3 text-xs text-muted-text">
                    {formatTaskDate(task.created_at)}
                  </div>
                )}
              </div>

              {/* RIGHT: Status Dropdown */}
              <div className="flex flex-col items-end gap-2 relative">
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
                  <div className="absolute left-0 z-30 mt-2 w-56 rounded-xl border
                                  bg-white dark:bg-dark-card shadow-xl p-2">
                    {['pending', 'in-progress', 'completed', 'blocked', 'on-hold'].map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          updateTask(task.id, { status: option as TaskStatus });
                          setOpenDropdownTaskId(null);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm
                          text-gray-700 dark:text-gray-100
                          hover:bg-gray-100 dark:hover:bg-dark-hover
                          ${task.status === option ? STATUS_STYLES[option] : ''}`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                        {task.status === option && <Check className="h-4 w-4" />}
                      </button>
                    ))}

                    {/* WRONG with secondary dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenWrongSubmenuTaskId(
                            openWrongSubmenuTaskId === task.id ? null : task.id
                          )
                        }
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm
                          text-gray-700 dark:text-gray-100
                          hover:bg-gray-100 dark:hover:bg-dark-hover"
                      >
                        Wrong
                        <span className="text-xs">▸</span>
                      </button>

                      {openWrongSubmenuTaskId === task.id && (
                        <div className="absolute right-full top-0 z-40 mr-2 w-64 rounded-xl border
                          bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100 shadow-xl p-2
                          /* Desktop */
                          sm:right-full sm:top-0 sm:mr-2

                          /* Mobile */
                          left-0 top-full mt-2 sm:left-auto sm:mt-0">
                          <button
                            onClick={() => {
                              setReassignModalTask(task);
                              setOpenWrongSubmenuTaskId(null);
                              setOpenDropdownTaskId(null);
                            }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm
                              text-gray-800 dark:text-gray-100
                              hover:bg-soft-mint dark:hover:bg-mint-accent/20"
                          >
                            Task is correct but assigned to wrong member
                          </button>

                          <button
                            onClick={() => {
                              openEditModal(task);
                              setOpenWrongSubmenuTaskId(null);
                              setOpenDropdownTaskId(null);
                            }}
                            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm
                              hover:bg-gray-100 dark:hover:bg-dark-hover"
                          >
                            Task assigned correctly but details are wrong
                          </button>
                        </div>
                      )}
                    </div>

                    <hr className="my-2 border-gray-200 dark:border-dark-border" />

                    <button
                      onClick={() => {
                        openEditModal(task);
                        setOpenDropdownTaskId(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-mint-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="relative mt-2 flex justify-end">
                <button
                    onClick={(e) => {
                      e.stopPropagation();

                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

                      setSummaryPosition({
                        top: rect.bottom + 8,
                        left: Math.min(rect.left, window.innerWidth - 320),
                      });

                      setOpenSummaryTaskId(
                        openSummaryTaskId === task.id ? null : task.id
                      );
                    }}
                    className="
                      flex items-center gap-1.5
                      rounded-md px-2 py-1
                      text-xs font-medium
                      text-gray-600 dark:text-gray-300
                      hover:bg-gray-100 dark:hover:bg-dark-hover
                      transition
                    "
                  >
                    <Info className="h-3.5 w-3.5" />
                    Summary
                  </button>
                {openSummaryTaskId === task.id && summaryPosition && (
                  <div
                    data-summary-bubble
                    onClick={(e) => e.stopPropagation()}
                    className="
                      fixed z-[9999]
                      w-72 max-h-48 overflow-y-auto
                      rounded-xl
                      border border-black/5 dark:border-white/10
                      bg-white dark:bg-dark-card
                      text-sm text-gray-800 dark:text-gray-100
                      p-4

                      shadow-[0_6px_16px_rgba(0,0,0,0.15)]
                      dark:shadow-[0_6px_16px_rgba(0,0,0,0.6)]
                    "
                    style={{
                      top: summaryPosition.top,
                      left: summaryPosition.left,
                    }}
                  >
                    <div className="mb-2 font-medium text-mint-accent">
                      Meeting Summary
                    </div>

                    <p className="leading-relaxed">
                      {
                        tasks.find(t => t.id === openSummaryTaskId)
                          ?.meeting_summary || 'No summary available for this meeting.'
                      }
                    </p>
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

            {activeTab === 'reassign' && (
              <section className="px-6 py-10 lg:px-12">
                <div className="mx-auto max-w-5xl space-y-4">
                  {reassignRequests.length === 0 && (
                    <p className="text-muted-text">No reassignment requests 🎉</p>
                  )}

                  {reassignRequests.map(req => (
                    <div
                      key={req.id}
                      className="rounded-xl border bg-white dark:bg-dark-card p-6 flex justify-between items-center"
                    >
                      <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
                        {req.tasks.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Requested by {req.from_email}
                      </p>
                      <div className="flex gap-3">
                        <Button
                          onClick={async () => {
                            await fetch(
                              `${import.meta.env.VITE_BACKEND_URL}/api/tasks/reassign/${req.id}`,
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                                },
                                body: JSON.stringify({ action: 'accepted' }),
                              }
                            );
                            fetchReassignRequests();
                            fetchTasks();
                          }}
                        >
                          Accept
                        </Button>

                        <Button
                          variant="outline"
                          onClick={async () => {
                            await fetch(
                              `${import.meta.env.VITE_BACKEND_URL}/api/tasks/reassign/${req.id}`,
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                                },
                                body: JSON.stringify({ action: 'rejected' }),
                              }
                            );
                            fetchReassignRequests();
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ✅ WRONG REASON DIALOG
          {wrongReasonTask && (
            <Dialog open onOpenChange={() => setWrongReasonTask(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Why is this task wrong?</DialogTitle>
                </DialogHeader>

                <Button
                  onClick={() => {
                    setReassignModalTask(wrongReasonTask);
                    setWrongReasonTask(null);
                  }}
                >
                  Task is correct but assigned to wrong member
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    openEditModal(wrongReasonTask);
                    setWrongReasonTask(null);
                  }}
                >
                  Task assigned correctly but details are wrong
                </Button>
              </DialogContent>
            </Dialog>
          )} */}

          {/* ✅ REASSIGN MODAL */}
          {reassignModalTask && (
            <Dialog open onOpenChange={() => setReassignModalTask(null)}>
              <DialogContent className="rounded-2xl bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-forest-dark dark:text-white">
                    Reassign Task
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4 grid grid-cols-1 gap-2">
                  {teamMembers.map(member => (
                    <button
                      key={member.email}
                      onClick={async () => {
                        await fetch(
                          `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${reassignModalTask.id}/reassign`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                            body: JSON.stringify({ toEmail: member.email }),
                          }
                        );
                        setReassignModalTask(null);
                      }}
                      className="rounded-xl border px-4 py-3 text-left
                        hover:bg-soft-mint dark:hover:bg-mint-accent/20
                        transition"
                    >
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-text">{member.email}</div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        </section>
      </div>
    </div>
  );
}
