/**
 * Index des composants et services de l'interface d'administration Hendrix
 */

// Types
export * from './types';

// Configuration
export * from './config/models';

// Services
export * from './services/auth';
export * from './services/data';

// Context
export * from './context/AdminContext';

// Composants
export { AdminLayout } from './components/AdminLayout';
export { AdminHeader } from './components/AdminHeader';
export { AdminSidebar } from './components/AdminSidebar';
export { AdminBreadcrumb } from './components/AdminBreadcrumb';
export { AdminDashboard } from './components/AdminDashboard';
