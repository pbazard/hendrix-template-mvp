/**
 * Page principale de l'interface d'administration Hendrix
 */

import { AdminLayout } from '@/admin/components/AdminLayout';
import { AdminDashboard } from '@/admin/components/AdminDashboard';

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
