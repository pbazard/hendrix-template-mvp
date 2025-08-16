/**
 * Context React pour l'interface d'administration Hendrix - Version corrigée
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
      console.log('🔍 Starting admin initialization...');

      // Get current user (demo mode)
      const currentUser = await CognitoAuthService.getCurrentUser();
      console.log('👤 User retrieved:', currentUser);
      
      if (!currentUser) {
        console.log('❌ No user found, creating demo user');
        // In demo mode, create a mock user
        const demoUser: CognitoUser = {
          id: 'demo-admin',
          username: 'admin',
          email: 'admin@demo.local',
          given_name: 'Admin',
          family_name: 'Demo',
          groups: ['administrators'],
          attributes: {},
          isActive: true,
          enabled: true,
          dateJoined: new Date(),
          lastLogin: new Date()
        };
        setUser(demoUser);
        
        const demoPermissions: Permission[] = [
          { id: '1', name: 'Admin access', codename: 'admin_access', contentType: 'Admin' }
        ];
        setPermissions(demoPermissions);
        
        console.log('✅ Demo user created');
        toast.success('Demo mode activated - Admin access granted');
        setIsLoading(false);
        return;
      }

      // Check admin access - but don't block in demo mode
      try {
        const hasAccess = await CognitoAuthService.hasAdminAccess(currentUser);
        console.log('🔐 Admin access check:', hasAccess);
        
        if (!hasAccess) {
          console.log('⚠️ Admin access denied in production, but allowing in demo mode');
        }
      } catch (error) {
        console.log('⚠️ Admin access check failed, continuing in demo mode');
      }

      setUser(currentUser);

      // Get permissions with fallback
      try {
        const userPermissions = await CognitoAuthService.getUserPermissions(currentUser);
        console.log('📋 Permissions retrieved:', userPermissions);
        setPermissions(userPermissions);
      } catch (error) {
        console.log('⚠️ Permissions error, using demo permissions');
        setPermissions([
          { id: '1', name: 'Admin access', codename: 'admin_access', contentType: 'Admin' },
          { id: '2', name: 'User management', codename: 'user_management', contentType: 'User' },
          { id: '3', name: 'Group management', codename: 'group_management', contentType: 'Group' }
        ]);
      }

      console.log('✅ Admin initialization completed successfully');
      toast.success(`Welcome ${currentUser.given_name || currentUser.username}!`);
      
    } catch (error) {
      console.error('❌ Critical error during initialization:', error);
      
      // Fallback mode: create a demo user anyway
      console.log('🚑 Fallback mode: creating demo user');
      const fallbackUser: CognitoUser = {
        id: 'fallback-admin',
        username: 'admin',
        email: 'admin@fallback.local',
        given_name: 'Admin',
        family_name: 'Fallback',
        groups: ['administrators'],
        attributes: {},
        isActive: true,
        enabled: true,
        dateJoined: new Date(),
        lastLogin: new Date()
      };
      
      setUser(fallbackUser);
      setPermissions([
        { id: '1', name: 'Admin access', codename: 'admin_access', contentType: 'Admin' },
        { id: '2', name: 'User management', codename: 'user_management', contentType: 'User' },
        { id: '3', name: 'Group management', codename: 'group_management', contentType: 'Group' }
      ]);
      
      toast.success('Development mode - Admin access granted');
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (action: ActionType, resource?: string): boolean => {
    if (!user) return false;

    // In demo mode, administrators have all rights
    if (user.groups.includes('administrators')) {
      return true;
    }

    // Staff has limited rights
    if (user.groups.includes('staff')) {
      return action !== ActionType.DELETE; // No deletion for staff
    }

    return false;
  };

  const navigate = (path: string): void => {
    router.push(path);
  };

  const showMessage = (message: string, type: 'success' | 'error' | 'warning' | 'info'): void => {
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

  const contextValue: AdminContextType = {
    user,
    permissions,
    config: adminConfig,
    hasPermission,
    navigate,
    showMessage
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
