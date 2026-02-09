import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';

type Assignment = {
  email: string;
  name: string;
  role_id: string | null;
  department_id: string | null;
};

export default function AdminAssignments() {
  const [users, setUsers] = useState<Assignment[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const token = localStorage.getItem('token');

    const [u, r, d] = await Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
    ]);

    setUsers(u);
    setRoles(r);
    setDepartments(d);
  };

  const updateAssignment = async (user: Assignment) => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/assignments`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(user),
    });
  };

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Assignments</h2>

      <div className="space-y-4">
        {users.map(user => (
          <div
            key={user.email}
            className="rounded-xl border bg-white dark:bg-dark-card p-5 flex gap-4 items-center"
          >
            <div className="flex-1">
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-text">{user.email}</div>
            </div>

            <select
              value={user.role_id || ''}
              onChange={e =>
                setUsers(prev =>
                  prev.map(u =>
                    u.email === user.email
                      ? { ...u, role_id: e.target.value }
                      : u
                  )
                )
              }
              className="rounded-lg border px-2 py-1"
            >
              <option value="">No role</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              value={user.department_id || ''}
              onChange={e =>
                setUsers(prev =>
                  prev.map(u =>
                    u.email === user.email
                      ? { ...u, department_id: e.target.value }
                      : u
                  )
                )
              }
              className="rounded-lg border px-2 py-1"
            >
              <option value="">No department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <Button onClick={() => updateAssignment(user)}>
              Save
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
