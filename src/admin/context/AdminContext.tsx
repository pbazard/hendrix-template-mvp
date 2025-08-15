/**
 * Context React pour l'interface d'administration Hendrix
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AdminContextType, CognitoUser, Permission, ActionType } from '../types';
import { adminConfig } from '../config/models';
import { CognitoAuthService } from '../services/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AdminContext = createContext<AdminContextType | null>(null);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeAdmin();
  }, []);

  const initializeAdmin = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier si l'utilisateur est connecté
      const isAuthenticated = await CognitoAuthService.isAuthenticated();
      if (!isAuthenticated) {
        router.push('/auth/signin');
        return;
      }

      // Récupérer l'utilisateur actuel
      const currentUser = await CognitoAuthService.getCurrentUser();
      if (!currentUser) {
        router.push('/auth/signin');
        return;
      }

      // Vérifier l'accès admin
      const hasAccess = await CognitoAuthService.hasAdminAccess(currentUser);
      if (!hasAccess) {
        toast.error('Accès non autorisé à l\'interface d\'administration');
        router.push('/');
        return;
      }

      setUser(currentUser);

      // Récupérer les permissions
      const userPermissions = await CognitoAuthService.getUserPermissions(currentUser);
      setPermissions(userPermissions);

      toast.success(`Bienvenue dans l'administration, ${currentUser.username}!`);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'admin:', error);
      toast.error('Erreur lors du chargement de l\'interface d\'administration');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (action: ActionType, model: string): boolean => {
    if (!user) return false;

    // Les administrateurs ont tous les droits
    const adminGroups = ['Administrators'];
    if (user.groups.some(group => adminGroups.includes(group))) {
      return true;
    }

    // Vérifier les permissions spécifiques
    const permissionCode = `${model.toLowerCase()}.${action}`;
    return permissions.some(p => p.codename === permissionCode);
  };

  const navigate = (path: string) => {
    router.push(path);
  };

  const showMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      case 'info':
        toast.info(message);
        break;
    }
  };

  const signOut = async () => {
    try {
      await CognitoAuthService.signOut();
      setUser(null);
      setPermissions([]);
      toast.success('Déconnexion réussie');
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const contextValue: AdminContextType = {
    user,
    config: adminConfig,
    permissions,
    hasPermission,
    navigate,
    showMessage
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'interface d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextType {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin doit être utilisé dans un AdminProvider');
  }
  return context;
}

// Hook pour vérifier les permissions
export function usePermission(action: ActionType, model: string): boolean {
  const { hasPermission } = useAdmin();
  return hasPermission(action, model);
}

// Hook pour les opérations de navigation
export function useAdminNavigation() {
  const { navigate, showMessage } = useAdmin();
  
  return {
    goToModel: (modelName: string) => navigate(`/admin/${modelName.toLowerCase()}`),
    goToModelCreate: (modelName: string) => navigate(`/admin/${modelName.toLowerCase()}/add`),
    goToModelEdit: (modelName: string, id: string) => navigate(`/admin/${modelName.toLowerCase()}/${id}/change`),
    goToModelDetail: (modelName: string, id: string) => navigate(`/admin/${modelName.toLowerCase()}/${id}`),
    goToDashboard: () => navigate('/admin'),
    showSuccess: (message: string) => showMessage(message, 'success'),
    showError: (message: string) => showMessage(message, 'error'),
    showWarning: (message: string) => showMessage(message, 'warning'),
    showInfo: (message: string) => showMessage(message, 'info')
  };
}
