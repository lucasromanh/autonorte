import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { unreadCount } = useMessages();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-4">
          <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700">
            ✕
          </button>
          <nav className="mt-8 space-y-4">
            <Link to="/" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600" onClick={onClose}>
              Inicio
            </Link>
            <Link to="/explore" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600" onClick={onClose}>
              Explorar
            </Link>
            {user && (
              <>
                <Link to="/my-cars" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600" onClick={onClose}>
                  Mis Autos
                </Link>
                <Link to="/profile" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600" onClick={onClose}>
                  Perfil
                </Link>
                <Link to="/messages" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 relative" onClick={onClose}>
                  Mensajes
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600" onClick={onClose}>
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;