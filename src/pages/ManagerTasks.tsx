// import { useEffect, useState, useCallback } from 'react';
// import { ArrowLeft, Briefcase, Bell } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../components/ui/button';
// import { useAuth } from '../contexts/AuthContext';

// type Task = {
//   id: string;
//   title: string;
//   status: string;
//   priority?: string;
//   created_at?: string;
//   assigned_to_email: string;
//   department?: string;
// };

// type TeamMember = { name: string; email: string; department: string; };

// const API = import.meta.env.VITE_BACKEND_URL;
// const getToken = () => localStorage.getItem('token') || '';

// const normalize = (v?: string) => v?.toLowerCase().trim() || '';

// const formatDate = (date?: string) =>
//   date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

// export default function ManagerTasks() {
//   const { user }  = useAuth();
//   const navigate  = useNavigate();

//   const [tasks, setTasks]                     = useState<Task[]>([]);
//   const [members, setMembers]                 = useState<TeamMember[]>([]);
//   const [loading, setLoading]                 = useState(true);

//   const [department, setDepartment]           = useState('');
//   const [memberEmail, setMemberEmail]         = useState('');
//   const [searchQuery, setSearchQuery]         = useState('');
//   const [statusFilter, setStatusFilter]       = useState('all');
//   const [dateFilter, setDateFilter]           = useState('');

//   const [reminderOpen, setReminderOpen]       = useState(false);
//   const [reminderDept, setReminderDept]       = useState('');
//   const [reminderEmail, setReminderEmail]     = useState('');
//   const [reminderMessage, setReminderMessage] = useState('');
//   const [sendingReminder, setSendingReminder] = useState(false);
//   const [selectedTaskId, setSelectedTaskId]   = useState('');
//   const [reminderStatus, setReminderStatus]   = useState('');
//   const [memberTasks, setMemberTasks]         = useState<Task[]>([]);

//   // Load tasks + team in parallel
//   const loadAll = useCallback(async () => {
//     setLoading(true);
//     try {
//       const [tasksRes, teamRes] = await Promise.all([
//         fetch(`${API}/api/manager/tasks`, { headers: { Authorization: `Bearer ${getToken()}` } }),
//         fetch(`${API}/api/team`,          { headers: { Authorization: `Bearer ${getToken()}` } }),
//       ]);

//       const tasksJson = await tasksRes.json();
//       const teamJson  = await teamRes.json();

//       // Handle both array and paginated response shapes
//       const taskList = Array.isArray(tasksJson) ? tasksJson : (tasksJson?.data ?? []);
//       setTasks(taskList);
//       setMembers(Array.isArray(teamJson) ? teamJson : []);
//     } catch (err) {
//       console.error('Failed to load manager data', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!user) { navigate('/login'); return; }
//     document.title = 'Manager Console | Pristine Forests';
//     loadAll();
//   }, [user]);

//   // Filtered members for dept dropdown
//   const filteredMembers = department
//     ? members.filter(m => normalize(m.department) === normalize(department))
//     : members;

//   // Member tasks for reminder modal
//   useEffect(() => {
//     if (!reminderEmail) { setMemberTasks([]); setSelectedTaskId(''); return; }
//     setMemberTasks(tasks.filter(t =>
//       t.assigned_to_email === reminderEmail &&
//       normalize(t.department) === normalize(reminderDept)
//     ));
//   }, [reminderEmail, reminderDept, tasks]);

//   useEffect(() => {
//     if (!selectedTaskId) return;
//     const task = tasks.find(t => t.id === selectedTaskId);
//     if (task) { setReminderStatus(task.status); setReminderEmail(task.assigned_to_email); setReminderDept(task.department || ''); }
//   }, [selectedTaskId]);

//   const getMemberName = (email: string) => members.find(m => m.email === email)?.name || email;

//   const visibleTasks = tasks.filter(task => {
//     if (department && normalize(task.department) !== normalize(department)) return false;
//     if (memberEmail && task.assigned_to_email !== memberEmail) return false;
//     if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
//     if (statusFilter !== 'all' && task.status !== statusFilter) return false;
//     if (dateFilter && task.created_at && !task.created_at.startsWith(dateFilter)) return false;
//     return true;
//   });

//   if (!user) return null;

//   return (
//     <div className="min-h-full bg-white dark:bg-dark-bg">

