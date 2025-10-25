import React, { useState } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import ApproveListings from '@/components/admin/ApproveListings';
import UserManagement from '@/components/admin/UserManagement';
import Button from '@/components/ui/Button';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'approve' | 'users'>('dashboard');

  const tabs: Array<{ id: 'dashboard' | 'approve' | 'users'; label: string; component: React.ComponentType }> = [
    { id: 'dashboard', label: 'Dashboard', component: AdminDashboard },
    { id: 'approve', label: 'Aprobar Publicaciones', component: ApproveListings },
    { id: 'users', label: 'Gestión de Usuarios', component: UserManagement },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || AdminDashboard;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="mb-8">
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-none border-b-2 border-transparent hover:border-blue-500"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <ActiveComponent />
    </div>
  );
};

export default AdminPage;