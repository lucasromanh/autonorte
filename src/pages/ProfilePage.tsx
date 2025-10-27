import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getDisplayName } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authService } from '@/services/authService';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{ username?: string; email?: string }>({
    username: undefined,
    email: undefined,
  });
  const [error, setError] = useState('');

  if (!user) return null;

  // Inicializar formData cuando user esté disponible
  useEffect(() => {
    if (user) {
      setFormData({
        username: (user.username || user.nombre) as string | undefined,
        email: user.email,
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      username: (user.username || user.nombre) as string | undefined,
      email: user.email,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.updateProfile(user.id, formData);
      if (response.success && response.user) {
        // Actualizar el contexto de autenticación
        updateUser(response.user);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Mi Perfil</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nombre de usuario
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleCancel} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de usuario
                </label>
                <p className="text-lg text-gray-900 dark:text-white font-medium">{getDisplayName(user)}</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <p className="text-lg text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Rol
                </label>
                <p className="text-lg text-gray-900 dark:text-white font-medium capitalize">{user.role}</p>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <Button onClick={handleEdit} className="flex-1">
                ✏️ Editar Perfil
              </Button>
              <Button variant="secondary" className="flex-1">
                🔒 Cambiar Contraseña
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;