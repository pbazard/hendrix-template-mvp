/**
 * Page principale de l'interface d'administration Hendrix
 */

import { AdminLayout, AdminDashboard } from '@/admin/components';

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}

export const metadata = {
  title: 'Administration Hendrix',
  description: 'Interface d\'administration pour la gestion de votre application',
};
