import { useEffect, useState, useCallback, useRef } from 'react';
import { ArrowLeft, CheckSquare, Check, Pencil, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../components/ui/dialog';

type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'wrong' | 'blocked' | 'on-hold';
type TaskPriority = 'high' | 'medium' | 'low';
type Task = {
  id: string; title: string; priority?: TaskPriority;
  meeting_summary?: string; description?: string;
  created_at?: string; status: TaskStatus | null; issue_reported?: boolean;
};

const API      = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem('token') || '';
const LIMIT    = 20;

const formatTaskDate = (d: string) =>
  new Date(d).toLocaleString('en-US', {
    weekday: 'short', day: '2-digit', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const STATUS_STYLES: Record<TaskStatus, string> = {
  pending:      'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200',
  'in-progress':'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200',
  completed:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200',
  wrong:        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200',
  blocked:      'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200',
  'on-hold':    'bg-gray-200 text-gray-700 dark:bg-gray-700/40 dark:text-gray-200',
};
const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200',
  low:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200',
};

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Data ─────────────────────────────────────────────────────────────────
  const [tasks, setTasks]                       = useState<Task[]>([]);
  const [teamMembers, setTeamMembers]           = useState<{ name: string; email: string }[]>([]);
  const [reassignRequests, setReassignRequests] = useState<any[]>([]);
  const [page, setPage]                         = useState(1);
  const [hasMore, setHasMore]                   = useState(true);
  const [total, setTotal]                       = useState(0);

  // ── Loading ───────────────────────────────────────────────────────────────
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore]       = useState(false);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]                           = useState<'tasks' | 'reassign'>('tasks');
  const [editingTask, setEditingTask]                       = useState<Task | null>(null);
  const [editTitle, setEditTitle]                           = useState('');
  const [editDescription, setEditDescription]               = useState('');
  const [selectedTaskView, setSelectedTaskView]             = useState<Task | null>(null);
  const [reassignModalTask, setReassignModalTask]           = useState<Task | null>(null);
  const [openDropdownTaskId, setOpenDropdownTaskId]         = useState<string | null>(null);
  const [openWrongSubmenuTaskId, setOpenWrongSubmenuTaskId] = useState<string | null>(null);
  const [openSummaryTaskId, setOpenSummaryTaskId]           = useState<string | null>(null);
  const [summaryPosition, setSummaryPosition]               = useState<{ top: number; left: number } | null>(null);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [dateFilter, setDateFilter]     = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [dateRange, setDateRange]       = useState<'all' | 'today' | 'yesterday' | 'last7' | 'last14'>('all');

  // ── Sentinel ref for IntersectionObserver ────────────────────────────────
  const sentinelRef    = useRef<HTMLDivElement>(null);
  const searchDebounce = useRef<ReturnType<typeof setTimeout>>();

  // ── Build query string ────────────────────────────────────────────────────
  const buildQS = useCallback((pageNum: number) => {
    const p = new URLSearchParams();
    p.set('page',  String(pageNum));
    p.set('limit', String(LIMIT));
    if (statusFilter && statusFilter !== 'all') p.set('status',     statusFilter);
    if (searchQuery)                            p.set('search',     searchQuery);
    if (dateFilter)                             p.set('dateFilter', dateFilter);
    if (dateRange && dateRange !== 'all')       p.set('dateRange',  dateRange);
    return p.toString();
  }, [statusFilter, searchQuery, dateFilter, dateRange]);

  // ── Fetch a page of tasks ─────────────────────────────────────────────────
  const fetchTasks = useCallback(async (pageNum: number, replace: boolean) => {
    if (replace) setInitialLoading(true);
    else         setLoadingMore(true);

    try {
      const res  = await fetch(`${API}/api/tasks?${buildQS(pageNum)}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      const newTasks   = Array.isArray(json) ? json : (json?.data ?? []);
      const pagination = json?.pagination;

      setTasks(prev => replace ? newTasks : [...prev, ...newTasks]);
      setPage(pageNum);
      setHasMore(pagination?.hasMore ?? false);
      setTotal(pagination?.total ?? 0);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  }, [buildQS]);

  // ── Fetch team + reassign inbox once on mount ─────────────────────────────
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    document.title = 'Tasks | Pristine Forests';

    Promise.all([
      fetch(`${API}/api/team`,                  { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
      fetch(`${API}/api/tasks/reassign/inbox`,  { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
    ]).then(([teamJson, reassignJson]) => {
      setTeamMembers(Array.isArray(teamJson)    ? teamJson    : []);
      setReassignRequests(Array.isArray(reassignJson) ? reassignJson : []);
    });
  }, [user]);

  // ── Re-fetch on filter change (debounce search) ───────────────────────────
  useEffect(() => {
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      fetchTasks(1, true);
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(searchDebounce.current);
  }, [statusFilter, searchQuery, dateFilter, dateRange]);

  // ── IntersectionObserver ──────────────────────────────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !initialLoading) {
        fetchTasks(page + 1, false);
      }
    }, { threshold: 0.1 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, initialLoading, page, fetchTasks]);

  // ── Close summary on outside click ───────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-summary-bubble]'))
        setOpenSummaryTaskId(null);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  // ── Optimistic task update ────────────────────────────────────────────────
  const updateTask = async (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    try {
      await fetch(`${API}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ status: updates.status }),
      });
    } catch {
      fetchTasks(1, true); // rollback
    }
  };

  const saveEditedTask = () => {
    if (!editingTask) return;
    updateTask(editingTask.id, { title: editTitle, description: editDescription });
    setEditingTask(null);
  };

  const reloadAll = () => {
    fetchTasks(1, true);
    fetch(`${API}/api/tasks/reassign/inbox`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json()).then(d => setReassignRequests(Array.isArray(d) ? d : []));
  };

  const hasActiveFilters = statusFilter !== 'all' || searchQuery || dateFilter || dateRange !== 'all';

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-dark-bg overflow-hidden">
      {/* ── HEADER ── */}
      <section className="relative overflow-hidden bg-forest-gradient px-6 py-8 lg:px-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
          }} />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button onClick={() => navigate('/workspace')} variant="ghost"
                className="rounded-lg text-white/90 hover:bg-white/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg">
                  <CheckSquare className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-2xl sm:text-4xl font-normal text-white">My Tasks</h1>
                  <p className="font-sans text-sm sm:text-lg text-white/80">Tasks assigned to you from meetings</p>
                </div>
              </div>
            </div>
            <Button onClick={() => setActiveTab(activeTab === 'tasks' ? 'reassign' : 'tasks')}
              className="relative rounded-full bg-white/10 px-5 py-2 text-white hover:bg-white/20 transition">
              Reassignment Inbox
              {reassignRequests.length > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 text-xs">{reassignRequests.length}</span>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="px-6 pt-6 pb-2 lg:px-12">
        <div className="mx-auto max-w-5xl flex flex-wrap gap-3 items-center">
          <input type="text" placeholder="Search tasks..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-56 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="wrong">Wrong</option>
            <option value="blocked">Blocked</option>
            <option value="on-hold">On Hold</option>
          </select>
          <select value={dateRange} onChange={e => setDateRange(e.target.value as any)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
            <option value="all">All Days</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7">Last 7 Days</option>
            <option value="last14">Last 14 Days</option>
          </select>
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent" />
          {hasActiveFilters && (
            <button
              onClick={() => { setStatusFilter('all'); setSearchQuery(''); setDateFilter(''); setDateRange('all'); }}
              className="rounded-lg border px-3 py-2 text-sm text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              Clear filters
            </button>
          )}
        </div>
        {!initialLoading && activeTab === 'tasks' && (
          <p className="mx-auto max-w-5xl mt-2 px-0 text-xs text-muted-text">
            Showing {tasks.length} of {total} tasks
          </p>
        )}
      </section>

      {/* ── TASK LIST ── */}
      <section className="flex-1 px-6 py-6 lg:px-12 overflow-hidden">
        <div className="mx-auto max-w-7xl h-full flex flex-col px-2 sm:px-4">
          <div className="flex-1 overflow-y-auto space-y-8 px-4 sm:px-6 pr-3">

          {/* Initial spinner */}
          {initialLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-mint-accent border-t-transparent" />
              <span className="ml-3 text-muted-text">Loading tasks...</span>
            </div>
          )}

          {/* Task cards */}
          {!initialLoading && activeTab === 'tasks' && tasks.map(task => (
            <div key={task.id}
              className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:gap-6 rounded-xl border bg-white dark:bg-dark-card p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-all relative cursor-pointer">

              {/* LEFT */}
              <div className="flex-1 space-y-3 cursor-pointer" onClick={e => { e.stopPropagation(); setSelectedTaskView(task); }}>
                <h3 className={`text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                {task.priority && (
                  <span className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>
                    Priority: {task.priority.toUpperCase()}
                  </span>
                )}
                {task.created_at && (
                  <div className="text-sm text-muted-text pt-1">{formatTaskDate(task.created_at)}</div>
                )}
              </div>

              {/* RIGHT: Status */}
              <div className="flex flex-col items-end gap-2 relative">
                <button onClick={e => { e.stopPropagation(); setOpenDropdownTaskId(openDropdownTaskId === task.id ? null : task.id); }}
                  className="rounded-lg border px-4 py-2 text-sm bg-white dark:bg-dark-bg text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-hover transition">
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${task.status ? STATUS_STYLES[task.status] : 'bg-gray-200 text-gray-700'}`}>
                    {task.status ? task.status.toUpperCase() : 'SET STATUS'} ▾
                  </span>
                </button>

                {openDropdownTaskId === task.id && (
                  <div className="absolute left-0 z-30 mt-10 w-56 rounded-xl border bg-white dark:bg-dark-card shadow-xl p-2">
                    {(['pending', 'in-progress', 'completed', 'blocked', 'on-hold'] as TaskStatus[]).map(option => (
                      <button key={option}
                        onClick={() => { updateTask(task.id, { status: option }); setOpenDropdownTaskId(null); }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-hover ${task.status === option ? STATUS_STYLES[option] : ''}`}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                        {task.status === option && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                    <div className="relative">
                      <button onClick={() => setOpenWrongSubmenuTaskId(openWrongSubmenuTaskId === task.id ? null : task.id)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-hover">
                        Wrong <span className="text-xs">▸</span>
                      </button>
                      {openWrongSubmenuTaskId === task.id && (
                        <div className="absolute right-full top-0 z-40 mr-2 w-64 rounded-xl border bg-white dark:bg-dark-card text-gray-800 dark:text-gray-100 shadow-xl p-2">
                          <button onClick={() => { setReassignModalTask(task); setOpenWrongSubmenuTaskId(null); setOpenDropdownTaskId(null); }}
                            className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-soft-mint dark:hover:bg-mint-accent/20">
                            Task is correct but assigned to wrong member
                          </button>
                          <button onClick={() => { setEditingTask(task); setEditTitle(task.title); setEditDescription(task.description || ''); setOpenWrongSubmenuTaskId(null); setOpenDropdownTaskId(null); }}
                            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-hover">
                            Task assigned correctly but details are wrong
                          </button>
                        </div>
                      )}
                    </div>
                    <hr className="my-2 border-gray-200 dark:border-dark-border" />
                    <button onClick={() => { setEditingTask(task); setEditTitle(task.title); setEditDescription(task.description || ''); setOpenDropdownTaskId(null); }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-mint-accent">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="relative mt-2 flex justify-end">
                <button onClick={e => {
                  e.stopPropagation();
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setSummaryPosition({ top: rect.bottom + 8, left: Math.min(rect.left, window.innerWidth - 320) });
                  setOpenSummaryTaskId(openSummaryTaskId === task.id ? null : task.id);
                }} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-hover transition">
                  <Info className="h-3.5 w-3.5" /> Summary
                </button>
                {openSummaryTaskId === task.id && summaryPosition && (
                  <div data-summary-bubble onClick={e => e.stopPropagation()}
                    className="fixed z-[9999] w-72 max-h-48 overflow-y-auto rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-dark-card text-sm text-gray-800 dark:text-gray-100 p-4 shadow-[0_6px_16px_rgba(0,0,0,0.15)] dark:shadow-[0_6px_16px_rgba(0,0,0,0.6)]"
                    style={{ top: summaryPosition.top, left: summaryPosition.left }}>
                    <div className="mb-2 font-medium text-mint-accent">Meeting Summary</div>
                    <p className="leading-relaxed">{task.meeting_summary || 'No summary available.'}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!initialLoading && activeTab === 'tasks' && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-text text-lg">No tasks found.</p>
              {hasActiveFilters && <p className="text-muted-text text-sm mt-1">Try adjusting your filters.</p>}
            </div>
          )}

          {/* ── SENTINEL ── */}
          {activeTab === 'tasks' && <div ref={sentinelRef} className="h-4" />}

          {/* Bottom spinner */}
          {loadingMore && (
            <div className="flex items-center justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-mint-accent border-t-transparent" />
              <span className="ml-3 text-sm text-muted-text">Loading more tasks...</span>
            </div>
          )}

          {/* All loaded */}
          {!initialLoading && !loadingMore && !hasMore && tasks.length > 0 && activeTab === 'tasks' && (
            <p className="text-center text-xs text-muted-text py-4">✓ All {total} tasks loaded</p>
          )}

          {/* ── REASSIGN TAB ── */}
          {!initialLoading && activeTab === 'reassign' && (
            <div className="space-y-4 py-4">
              {reassignRequests.length === 0 && (
                <p className="text-muted-text text-center py-10">No reassignment requests 🎉</p>
              )}
              {reassignRequests.map(req => (
                <div key={req.id} className="rounded-xl border bg-white dark:bg-dark-card p-6 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">{req.tasks?.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Requested by {req.from_email}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={async () => {
                      await fetch(`${API}/api/tasks/reassign/${req.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                        body: JSON.stringify({ action: 'accepted' }),
                      });
                      reloadAll();
                    }}>Accept</Button>
                    <Button variant="outline" onClick={async () => {
                      await fetch(`${API}/api/tasks/reassign/${req.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                        body: JSON.stringify({ action: 'rejected' }),
                      });
                      reloadAll();
                    }}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      </section>

      {/* ── TASK DETAIL DIALOG ── */}
      {selectedTaskView && (
        <Dialog open onOpenChange={() => setSelectedTaskView(null)}>
          <DialogContent className="max-w-xl max-h-[80vh] overflow-hidden rounded-2xl border border-border bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-heading-dark dark:text-white">{selectedTaskView.title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-wrap gap-3 mt-3">
              {selectedTaskView.priority && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-text">Task Priority</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${PRIORITY_STYLES[selectedTaskView.priority]}`}>{selectedTaskView.priority.toUpperCase()}</span>
                </div>
              )}
              {selectedTaskView.status && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-muted-text">Current Status</span>
                  <span className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_STYLES[selectedTaskView.status]}`}>{selectedTaskView.status.toUpperCase()}</span>
                </div>
              )}
            </div>
            <hr className="my-5 border-border" />
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-mint-accent mb-2">
                Meeting Summary
              </h3>

              <div className="
                  max-h-64
                  overflow-y-auto
                  rounded-lg
                  border border-border
                  bg-light-gray dark:bg-dark-hover
                  p-4
                  text-sm
                  leading-relaxed
                  text-gray-700 dark:text-gray-300
                  whitespace-pre-wrap
                "
              >
                {selectedTaskView.meeting_summary || 'No summary available.'}
              </div>
            </div>
            {selectedTaskView.description && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-mint-accent mb-2">Jellyfin Recording</h3>
                <a href={selectedTaskView.description} target="_blank" rel="noopener noreferrer"
                  className="inline-block text-sm font-medium text-blue-600 dark:text-blue-400 underline underline-offset-4 hover:text-blue-500">Open Recording</a>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* ── EDIT MODAL ── */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-dark-card p-6 shadow-2xl">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Pencil className="h-4 w-4" /> Edit Task
            </h3>
            <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
              className="mb-3 w-full rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
              placeholder="Task title" />
            <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)}
              className="mb-4 w-full rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
              rows={3} placeholder="Task description" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditingTask(null)} className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Cancel</button>
              <button onClick={saveEditedTask} className="rounded-lg bg-mint-accent px-4 py-2 text-sm font-medium text-white">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ── REASSIGN MODAL ── */}
      {reassignModalTask && (
        <Dialog open onOpenChange={() => setReassignModalTask(null)}>
          <DialogContent className="rounded-2xl bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-forest-dark dark:text-white">Reassign Task</DialogTitle>
            </DialogHeader>
            <div className="mt-4 grid grid-cols-1 gap-2">
              {teamMembers.map(member => (
                <button key={member.email}
                  onClick={async () => {
                    await fetch(`${API}/api/tasks/${reassignModalTask.id}/reassign`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                      body: JSON.stringify({ toEmail: member.email }),
                    });
                    setReassignModalTask(null);
                  }}
                  className="rounded-xl border px-4 py-3 text-left hover:bg-soft-mint dark:hover:bg-mint-accent/20 transition">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-xs text-muted-text">{member.email}</div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}