//       {/* HEADER */}
//       <section className="bg-forest-gradient px-6 py-8 lg:px-12">
//         <div className="mx-auto max-w-5xl flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button onClick={() => navigate('/workspace')} variant="ghost" className="text-white/90 hover:bg-white/10">
//               <ArrowLeft className="h-4 w-4 mr-2" /> Back
//             </Button>
//             <div className="flex items-center gap-3">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint-accent">
//                 <Briefcase className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-display text-white">Manager Console</h1>
//                 <p className="text-white/80">Monitor & manage team tasks</p>
//               </div>
//             </div>
//           </div>
//           <Button onClick={() => setReminderOpen(true)} className="rounded-full bg-white/10 text-white hover:bg-white/20">
//             <Bell className="h-4 w-4 mr-2" /> Task Reminder
//           </Button>
//         </div>
//       </section>

//       {/* FILTERS */}
//       <section className="px-6 py-8 lg:px-12">
//         <div className="mx-auto max-w-5xl flex flex-col sm:flex-row gap-3 sm:gap-4">
//           <input type="text" placeholder="Search tasks..." value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent" />
//           <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
//             className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent" />
//           <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
//             className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="in-progress">In Progress</option>
//             <option value="completed">Completed</option>
//             <option value="blocked">Blocked</option>
//             <option value="on-hold">On Hold</option>
//           </select>
//           <select value={department}
//             onChange={e => { setDepartment(e.target.value); setMemberEmail(''); setSearchQuery(''); setStatusFilter('all'); }}
//             className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
//             <option value="">Select Department</option>
//             <option value="technology">Technology</option>
//             <option value="design">Design</option>
//             <option value="marketing">Marketing</option>
//             <option value="operations">Operations</option>
//           </select>
//           <select value={memberEmail} onChange={e => setMemberEmail(e.target.value)}
//             className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
//             <option value="">Select Team Member</option>
//             {filteredMembers.map(m => (
//               <option key={m.email} value={m.email}>{m.name || m.email}</option>
//             ))}
//           </select>
//         </div>
//       </section>

//       {/* TASK LIST */}
//       <div className="mx-auto max-w-6xl space-y-4 max-h-[70vh] overflow-y-auto overflow-x-visible px-2">
//         <section className="px-4 sm:px-6 pb-12 lg:px-12">
//           <div className="mx-auto max-w-5xl space-y-6">

//             {loading && (
//               <div className="flex items-center justify-center py-20">
//                 <div className="h-8 w-8 animate-spin rounded-full border-4 border-mint-accent border-t-transparent" />
//                 <span className="ml-3 text-muted-text">Loading tasks...</span>
//               </div>
//             )}

//             {!loading && visibleTasks.map(task => (
//               <div key={task.id}
//                 className="w-full rounded-2xl border bg-white/5 dark:bg-dark-card p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-all">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">{task.title}</h3>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Assigned to: {getMemberName(task.assigned_to_email)}</p>
//                 <div className="mt-2 flex flex-wrap gap-2 items-center">
//                   <span className="rounded-full px-3 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
//                     {task.status.toUpperCase()}
//                   </span>
//                   {task.priority && (
//                     <span className={`rounded-full px-3 py-1 text-xs font-medium ${
//                       task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200' :
//                       task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
//                       'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'}`}>
//                       PRIORITY: {task.priority.toUpperCase()}
//                     </span>
//                   )}
//                   {task.department && (
//                     <span className="rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
//                       {task.department.toUpperCase()}
//                     </span>
//                   )}
//                   {task.created_at && <span className="text-xs text-muted-text">{formatDate(task.created_at)}</span>}
//                   <Button size="sm" className="mt-3"
//                     onClick={() => {
//                       setReminderDept(task.department || '');
//                       setReminderEmail(task.assigned_to_email);
//                       setSelectedTaskId(task.id);
//                       setReminderStatus(task.status);
//                       setReminderOpen(true);
//                     }}>
//                     Reminder
//                   </Button>
//                 </div>
//               </div>
//             ))}

//             {!loading && visibleTasks.length === 0 && (
//               <p className="text-muted-text">No tasks found for selected filters.</p>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* REMINDER MODAL */}
//       {reminderOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-[92vw] sm:w-full max-w-md rounded-2xl bg-white dark:bg-dark-card p-5 sm:p-6 shadow-2xl">
//             <h3 className="text-xl font-semibold mb-4">Send Task Reminder</h3>

//             <select value={reminderDept} onChange={e => { setReminderDept(e.target.value); setReminderEmail(''); }}
//               className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
//               <option value="">Select Department</option>
//               <option value="technology">Technology</option>
//               <option value="design">Design</option>
//               <option value="marketing">Marketing</option>
//               <option value="operations">Operations</option>
//             </select>

