import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { adminService } from '@/services/adminService';
import { getDisplayName, formatDate } from '@/utils/helpers';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  blocked?: number | boolean;
  flagged?: number | boolean;
  flag_reason?: string | null;
  phone?: string | null;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      let userList: any = await adminService.getAllUsers();
      // Normalizar respuestas que no sean arrays
      if (!Array.isArray(userList)) {
        if (userList && Array.isArray(userList.users)) userList = userList.users;
        else if (userList && Array.isArray(userList.data)) userList = userList.data;
        else if (userList && Array.isArray(userList.payload)) userList = userList.payload;
        else userList = [];
      }

      // Mapear campos comunes del backend a la interfaz esperada
      const normalized: User[] = (userList || []).map((u: any) => ({
        id: Number(u.id),
        username: u.username || u.nombre || u.name || (u.user && (u.user.username || u.user.nombre)) || `usuario-${u.id}`,
        email: u.email || u.correo || (u.user && u.user.email) || '',
        role: String(u.role || u.rol || '').toLowerCase(),
        created_at: u.created_at || u.createdAt || ''
        , blocked: u.blocked || u.blocked === 1 || false
        , flagged: u.flagged || u.flagged === 1 || false
        , flag_reason: u.flag_reason || u.flagReason || u.flagReason || null
        , phone: u.phone || null
      }));

      setUsers(normalized);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleBlockUser = async (id: number) => {
    if (!window.confirm('¿Bloquear a este usuario?')) return;
    try {
      const res = await adminService.blockUser(id);
      if (res && (res.ok || res.success || res.blocked === 1)) {
        await loadUsers();
      } else {
        console.error('Block failed', res);
        alert('No se pudo bloquear el usuario');
      }
    } catch (err) {
      console.error('Error blocking user:', err);
      alert('Error al bloquear usuario');
    }
  };

  const handleUnblockUser = async (id: number) => {
    if (!window.confirm('¿Desbloquear a este usuario?')) return;
    try {
      const res = await adminService.unblockUser(id);
      if (res && (res.ok || res.success || res.blocked === 0)) {
        await loadUsers();
      } else {
        console.error('Unblock failed', res);
        alert('No se pudo desbloquear el usuario');
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
      alert('Error al desbloquear usuario');
    }
  };

  const handleFlagUser = async (id: number) => {
    const reason = window.prompt('Motivo para señalar al usuario (opcional):');
    if (reason === null) return; // cancel
    try {
      const res = await adminService.flagUser(id, reason || '');
      if (res && (res.ok || res.success || res.flagged === 1)) {
        await loadUsers();
      } else {
        console.error('Flag failed', res);
        alert('No se pudo señalar al usuario');
      }
    } catch (err) {
      console.error('Error flagging user:', err);
      alert('Error al señalar usuario');
    }
  };

  const handleUnflagUser = async (id: number) => {
    if (!window.confirm('Quitar señalización de este usuario?')) return;
    try {
      const res = await adminService.unflagUser(id);
      if (res && (res.ok || res.success || res.flagged === 0)) {
        await loadUsers();
      } else {
        console.error('Unflag failed', res);
        alert('No se pudo quitar la señalización');
      }
    } catch (err) {
      console.error('Error unflagging user:', err);
      alert('Error al quitar la señalización');
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* Mobile: render cards */}
        <div className="sm:hidden p-4 space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-white dark:bg-gray-800 border rounded-md p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{getDisplayName(u)}</div>
                  {u.created_at && <div className="text-xs text-gray-500 dark:text-gray-400">Miembro desde {formatDate(u.created_at)}</div>}
                  <div className="text-sm text-gray-500 dark:text-gray-300">{u.email}</div>
                </div>
                <div className="text-right">
                  <div className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{u.role}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => handleDeleteUser(u.id)} variant="danger" size="sm">Eliminar</Button>
                {!u.blocked ? (
                  <Button onClick={() => handleBlockUser(u.id)} variant="danger" size="sm">Bloquear</Button>
                ) : (
                  <Button onClick={() => handleUnblockUser(u.id)} variant="secondary" size="sm">Desbloquear</Button>
                )}
                {u.flagged ? (
                  <Button onClick={() => handleUnflagUser(u.id)} variant="secondary" size="sm">Quitar Señal.</Button>
                ) : (
                  <Button onClick={() => handleFlagUser(u.id)} variant="secondary" size="sm">Señalar</Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Desktop / Tablet: table */}
        <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-normal sm:whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{getDisplayName(user)}</div>
                  {user.created_at && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">Miembro desde {formatDate(user.created_at)}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-normal sm:whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-normal sm:whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {user.role}
                    </span>
                    {user.blocked ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">Bloqueado</span>
                    ) : null}
                    {user.flagged ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Señalado</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-normal sm:whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 gap-2">
                    <Button onClick={() => handleDeleteUser(user.id)} variant="danger" size="sm">Eliminar</Button>
                    {!user.blocked ? (
                      <Button onClick={() => handleBlockUser(user.id)} variant="danger" size="sm">Bloquear</Button>
                    ) : (
                      <Button onClick={() => handleUnblockUser(user.id)} variant="secondary" size="sm">Desbloquear</Button>
                    )}
                    {user.flagged ? (
                      <Button onClick={() => handleUnflagUser(user.id)} variant="secondary" size="sm">Quitar Señal.</Button>
                    ) : (
                      <Button onClick={() => handleFlagUser(user.id)} variant="secondary" size="sm">Señalar</Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;