/**
 * Full Admin Interface with Complex Layout
 */

import React from 'react';
import { AdminLayout, AdminDashboard } from '@/admin/components';

export default function AdminFullPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}

export const metadata = {
  title: 'Admin Dashboard - Hendrix',
  description: 'Full-featured administration interface with sidebar navigation',
};
