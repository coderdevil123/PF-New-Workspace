// import { useEffect } from 'react';
// import { ArrowLeft, Shield } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '../components/ui/button';
// import { useAuth } from '../contexts/AuthContext';
// import AdminRoles from '../components/admin/AdminRoles';
// import AdminAssignments from '../components/admin/AdminAssignments';

// export default function AdminPage() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     // if (!user?.isAdmin) navigate('/workspace');
//     if (!user) navigate('/login');
//     document.title = 'Admin Console | Pristine Forests';
//   }, [user, navigate]);

//   // if (!user?.isAdmin) return null;
//   if (!user) return null;

//   return (
//     <div className="min-h-full bg-white dark:bg-dark-bg">
      
//       {/* HEADER */}
//       <section className="relative overflow-hidden bg-forest-gradient px-6 py-8 lg:px-12">
//         <div className="relative mx-auto max-w-5xl flex items-center gap-4">

//           <Button
//             onClick={() => navigate('/workspace')}
//             variant="ghost"
//             className="rounded-lg text-white/90 hover:bg-white/10"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>

//           <div className="flex items-center gap-4">
//             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg">
//               <Shield className="h-7 w-7 text-white" />
//             </div>

//             <div>
//               <h1 className="font-display text-4xl font-normal text-white">
//                 Admin Console
//               </h1>
//               <p className="font-sans text-lg text-white/80">
//                 Manage roles, departments & access
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CONTENT */}
//       <section className="px-6 py-12 lg:px-12">
//         <div className="mx-auto max-w-5xl space-y-14">

//           {/* ROLES */}
//           <AdminRoles />

//           {/* ASSIGNMENTS */}
//           <AdminAssignments />

//         </div>
//       </section>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import AdminRoles from '../components/admin/AdminRoles';
import AdminAssignments from '../components/admin/AdminAssignments';

type Role = { id: string; name: string; description?: string };
type Department = { id: string; name: string };

const API = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem('token') || '';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roles, setRoles]             = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    document.title = 'Admin Console | Pristine Forests';

    // Fetch roles + departments ONCE here, pass down as props
    Promise.all([
      fetch(`${API}/api/admin/roles`,       { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
      fetch(`${API}/api/admin/departments`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
    ]).then(([r, d]) => {
      setRoles(Array.isArray(r) ? r : []);
      setDepartments(Array.isArray(d) ? d : []);
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-full bg-white dark:bg-dark-bg">
      <section className="relative overflow-hidden bg-forest-gradient px-6 py-8 lg:px-12">
        <div className="relative mx-auto max-w-5xl flex items-center gap-4">
          <Button onClick={() => navigate('/workspace')} variant="ghost"
            className="rounded-lg text-white/90 hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-accent shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-normal text-white">Admin Console</h1>
              <p className="font-sans text-lg text-white/80">Manage roles, departments & access</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-5xl space-y-14">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-mint-accent border-t-transparent" />
              <span className="ml-3 text-muted-text">Loading...</span>
            </div>
          ) : (
            <>
              <AdminRoles
                roles={roles}
                departments={departments}
                onRolesChange={setRoles}
                onDepartmentsChange={setDepartments}
              />
              <AdminAssignments roles={roles} departments={departments} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}