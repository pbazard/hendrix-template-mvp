/**
 * Layout principal pour l'interface d'administration Hendrix
 */

'use client';

import React, { ReactNode } from 'react';
import { AdminProvider } from '../../context/AdminContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminBreadcrumb } from './AdminBreadcrumb';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdminBreadcrumb />
              <div className="mt-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
