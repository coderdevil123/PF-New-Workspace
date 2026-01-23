// import { useEffect, useState } from 'react';
// import { Trash2, Megaphone } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// type ManagerTask = {
//   id: string;
//   title: string;
//   description?: string;
//   status: 'pending' | 'completed' | 'wrong' | null;
//   created_at?: string;
//   assigned_to_email: string;
//   issue_reported?: boolean;
// };

// const STATUS_BADGE = {
//   pending: 'bg-blue-100 text-blue-700',
//   completed: 'bg-green-100 text-green-700',
//   wrong: 'bg-red-100 text-red-700',
// };

// const DUMMY_MANAGER_TASKS: ManagerTask[] = [
//   {
//     id: '1',
//     title: 'Prepare weekly security report',
//     description: 'Based on last team meeting',
//     status: 'wrong',
//     created_at: '2026-01-29T10:45:00Z',
//     assigned_to_email: 'user1@pristineforests.com',
//     issue_reported: true,
//   },
//   {
//     id: '2',
//     title: 'Review RBAC permissions',
//     status: 'pending',
//     created_at: '2026-01-29T11:10:00Z',
//     assigned_to_email: 'user2@pristineforests.com',
//     issue_reported: false,
//   },
// ];

// export default function ManagerTasks() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [tasks, setTasks] = useState<ManagerTask[]>([]);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'wrong'>('all');

//   // 🔐 RBAC Guard
//   useEffect(() => {
//     if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
//       navigate('/workspace');
//     }
//   }, [user, navigate]);

//   useEffect(() => {
//     setTasks(DUMMY_MANAGER_TASKS);
//     document.title = 'Manager Task Review | Pristine Forests';
//   }, []);

//   const filteredTasks = tasks.filter(task => {
//     if (
//       search &&
//       !task.assigned_to_email.toLowerCase().includes(search.toLowerCase()) &&
//       !task.title.toLowerCase().includes(search.toLowerCase())
//     ) {
//       return false;
//     }
//     if (statusFilter !== 'all' && task.status !== statusFilter) {
//       return false;
//     }
//     return true;
//   });

//   const deleteTask = (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this task?')) return;
//     setTasks(prev => prev.filter(t => t.id !== id));
//   };

//   const sendMessage = (email: string, taskTitle: string) => {
//     navigate('/announcements', {
//       state: {
//         prefillEmail: email,
//         prefillMessage: `Regarding task: ${taskTitle}`,
//       },
//     });
//   };

//   if (!user) return null;

//   return (
//     <div className="min-h-full px-6 py-8 lg:px-12 bg-white dark:bg-dark-bg">
//       <div className="mx-auto max-w-6xl">
//         <h1 className="mb-6 text-3xl font-display text-gray-900 dark:text-white">
//           Manager Task Review
//         </h1>

//         {/* Filters */}
//         <div className="mb-6 flex flex-wrap gap-4">
//           <input
//             type="text"
//             placeholder="Search by user or task..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             className="w-64 rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg
//                        text-gray-900 dark:text-white"
//           />

//           <select
//             value={statusFilter}
//             onChange={e => setStatusFilter(e.target.value as any)}
//             className="rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg
//                        text-gray-900 dark:text-white"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="wrong">Wrong</option>
//           </select>
//         </div>

//         {/* Task Table */}
//         <div className="overflow-x-auto rounded-xl border">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100 dark:bg-dark-card">
//               <tr>
//                 <th className="p-3 text-left">Task</th>
//                 <th className="p-3 text-left">User</th>
//                 <th className="p-3 text-left">Status</th>
//                 <th className="p-3 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTasks.map(task => (
//                 <tr key={task.id} className="border-t">
//                   <td className="p-3">
//                     <div className="font-medium">{task.title}</div>
//                     {task.description && (
//                       <div className="text-xs text-muted-text">
//                         {task.description}
//                       </div>
//                     )}
//                   </td>
//                   <td className="p-3">{task.assigned_to_email}</td>
//                   <td className="p-3">
//                     {task.status && (
//                       <span className={`rounded-full px-3 py-1 text-xs ${STATUS_BADGE[task.status]}`}>
//                         {task.status.toUpperCase()}
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-3 flex gap-3">
//                     {task.status === 'wrong' && (
//                       <button
//                         onClick={() => deleteTask(task.id)}
//                         className="text-red-600 hover:underline flex items-center gap-1"
//                       >
//                         <Trash2 className="h-4 w-4" /> Delete
//                       </button>
//                     )}
//                     <button
//                       onClick={() => sendMessage(task.assigned_to_email, task.title)}
//                       className="text-mint-accent hover:underline flex items-center gap-1"
//                     >
//                       <Megaphone className="h-4 w-4" /> Message
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//               {filteredTasks.length === 0 && (
//                 <tr>
//                   <td colSpan={4} className="p-6 text-center text-muted-text">
//                     No tasks found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
