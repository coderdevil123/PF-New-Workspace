import { useEffect, useState } from 'react';
import { ArrowLeft, CheckSquare, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

type Task = {
  id: string;
  title: string;
  description?: string;
  // is_completed: boolean;
  created_at?: string;
  in_progress: boolean | null;
  completed: boolean | null;
  is_correct: boolean | null;
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

const DUMMY_TASKS = [
  {
    id: '1',
    title: 'Prepare weekly security report',
    description: 'Based on last team meeting',
    // is_completed: true,
    created_at: '2026-01-29T10:45:00Z',
    in_progress: null,
    completed: null,
    is_correct: null,
  },
  {
    id: '2',
    title: 'Review Pristine Forests workspace RBAC',
    description: 'Check intern vs admin permissions',
    // is_completed: false,
    created_at: '2026-01-29T11:10:00Z',
    in_progress: null,
    completed: null,
    is_correct: null,
  },
  {
    id: '3',
    title: 'Sync Mattermost meeting notes',
    description: 'Extract tasks from meeting summary',
    // is_completed: false,
    created_at: '2026-01-29T12:30:00Z',
    in_progress: null,
    completed: null,
    is_correct: null,
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

      {/* Task List */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-4">
          {tasks.map(task => (
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
                    task.completed
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
                  Task Status ▾
                </button>

                {openDropdownTaskId === task.id && (
                  <div
                    className="absolute right-0 z-30 mt-2 w-64 rounded-xl border
                              bg-white dark:bg-dark-card
                              shadow-xl p-3 space-y-3"
                  >
                    {/* In Progress */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Task In-Progress
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              in_progress:
                                task.in_progress === true ? null : true,
                            })
                          }
                          className={`px-2 py-1 rounded text-xs ${
                            task.in_progress === true
                              ? 'bg-mint-accent text-white'
                              : 'bg-gray-200 dark:bg-dark-hover text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          Yes
                        </button>

                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              in_progress:
                                task.in_progress === false ? null : false,
                            })
                          }
                          className={`px-2 py-1 rounded text-xs ${
                            task.in_progress === false
                              ? 'bg-mint-accent text-white'
                              : 'bg-gray-200 dark:bg-dark-hover text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Completed */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Task Completed
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              completed:
                                task.completed === true ? null : true,
                            })
                          }
                          className={`px-2 py-1 rounded text-xs ${
                            task.completed === true
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-dark-hover text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          Yes
                        </button>

                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              completed:
                                task.completed === false ? null : false,
                            })
                          }
                          className={`px-2 py-1 rounded text-xs ${
                            task.completed === false
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-dark-hover text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Correct */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        Task Correct?
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              is_correct:
                                task.is_correct === true ? null : true,
                            })
                          }
                          className={`px-2 py-1 rounded text-xs ${
                            task.is_correct === true
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-dark-hover text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          Yes
                        </button>

                        <button
                          onClick={() =>
                            updateTask(task.id, {
                              is_correct:
                                task.is_correct === false ? null : false,
                            })
                          }
                          className={`px-2 py-1 rounded text-xs ${
                            task.is_correct === false
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 dark:bg-dark-hover text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    <hr className="border-gray-200 dark:border-dark-border" />

                    {/* Edit */}
                    <button
                      onClick={() => {
                        openEditModal(task);
                        setOpenDropdownTaskId(null);
                      }}
                      className="w-full text-left text-sm text-mint-accent hover:underline"
                    >
                      Edit Task
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
                    Edit Task
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
  );
}
