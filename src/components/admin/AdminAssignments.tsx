import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Check } from 'lucide-react';

type Assignment = {
  email: string;
  name: string;
  role_id: string | null;
  department_id: string | null;
};

type Role = {
  id: string;
  name: string;
};

type Department = {
  id: string;
  name: string;
};

export default function AdminAssignments() {
  const [users, setUsers] = useState<Assignment[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [savingEmail, setSavingEmail] = useState<string | null>(null);
  const [savedEmail, setSavedEmail] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
  const token = localStorage.getItem('token');

  try {
    const [uRes, rRes, dRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const u = await uRes.json();
    const r = await rRes.json();
    const d = await dRes.json();

    setUsers(Array.isArray(u) ? u : []);
    setRoles(Array.isArray(r) ? r : []);
    setDepartments(Array.isArray(d) ? d : []);
  } catch (err) {
    console.error('Admin load failed', err);
    setUsers([]);
    setRoles([]);
    setDepartments([]);
  }
};


  const getRoleName = (roleId: string | null) => {
    if (!roleId) return 'Member';
    return roles.find(r => r.id === roleId)?.name || 'Member';
  };

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return 'General';
    return departments.find(d => d.id === deptId)?.name || 'General';
  };

  const updateAssignment = async (user: Assignment) => {
    setSavingEmail(user.email);

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/assignments`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        email: user.email,
        role_id: user.role_id,
        department_id: user.department_id,
      }),
    });

    setSavingEmail(null);
    setSavedEmail(user.email);

    setTimeout(() => setSavedEmail(null), 1500);
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Assignments</h2>

      <div className="space-y-4">
        {users.map(user => (
          <div
            key={user.email}
            className="rounded-xl border bg-white dark:bg-dark-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
          >
            {/* USER INFO */}
            <div className="flex-1">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-text">{user.email}</div>
              <div className="text-xs mt-1 text-muted-text">
                Current: {getRoleName(user.role_id)} • {getDepartmentName(user.department_id)}
              </div>
            </div>

            {/* ROLE */}
            <select
              value={user.role_id || ''}
              onChange={e =>
                setUsers(prev =>
                  prev.map(u =>
                    u.email === user.email
                      ? { ...u, role_id: e.target.value || null }
                      : u
                  )
                )
              }
              className="rounded-lg border px-3 py-2 bg-transparent"
            >
              <option value="">Member</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* DEPARTMENT */}
            <select
              value={user.department_id || ''}
              onChange={e =>
                setUsers(prev =>
                  prev.map(u =>
                    u.email === user.email
                      ? { ...u, department_id: e.target.value || null }
                      : u
                  )
                )
              }
              className="rounded-lg border px-3 py-2 bg-transparent"
            >
              <option value="">General</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            {/* SAVE */}
            <Button
              disabled={savingEmail === user.email}
              onClick={() => updateAssignment(user)}
              className="min-w-[90px]"
            >
              {savingEmail === user.email
                ? 'Saving...'
                : savedEmail === user.email
                ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Saved
                  </>
                )
                : 'Save'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
