import { useEffect, useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Button } from '../../components/ui/button';

type Role = {
  id: string;
  name: string;
  description?: string;
};

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/roles`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    setRoles(await res.json());
  };

  const createRole = async () => {
    if (!newRole.trim()) return;

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: newRole,
        description: newRoleDesc,
      }),
    });

    setNewRole('');
    setNewRoleDesc('');
    fetchRoles();
  };

  const deleteRole = async (id: string) => {
    const ok = confirm(
      'Deleting this role may affect assigned users. Continue?'
    );
    if (!ok) return;
    await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/roles/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }
    );

    fetchRoles();
  };

  return (
    <div>
      <h2 className="font-display mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">Roles</h2>

      <div className="rounded-xl border bg-white dark:bg-dark-card p-6 space-y-4">

        <div className="flex gap-3">
          <input
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            placeholder="New role name"
            className="flex-1 rounded-lg border px-3 py-2
           bg-white text-heading-dark
           dark:bg-dark-bg dark:text-dark-text
           dark:border-white/10"
          />
          <input
            value={newRoleDesc}
            onChange={e => setNewRoleDesc(e.target.value)}
            placeholder="Role description"
            className="flex-1 rounded-lg border px-3 py-2
           bg-white text-heading-dark
           dark:bg-dark-bg dark:text-dark-text
           dark:border-white/10"
          />
          <Button onClick={createRole}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {roles.map(role => (
            <div
              key={role.id}
              className="rounded-xl border px-4 py-2 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-heading-dark dark:text-dark-text">{role.name}</span>
                <button onClick={() => deleteRole(role.id)}>
                  <Trash className="h-3 w-3 text-red-500" />
                </button>
              </div>

              {role.description && (
                <div className="text-xs text-muted-text dark:text-white/60 mt-1">
                  {role.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
