import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { getDisplayName } from '@/utils/helpers';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useMessages();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            AutoNorte
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Inicio
            </Link>
            <Link to="/explore" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Explorar
            </Link>
            {user && (
              <>
                <Link to="/my-cars" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Mis Autos
                </Link>
                <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Perfil
                </Link>
                <Link to="/messages" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium relative">
                  💬 Mensajes
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {user.role && String(user.role).toLowerCase() === 'admin' && (
                  <Link to="/admin" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Actions (theme toggle removed) */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-200 text-sm font-medium">Hola, {getDisplayName(user)}</span>
                <Button onClick={handleLogout} variant="secondary" size="sm">
                  Salir
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="secondary" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile quick navigation: fixed compact options instead of a hamburger menu */}
          <div className="flex md:hidden items-center space-x-2 overflow-x-auto">
            <Link to="/" title="Inicio" className="flex flex-col items-center text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm" aria-label="Inicio">
              <span className="text-lg">🏠</span>
              <span className="text-xs mt-1">Inicio</span>
            </Link>
            <Link to="/explore" title="Explorar" className="flex flex-col items-center text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm" aria-label="Explorar">
              <span className="text-lg">🔍</span>
              <span className="text-xs mt-1">Explorar</span>
            </Link>
            {user ? (
              <>
                <Link to="/my-cars" title="Mis Autos" className="flex flex-col items-center text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm" aria-label="Mis Autos">
                  <span className="text-lg">🚗</span>
                  <span className="text-xs mt-1">Mis Autos</span>
                </Link>
                <Link to="/profile" title="Perfil" className="flex flex-col items-center text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm" aria-label="Perfil">
                  <span className="text-lg">👤</span>
                  <span className="text-xs mt-1">Perfil</span>
                </Link>
                <Link to="/messages" title="Mensajes" className="relative flex flex-col items-center text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm" aria-label="Mensajes">
                  <span className="text-lg">💬</span>
                  <span className="text-xs mt-1">Mensajes</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {user.role && String(user.role).toLowerCase() === 'admin' && (
                  <Link to="/admin" title="Admin" className="flex flex-col items-center text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm" aria-label="Admin">
                    <span className="text-lg">⚙️</span>
                    <span className="text-xs mt-1">Admin</span>
                  </Link>
                )}
                <button onClick={handleLogout} title="Salir" className="ml-2 px-3 py-2 rounded-md bg-blue-50 dark:bg-gray-700 text-sm" aria-label="Salir">
                  <span className="text-lg">🚪</span>
                  <span className="text-xs mt-1 sr-only">Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" title="Iniciar Sesión" className="flex flex-col items-center text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm" aria-label="Iniciar Sesión">
                  <span className="text-lg">🔐</span>
                  <span className="text-xs mt-1">Entrar</span>
                </Link>
                <Link to="/register" title="Registrarse" className="flex flex-col items-center text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm" aria-label="Registrarse">
                  <span className="text-lg">✨</span>
                  <span className="text-xs mt-1">Alta</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu removed in favor of fixed quick nav above to avoid content shift on open */}
      </div>
    </header>
  );
};

export default Header;