// import { useEffect, useState } from 'react';
// import { Button } from '../../components/ui/button';
// import { Check } from 'lucide-react';

// type Assignment = {
//   email: string;
//   name: string;
//   role_id: string | null;
//   department_id: string | null;
// };

// type Role = {
//   id: string;
//   name: string;
// };

// type Department = {
//   id: string;
//   name: string;
// };

// export default function AdminAssignments() {
//   const [users, setUsers] = useState<Assignment[]>([]);
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [savingEmail, setSavingEmail] = useState<string | null>(null);
//   const [savedEmail, setSavedEmail] = useState<string | null>(null);

//   useEffect(() => {
//     loadAll();
//   }, []);

//   const loadAll = async () => {
//   try {
//     const token = localStorage.getItem('token');

//     const [u, r, d] = await Promise.all([
//       fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/assignments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       }).then(res => res.ok ? res.json() : []),

//       fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/roles`, {
//         headers: { Authorization: `Bearer ${token}` },
//       }).then(res => res.ok ? res.json() : []),

//       fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/departments`, {
//         headers: { Authorization: `Bearer ${token}` },
//       }).then(res => res.ok ? res.json() : []),
//     ]);

//     setUsers(Array.isArray(u) ? u : []);
//     setRoles(Array.isArray(r) ? r : []);
//     setDepartments(Array.isArray(d) ? d : []);
//   } catch (err) {
//     console.error(err);
//   }
// };


//   const getRoleName = (roleId: string | null) => {
//     if (!roleId) return 'Member';
//     return roles.find(r => r.id === roleId)?.name || 'Member';
//   };

//   const getDepartmentName = (deptId: string | null) => {
//     if (!deptId) return 'General';
//     return departments.find(d => d.id === deptId)?.name || 'General';
//   };

//   const updateAssignment = async (user: Assignment) => {
//     setSavingEmail(user.email);

//     await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/assignments`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify({
//         email: user.email,
//         role_id: user.role_id,
//         department_id: user.department_id,
//       }),
//     });

//     setSavingEmail(null);
//     setSavedEmail(user.email);

//     setTimeout(() => setSavedEmail(null), 1500);
//   };

//   return (
//     <div>
//       <h2 className="font-display mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">Assignments</h2>

//       <div className="space-y-4">
//         {users.map(user => (
//           <div
//             key={user.email}
//             className="rounded-xl border bg-white dark:bg-dark-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
//           >
//             {/* USER INFO */}
//             <div className="flex-1">
//               <div className="font-medium text-heading-dark dark:text-dark-text">{user.name}</div>
//               <div className="text-xs text-muted-text dark:text-white/60">{user.email}</div>
//               <div className="text-xs mt-1 text-muted-text dark:text-white/50">
//                 Current: {getRoleName(user.role_id)} • {getDepartmentName(user.department_id)}
//               </div>
//             </div>

//             {/* ROLE */}
//             <select
//               value={user.role_id || ''}
//               onChange={e =>
//                 setUsers(prev =>
//                   prev.map(u =>
//                     u.email === user.email
//                       ? { ...u, role_id: e.target.value || null }
//                       : u
//                   )
//                 )
//               }
//               className="rounded-lg border px-3 py-2
//            bg-white text-heading-dark
//            dark:bg-dark-bg dark:text-dark-text
//            dark:border-white/10"
//             >
//               <option value="">Member</option>
//               {roles.map(r => (
//                 <option key={r.id} value={r.id}>
//                   {r.name}
//                 </option>
//               ))}
//             </select>

//             {/* DEPARTMENT */}
//             <select
//               value={user.department_id || ''}
//               onChange={e =>
//                 setUsers(prev =>
//                   prev.map(u =>
//                     u.email === user.email
//                       ? { ...u, department_id: e.target.value || null }
//                       : u
//                   )
//                 )
//               }
//               className="rounded-lg border px-3 py-2
//            bg-white text-heading-dark
//            dark:bg-dark-bg dark:text-dark-text
//            dark:border-white/10"
//             >
//               <option value="">General</option>
//               {departments.map(d => (
//                 <option key={d.id} value={d.id}>
//                   {d.name}
//                 </option>
//               ))}
//             </select>

//             {/* SAVE */}
//             <Button
//               disabled={savingEmail === user.email}
//               onClick={() => updateAssignment(user)}
//               className="min-w-[90px]"
//             >
//               {savingEmail === user.email
//                 ? 'Saving...'
//                 : savedEmail === user.email
//                 ? (
//                   <>
//                     <Check className="h-4 w-4 mr-1" />
//                     Saved
//                   </>
//                 )
//                 : 'Save'}
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Check } from 'lucide-react';

type Assignment = { email: string; name: string; role_id: string | null; department_id: string | null };
type Role = { id: string; name: string };
type Department = { id: string; name: string };

const API = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem('token') || '';

interface Props {
  roles: Role[];
  departments: Department[];
}

export default function AdminAssignments({ roles, departments }: Props) {
  const [users, setUsers]           = useState<Assignment[]>([]);
  const [loading, setLoading]       = useState(true);
  const [savingEmail, setSavingEmail] = useState<string | null>(null);
  const [savedEmail, setSavedEmail]   = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/api/admin/assignments`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.ok ? r.json() : [])
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const getRoleName = (id: string | null) => id ? (roles.find(r => r.id === id)?.name || 'Member') : 'Member';
  const getDeptName = (id: string | null) => id ? (departments.find(d => d.id === id)?.name || 'General') : 'General';

  const updateAssignment = async (user: Assignment) => {
    setSavingEmail(user.email);
    await fetch(`${API}/api/admin/assignments`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ email: user.email, role_id: user.role_id, department_id: user.department_id }),
    });
    setSavingEmail(null);
    setSavedEmail(user.email);
    setTimeout(() => setSavedEmail(null), 1500);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-10">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-mint-accent border-t-transparent" />
      <span className="ml-2 text-muted-text">Loading assignments...</span>
    </div>
  );

  return (
    <div>
      <h2 className="font-display mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">Assignments</h2>
      <div className="space-y-4">
        {users.map(user => (
          <div key={user.email}
            className="rounded-xl border bg-white dark:bg-dark-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="font-medium text-heading-dark dark:text-dark-text">{user.name}</div>
              <div className="text-xs text-muted-text dark:text-white/60">{user.email}</div>
              <div className="text-xs mt-1 text-muted-text dark:text-white/50">
                Current: {getRoleName(user.role_id)} • {getDeptName(user.department_id)}
              </div>
            </div>
            <select value={user.role_id || ''}
              onChange={e => setUsers(prev => prev.map(u => u.email === user.email ? { ...u, role_id: e.target.value || null } : u))}
              className="rounded-lg border px-3 py-2 bg-white text-heading-dark dark:bg-dark-bg dark:text-dark-text dark:border-white/10">
              <option value="">Member</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select value={user.department_id || ''}
              onChange={e => setUsers(prev => prev.map(u => u.email === user.email ? { ...u, department_id: e.target.value || null } : u))}
              className="rounded-lg border px-3 py-2 bg-white text-heading-dark dark:bg-dark-bg dark:text-dark-text dark:border-white/10">
              <option value="">General</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <Button disabled={savingEmail === user.email} onClick={() => updateAssignment(user)} className="min-w-[90px]">
              {savingEmail === user.email ? 'Saving...' : savedEmail === user.email ? <><Check className="h-4 w-4 mr-1" />Saved</> : 'Save'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}