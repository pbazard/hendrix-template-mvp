/**
 * Index principal des composants Hendrix Admin
 * Organisation par catégories : layout, forms, ui
 */

// Composants de layout
export * from './layout';

// Composants de formulaires
export * from './forms';

// Composants UI
export * from './ui';

// Ré-exports pour compatibilité
export { AdminLayout } from './layout/AdminLayout';
export { AdminHeader } from './layout/AdminHeader';
export { AdminSidebar } from './layout/AdminSidebar';
export { AdminBreadcrumb } from './layout/AdminBreadcrumb';
export { AdminDashboard } from './ui/AdminDashboard';
export { AdminForm } from './forms/AdminForm';
export { UserForm } from './forms/UserForm';
