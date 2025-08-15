/**
 * Barre latérale de navigation pour l'interface d'administration Hendrix
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '../context/AdminContext';
import { ActionType } from '../types';
import { 
  Home, 
  Users, 
  UserCheck, 
  CheckSquare, 
  FileText, 
  Settings,
  Shield,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  modelName?: string;
  action?: ActionType;
}

const navigation: NavItem[] = [
  {
    name: 'Tableau de bord',
    href: '/admin',
    icon: Home,
  },
  {
    name: 'Tâches',
    href: '/admin/todo',
    icon: CheckSquare,
    modelName: 'Todo',
    action: ActionType.LIST
  },
  {
    name: 'Utilisateurs',
    href: '/admin/user',
    icon: Users,
    modelName: 'User',
    action: ActionType.LIST
  },
  {
    name: 'Groupes',
    href: '/admin/group',
    icon: UserCheck,
    modelName: 'Group',
    action: ActionType.LIST
  },
  {
    name: 'Journal d\'audit',
    href: '/admin/auditlog',
    icon: FileText,
    modelName: 'AuditLog',
    action: ActionType.LIST
  },
  {
    name: 'Rapports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    name: 'Sécurité',
    href: '/admin/security',
    icon: Shield,
  },
  {
    name: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { config, hasPermission } = useAdmin();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const canAccess = (item: NavItem) => {
    if (!item.modelName || !item.action) {
      return true; // Pas de restrictions pour les pages sans modèle
    }
    return hasPermission(item.action, item.modelName);
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        {/* Logo et titre */}
        <div className="flex h-16 shrink-0 items-center">
          <img
            className="h-8 w-auto"
            src={config.theme?.logoUrl || '/logo.png'}
            alt={config.site_title}
          />
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">
              {config.site_title}
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.filter(canAccess).map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-l-md p-2 text-sm leading-6 font-semibold transition-colors duration-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive(item.href) ? 'text-blue-700' : 'text-gray-400 group-hover:text-blue-700',
                          'h-5 w-5 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Section modèles */}
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider">
                Modèles
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {Object.entries(config.models)
                  .filter(([modelName]) => hasPermission(ActionType.LIST, modelName))
                  .map(([modelName, modelConfig]) => (
                    <li key={modelName}>
                      <Link
                        href={`/admin/${modelName.toLowerCase()}`}
                        className={cn(
                          isActive(`/admin/${modelName.toLowerCase()}`)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                        )}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-blue-200 group-hover:text-blue-700">
                          {modelConfig.verbose_name?.charAt(0) || modelName.charAt(0)}
                        </span>
                        <span className="truncate">
                          {modelConfig.verbose_name_plural || modelName}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>

            {/* Footer avec version et statut */}
            <li className="mt-auto">
              <div className="text-xs text-gray-500 px-2 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span>Version 1.0.0</span>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <span className="ml-1">En ligne</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
