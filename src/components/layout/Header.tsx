import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { getDisplayName } from '@/utils/helpers';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useMessages();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors" onClick={closeMenu}>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105 border border-blue-200 dark:border-gray-600"
            aria-label="Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700" onClick={closeMenu}>
                🏠 Inicio
              </Link>
              <Link to="/explore" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700" onClick={closeMenu}>
                🔍 Explorar
              </Link>
              {user && (
                <>
                  <Link to="/my-cars" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700" onClick={closeMenu}>
                    🚗 Mis Autos
                  </Link>
                  <Link to="/profile" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700" onClick={closeMenu}>
                    👤 Perfil
                  </Link>
                  <Link to="/messages" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 relative" onClick={closeMenu}>
                    💬 Mensajes
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  {user.role && String(user.role).toLowerCase() === 'admin' && (
                    <Link to="/admin" className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700" onClick={closeMenu}>
                      ⚙️ Admin
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="flex flex-col space-y-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              {user ? (
                <div className="space-y-3">
                  <div className="text-gray-800 dark:text-white text-sm font-medium px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-800">
                    👋 Hola, <span className="font-semibold text-blue-600 dark:text-blue-400">{getDisplayName(user)}</span>
                  </div>
                  <Button onClick={handleLogout} variant="secondary" className="w-full justify-center">
                    🚪 Salir
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="secondary" className="w-full justify-center">
                      🔐 Iniciar Sesión
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button className="w-full justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                      ✨ Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;