import { useEffect, useState } from 'react';
import { ArrowLeft, CheckSquare, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const token = localStorage.getItem('token');

  const [tasks, setTasks] = useState<any[]>([]);

  const DUMMY_TASKS = [
  {
    id: '1',
    title: 'Prepare weekly security report',
    description: 'Based on last team meeting',
    due_date: '2026-01-25',
    is_completed: false,
  },
  {
    id: '2',
    title: 'Review Pristine Forests workspace RBAC',
    description: 'Check intern vs admin permissions',
    due_date: '2026-01-27',
    is_completed: true,
  },
  {
    id: '3',
    title: 'Sync Mattermost meeting notes',
    description: 'Extract tasks from meeting summary',
    due_date: null,
    is_completed: false,
  },]

  useEffect(() => {
    document.title = 'Tasks | Pristine Forests';

    setTasks(DUMMY_TASKS);

    // fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tasks`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // })
    //   .then(res => res.json())
    //   .then(setTasks)
    //   .catch(() => {
    //     toast({
    //       title: 'Error',
    //       description: 'Failed to load tasks',
    //       variant: 'destructive',
    //     });
    //   });
  }, []);

  const toggleTask = async (id: string) => {
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/tasks/${id}/toggle`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, is_completed: !t.is_completed } : t
      )
    );
  };

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">
      {/* Header */}
      <section className="bg-forest-gradient px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-5xl flex items-center gap-4">
          <Button
            onClick={() => navigate('/workspace')}
            variant="ghost"
            className="text-white/90 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg">
              <CheckSquare className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display text-white">
                My Tasks
              </h1>
              <p className="text-white/80">
                Tasks assigned to you from meetings
              </p>
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
              className="flex items-start gap-4 rounded-xl border bg-white dark:bg-dark-card p-6 shadow-card hover:shadow-card-hover transition"
            >
              <input
                type="checkbox"
                checked={task.is_completed}
                onChange={() => toggleTask(task.id)}
                className="mt-1 h-5 w-5 accent-mint-accent"
              />

              <div className="flex-1">
                <h3 className={`text-lg font-medium ${
                  task.is_completed
                    ? 'line-through text-muted-foreground'
                    : 'text-heading-dark dark:text-dark-text'
                }`}>
                  {task.title}
                </h3>

                {task.description && (
                  <p className="text-sm text-muted-text mt-1">
                    {task.description}
                  </p>
                )}

                {task.due_date && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-text">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.due_date).toDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