//             <select disabled={!reminderDept} value={reminderEmail} onChange={e => setReminderEmail(e.target.value)}
//               className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
//               <option value="">Select Team Member</option>
//               {(reminderDept ? members.filter(m => normalize(m.department) === normalize(reminderDept)) : members)
//                 .map(m => <option key={m.email} value={m.email}>{m.name}</option>)}
//             </select>

//             <select disabled={!memberTasks.length} value={selectedTaskId} onChange={e => setSelectedTaskId(e.target.value)}
//               className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
//               <option value="">Select Task</option>
//               {memberTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
//             </select>

//             <select value={reminderStatus} onChange={e => setReminderStatus(e.target.value)} disabled={!selectedTaskId}
//               className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent">
//               <option value="">Update Task Status (optional)</option>
//               <option value="pending">Pending</option>
//               <option value="in-progress">In Progress</option>
//               <option value="completed">Completed</option>
//               <option value="blocked">Blocked</option>
//               <option value="on-hold">On Hold</option>
//             </select>

//             <textarea value={reminderMessage} onChange={e => setReminderMessage(e.target.value)}
//               placeholder="Write a short reminder message…" rows={4}
//               className="w-full rounded-lg border px-3 py-2 mb-4 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent" />

//             <div className="flex justify-end gap-3">
//               <Button variant="outline" onClick={() => setReminderOpen(false)}>Cancel</Button>
//               <Button disabled={!reminderEmail || !reminderMessage || sendingReminder}
//                 onClick={async () => {
//                   setSendingReminder(true);
//                   try {
//                     await Promise.all([
//                       // Update task status if selected
//                       selectedTaskId && reminderStatus
//                         ? fetch(`${API}/api/manager/update-task-status`, {
//                             method: 'PATCH',
//                             headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
//                             body: JSON.stringify({ taskId: selectedTaskId, status: reminderStatus, assignedToEmail: reminderEmail }),
//                           })
//                         : Promise.resolve(),
//                       // Send announcement
//                       fetch(`${API}/api/announcements`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
//                         body: JSON.stringify({
//                           title: 'Task Reminder', content: reminderMessage, category: 'Task',
//                           recipients: 'specific', tagged_emails: [reminderEmail],
//                           related_task_id: selectedTaskId || null,
//                           created_by: user?.email, created_by_name: user?.name,
//                         }),
//                       }),
//                     ]);
//                     // Refresh task list to show updated status
//                     loadAll();
//                   } finally {
//                     setSendingReminder(false);
//                     setReminderOpen(false);
//                     setReminderDept(''); setReminderEmail(''); setSelectedTaskId('');
//                     setReminderStatus(''); setReminderMessage('');
//                   }
//                 }}>
//                 {sendingReminder ? 'Sending...' : 'Send Reminder'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState, useCallback, useRef } from 'react';
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
  department?: string;
};

type TeamMember = { name: string; email: string; department: string };

const API      = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem('token') || '';
const normalize = (v?: string) => v?.toLowerCase().trim() || '';
const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

const LIMIT = 20;

