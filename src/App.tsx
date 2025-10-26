import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CarProvider } from '@/context/CarContext';
import { UIProvider } from '@/context/UIContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import ExplorePage from '@/pages/ExplorePage';
import MyCarsPage from '@/pages/MyCarsPage';
import ProfilePage from '@/pages/ProfilePage';
import MessagesPage from '@/pages/MessagesPage';
import AdminPage from '@/pages/AdminPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import SellCarPage from '@/pages/SellCarPage';
import CarDetailPage from '@/pages/CarDetailPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CarProvider>
        <FavoritesProvider>
        <UIProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-7xl mx-auto w-full">
              <Header />
              <main className="flex-1 w-full pt-4 pb-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/sell-car" element={
                    <ProtectedRoute>
                      <SellCarPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/car/:id" element={<CarDetailPage />} />
                  <Route path="/my-cars" element={
                    <ProtectedRoute>
                      <MyCarsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <AdminPage />
                    </ProtectedRoute>
                  } />
                  {/* Ruta catch-all para debugging */}
                  <Route path="*" element={<div>Ruta no encontrada</div>} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </UIProvider>
        </FavoritesProvider>
      </CarProvider>
    </AuthProvider>
  );
}

export default App;
