import { useEffect, useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Button } from '../../components/ui/button';

type Role = {
  id: string;
  name: string;
};

export default function AdminRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState('');

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
      body: JSON.stringify({ name: newRole }),
    });

    setNewRole('');
    fetchRoles();
  };

  const deleteRole = async (id: string) => {
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
      <h2 className="font-display text-2xl mb-4">Roles</h2>

      <div className="rounded-xl border bg-white dark:bg-dark-card p-6 space-y-4">

        <div className="flex gap-3">
          <input
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            placeholder="New role name"
            className="flex-1 rounded-lg border px-3 py-2"
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
              className="flex items-center gap-2 rounded-full border px-3 py-1"
            >
              {role.name}
              <button onClick={() => deleteRole(role.id)}>
                <Trash className="h-3 w-3 text-red-500" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