export default function ManagerTasks() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Data ────────────────────────────────────────────────────────────────────
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal]     = useState(0);

  // ── Loading states ───────────────────────────────────────────────────────────
  const [initialLoading, setInitialLoading] = useState(true); // first load
  const [loadingMore, setLoadingMore]       = useState(false);  // bottom spinner

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [department,   setDepartment]   = useState('');
  const [memberEmail,  setMemberEmail]  = useState('');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter,   setDateFilter]   = useState('');

  // ── Reminder modal ───────────────────────────────────────────────────────────
  const [reminderOpen,    setReminderOpen]    = useState(false);
  const [reminderDept,    setReminderDept]    = useState('');
  const [reminderEmail,   setReminderEmail]   = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [sendingReminder, setSendingReminder] = useState(false);
  const [selectedTaskId,  setSelectedTaskId]  = useState('');
  const [reminderStatus,  setReminderStatus]  = useState('');
  const [memberTasks,     setMemberTasks]     = useState<Task[]>([]);

  // ── Infinite scroll sentinel ─────────────────────────────────────────────────
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Build query string from current filters ──────────────────────────────────
  const buildQueryString = useCallback((pageNum: number) => {
    const params = new URLSearchParams();
    params.set('page',  String(pageNum));
    params.set('limit', String(LIMIT));
    if (statusFilter && statusFilter !== 'all') params.set('status',      statusFilter);
    if (memberEmail)                            params.set('memberEmail', memberEmail);
    if (searchQuery)                            params.set('search',      searchQuery);
    if (dateFilter)                             params.set('dateFilter',  dateFilter);
    if (department)                             params.set('department',  department);
    return params.toString();
  }, [statusFilter, memberEmail, searchQuery, dateFilter, department]);

  // ── Fetch a page of tasks ────────────────────────────────────────────────────
  const fetchTasks = useCallback(async (pageNum: number, replace: boolean) => {
    if (replace) setInitialLoading(true);
    else         setLoadingMore(true);

    try {
      const res  = await fetch(`${API}/api/manager/tasks?${buildQueryString(pageNum)}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      const newTasks = Array.isArray(json) ? json : (json?.data ?? []);
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
  }, [buildQueryString]);

  // ── Load team members once ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    document.title = 'Manager Console | Pristine Forests';

    fetch(`${API}/api/team`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(d => setMembers(Array.isArray(d) ? d : []));
  }, [user]);

  // ── Initial load + re-load when filters change ───────────────────────────────
  // Debounce search so we don't fire on every keystroke
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      fetchTasks(1, true); // replace = true → reset list
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(searchDebounceRef.current);
  }, [statusFilter, memberEmail, searchQuery, dateFilter, department]);

  // ── IntersectionObserver: load next page when sentinel is visible ─────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingMore && !initialLoading) {
          fetchTasks(page + 1, false); // replace = false → append
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, initialLoading, page, fetchTasks]);

  // ── Reminder helpers ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!reminderEmail) { setMemberTasks([]); setSelectedTaskId(''); return; }
    setMemberTasks(tasks.filter(t =>
      t.assigned_to_email === reminderEmail &&
      normalize(t.department) === normalize(reminderDept)
    ));
  }, [reminderEmail, reminderDept, tasks]);

  useEffect(() => {
    if (!selectedTaskId) return;
    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
      setReminderStatus(task.status);
      setReminderEmail(task.assigned_to_email);
      setReminderDept(task.department || '');
    }
  }, [selectedTaskId]);

  const getMemberName = (email: string) => members.find(m => m.email === email)?.name || email;

  const filteredMembers = department
    ? members.filter(m => normalize(m.department) === normalize(department))
    : members;

  if (!user) return null;

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">

      {/* HEADER */}
      <section className="bg-forest-gradient px-6 py-8 lg:px-12">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/workspace')} variant="ghost" className="text-white/90 hover:bg-white/10">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint-accent">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display text-white">Manager Console</h1>
                <p className="text-white/80">Monitor & manage team tasks</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setReminderOpen(true)} className="rounded-full bg-white/10 text-white hover:bg-white/20">
            <Bell className="h-4 w-4 mr-2" /> Task Reminder
          </Button>
        </div>
      </section>

      {/* FILTERS */}
      <section className="px-6 py-6 lg:px-12">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
            <option value="on-hold">On Hold</option>
          </select>
          <select
            value={department}
            onChange={e => { setDepartment(e.target.value); setMemberEmail(''); }}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
          >
            <option value="">All Departments</option>
            <option value="technology">Technology</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="operations">Operations</option>
          </select>
          <select
            value={memberEmail}
            onChange={e => setMemberEmail(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
          >
            <option value="">All Members</option>
            {filteredMembers.map(m => (
              <option key={m.email} value={m.email}>{m.name || m.email}</option>
            ))}
          </select>

          {/* Clear filters button — only shows when any filter is active */}
          {(department || memberEmail || searchQuery || statusFilter !== 'all' || dateFilter) && (
            <button
              onClick={() => {
                setDepartment(''); setMemberEmail(''); setSearchQuery('');
                setStatusFilter('all'); setDateFilter('');
              }}
              className="rounded-lg border px-3 py-2 text-sm text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Task count */}
        {!initialLoading && (
          <p className="mx-auto max-w-5xl mt-3 text-xs text-muted-text">
            Showing {tasks.length} of {total} tasks
          </p>
        )}
      </section>

      {/* TASK LIST */}
      <section className="px-4 sm:px-6 pb-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-4">

          {/* Initial loading */}
          {initialLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-mint-accent border-t-transparent" />
              <span className="ml-3 text-muted-text">Loading tasks...</span>
            </div>
          )}

          {/* Task cards */}
          {!initialLoading && tasks.map(task => (
            <div
              key={task.id}
              className="w-full rounded-2xl border bg-white dark:bg-dark-card p-4 sm:p-6 shadow-card hover:shadow-card-hover transition-all"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{task.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Assigned to: {getMemberName(task.assigned_to_email)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                <span className="rounded-full px-3 py-1 text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                  {task.status.toUpperCase()}
                </span>
                {task.priority && (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    task.priority === 'high'   ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200' :
                    task.priority === 'medium' ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                                                 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200'
                  }`}>
                    PRIORITY: {task.priority.toUpperCase()}
                  </span>
                )}
                {task.department && (
                  <span className="rounded-full px-3 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                    {task.department.toUpperCase()}
                  </span>
                )}
                {task.created_at && (
                  <span className="text-xs text-muted-text">{formatDate(task.created_at)}</span>
                )}
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    setReminderDept(task.department || '');
                    setReminderEmail(task.assigned_to_email);
                    setSelectedTaskId(task.id);
                    setReminderStatus(task.status);
                    setReminderOpen(true);
                  }}
                >
                  Reminder
                </Button>
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!initialLoading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-text text-lg">No tasks found.</p>
              <p className="text-muted-text text-sm mt-1">Try adjusting your filters.</p>
            </div>
          )}

          {/* ── SENTINEL: IntersectionObserver watches this div ── */}
          <div ref={sentinelRef} className="h-4" />

          {/* Bottom spinner when loading more pages */}
          {loadingMore && (
            <div className="flex items-center justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-mint-accent border-t-transparent" />
              <span className="ml-3 text-sm text-muted-text">Loading more tasks...</span>
            </div>
          )}

          {/* All loaded message */}
          {!initialLoading && !loadingMore && !hasMore && tasks.length > 0 && (
            <p className="text-center text-xs text-muted-text py-4">
              ✓ All {total} tasks loaded
            </p>
          )}

        </div>
      </section>

      {/* REMINDER MODAL */}
      {reminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-[92vw] sm:w-full max-w-md rounded-2xl bg-white dark:bg-dark-card p-5 sm:p-6 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4">Send Task Reminder</h3>

            <select
              value={reminderDept}
              onChange={e => { setReminderDept(e.target.value); setReminderEmail(''); }}
              className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
            >
              <option value="">Select Department</option>
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="operations">Operations</option>
            </select>

            <select
              disabled={!reminderDept}
              value={reminderEmail}
              onChange={e => setReminderEmail(e.target.value)}
              className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
            >
              <option value="">Select Team Member</option>
              {(reminderDept ? members.filter(m => normalize(m.department) === normalize(reminderDept)) : members)
                .map(m => <option key={m.email} value={m.email}>{m.name}</option>)}
            </select>

            <select
              disabled={!memberTasks.length}
              value={selectedTaskId}
              onChange={e => setSelectedTaskId(e.target.value)}
              className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
            >
              <option value="">Select Task</option>
              {memberTasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>

            <select
              value={reminderStatus}
              onChange={e => setReminderStatus(e.target.value)}
              disabled={!selectedTaskId}
              className="w-full mb-3 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
            >
              <option value="">Update Task Status (optional)</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
              <option value="on-hold">On Hold</option>
            </select>

            <textarea
              value={reminderMessage}
              onChange={e => setReminderMessage(e.target.value)}
              placeholder="Write a short reminder message…"
              rows={4}
              className="w-full rounded-lg border px-3 py-2 mb-4 bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-mint-accent"
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setReminderOpen(false)}>Cancel</Button>
              <Button
                disabled={!reminderEmail || !reminderMessage || sendingReminder}
                onClick={async () => {
                  setSendingReminder(true);
                  try {
                    await Promise.all([
                      selectedTaskId && reminderStatus
                        ? fetch(`${API}/api/manager/update-task-status`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                            body: JSON.stringify({ taskId: selectedTaskId, status: reminderStatus, assignedToEmail: reminderEmail }),
                          })
                        : Promise.resolve(),
                      fetch(`${API}/api/announcements`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                        body: JSON.stringify({
                          title: 'Task Reminder', content: reminderMessage, category: 'Task',
                          recipients: 'specific', tagged_emails: [reminderEmail],
                          related_task_id: selectedTaskId || null,
                          created_by: user?.email, created_by_name: user?.name,
                        }),
                      }),
                    ]);
                    // Re-fetch from page 1 to reflect any status change
                    fetchTasks(1, true);
                  } finally {
                    setSendingReminder(false);
                    setReminderOpen(false);
                    setReminderDept(''); setReminderEmail(''); setSelectedTaskId('');
                    setReminderStatus(''); setReminderMessage('');
                  }
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