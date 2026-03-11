import { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogTitle } from "../../components/ui/dialog";

type Role = { id: string; name: string; description?: string; position: number };
type Department = { id: string; name: string };

const API = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem('token') || '';

interface Props {
  roles: Role[];
  departments: Department[];
  onRolesChange: (roles: Role[]) => void;
  onDepartmentsChange: (depts: Department[]) => void;
}

export default function AdminRoles({ roles, departments, onRolesChange, onDepartmentsChange }: Props) {
  const [newRole, setNewRole]           = useState('');
  const [newRoleDesc, setNewRoleDesc]   = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newRolePosition, setNewRolePosition] = useState(999);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const createRole = async () => {
    if (roles.some(r => r.position === newRolePosition)) {
      alert("This rank is already assigned to another role");
      return;
    }
    if (!newRole.trim()) return;
    await fetch(`${API}/api/admin/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ name: newRole, description: newRoleDesc, position: newRolePosition }),
    });
    const data = await fetch(`${API}/api/admin/roles`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json());
    onRolesChange(Array.isArray(data) ? data : []);
    setNewRole(''); setNewRoleDesc(''); setNewRolePosition(999);
  };

  const deleteRole = async (id: string) => {
    if (!confirm('Deleting this role may affect assigned users. Continue?')) return;
    await fetch(`${API}/api/admin/roles/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
    onRolesChange(roles.filter(r => r.id !== id));
  };

  const updateRole = async () => {
    if (!editingRole) return;

    if (roles.some(r => r.id !== editingRole.id && r.position === editingRole.position)) {
      alert("This rank is already assigned to another role");
      return;
    }

    await fetch(`${API}/api/admin/roles/${editingRole.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        name: editingRole.name,
        description: editingRole.description,
        position: editingRole.position
      })
    });

    const data = await fetch(`${API}/api/admin/roles`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json());

    onRolesChange(Array.isArray(data) ? data : []);
    setEditingRole(null);
  };

  const createDepartment = async () => {
    if (!newDepartment.trim()) return;
    await fetch(`${API}/api/admin/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ name: newDepartment }),
    });
    const data = await fetch(`${API}/api/admin/departments`, { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json());
    onDepartmentsChange(Array.isArray(data) ? data : []);
    setNewDepartment('');
  };

  const deleteDepartment = async (id: string) => {
    if (!confirm('Delete this department?')) return;
    await fetch(`${API}/api/admin/departments/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });
    onDepartmentsChange(departments.filter(d => d.id !== id));
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
  };

  return (
    <div>
      <h2 className="font-display mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">Roles</h2>
      <div className="rounded-xl border bg-white dark:bg-dark-card p-6 space-y-4">
        <div className="flex gap-3">
          <input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="New role name"
            className="flex-1 rounded-lg border px-3 py-2 bg-white text-heading-dark dark:bg-dark-bg dark:text-dark-text dark:border-white/10" />
          <input value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} placeholder="Role description"
            className="flex-1 rounded-lg border px-3 py-2 bg-white text-heading-dark dark:bg-dark-bg dark:text-dark-text dark:border-white/10" />
          <input
            type="number"
            value={newRolePosition}
            onChange={e => setNewRolePosition(Number(e.target.value))}
            placeholder="Ranking"
            className="w-32 rounded-lg border px-3 py-2 bg-white text-heading-dark dark:bg-dark-bg dark:text-dark-text dark:border-white/10"
          />
          <Button onClick={createRole}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {roles.map(role => (
            <div key={role.id} className="rounded-xl border px-4 py-2 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="font-medium text-heading-dark dark:text-dark-text">{role.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => openEditRole(role)}>
                    ✏️
                  </button>

                  <button onClick={() => deleteRole(role.id)}>
                    <Trash className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>
              {role.description && <div className="text-xs text-muted-text dark:text-white/60 mt-1">{role.description}</div>}
              <div className="text-xs text-muted-text dark:text-white/60 mt-1">
                Ranking: {role.position}
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="font-display mt-12 mb-8 text-2xl sm:text-3xl font-normal text-heading-dark dark:text-dark-text">Departments</h2>
      <div className="rounded-xl border bg-white dark:bg-dark-card p-6 space-y-4">
        <div className="flex gap-3">
          <input value={newDepartment} onChange={e => setNewDepartment(e.target.value)} placeholder="New department name"
            className="flex-1 rounded-lg border px-3 py-2 bg-white text-heading-dark dark:bg-dark-bg dark:text-dark-text dark:border-white/10" />
          <Button onClick={createDepartment}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {departments.map(dept => (
            <div key={dept.id} className="rounded-xl border px-4 py-2 flex items-center gap-3">
              <span className="font-medium text-heading-dark dark:text-dark-text">{dept.name}</span>
              <button onClick={() => deleteDepartment(dept.id)}><Trash className="h-3 w-3 text-red-500" /></button>
            </div>
          ))}
        </div>
      </div>
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="
          max-w-lg rounded-2xl
          bg-white dark:bg-dark-card
          border border-border dark:border-dark-border
          text-heading-dark dark:text-dark-text
          space-y-5
        ">
          <DialogTitle className="font-display text-xl">
            Edit Role
          </DialogTitle>

          {editingRole && (
            <>
              <input
                value={editingRole.name}
                onChange={e =>
                  setEditingRole({ ...editingRole, name: e.target.value })
                }
                placeholder="Role Name"
                className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg dark:border-white/10"
              />

              <input
                value={editingRole.description || ""}
                onChange={e =>
                  setEditingRole({ ...editingRole, description: e.target.value })
                }
                placeholder="Description"
                className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg dark:border-white/10"
              />

              <input
                type="number"
                value={editingRole.position}
                onChange={e =>
                  setEditingRole({ ...editingRole, position: Number(e.target.value) })
                }
                placeholder="Ranking"
                className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-dark-bg dark:border-white/10"
              />

              <div className="flex justify-end gap-3 pt-3">
                <Button variant="outline" onClick={() => setEditingRole(null)}>
                  Cancel
                </Button>

                <Button
                  onClick={updateRole}
                  className="bg-mint-accent text-forest-dark hover:bg-mint-accent/90"
                >
                  Save Changes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}