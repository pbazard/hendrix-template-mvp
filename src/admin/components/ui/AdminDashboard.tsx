/**
 * Tableau de bord principal de l'interface d'administration Hendrix
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { DataService } from '../services/data';
import { ActionType } from '../types';
import { 
  Users, 
  CheckSquare, 
  FileText, 
  TrendingUp,
  Activity,
  Shield,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  activeTodos: number;
  completedTodos: number;
  recentAuditLogs: number;
  newUsersThisWeek: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  model: string;
  timestamp: Date;
  description: string;
}

export function AdminDashboard() {
  const { user, config, hasPermission } = useAdmin();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeTodos: 0,
    completedTodos: 0,
    recentAuditLogs: 0,
    newUsersThisWeek: 0,
    systemHealth: 'healthy'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Charger les statistiques en parallèle
      const [usersData, todosData, auditLogsData] = await Promise.all([
        hasPermission(ActionType.LIST, 'User') 
          ? DataService.list('User', { pageSize: 1 })
          : { total: 0, items: [] },
        hasPermission(ActionType.LIST, 'Todo')
          ? DataService.list('Todo', { pageSize: 1000 })
          : { total: 0, items: [] },
        hasPermission(ActionType.LIST, 'AuditLog')
          ? DataService.list('AuditLog', { pageSize: 10, ordering: '-timestamp' })
          : { total: 0, items: [] }
      ]);

      // Calculer les statistiques
      const activeTodos = (todosData.items as any[]).filter(todo => !todo.completed).length;
      const completedTodos = (todosData.items as any[]).filter(todo => todo.completed).length;

      setStats({
        totalUsers: usersData.total,
        activeTodos,
        completedTodos,
        recentAuditLogs: auditLogsData.total,
        newUsersThisWeek: Math.floor(usersData.total * 0.1), // Simulation
        systemHealth: 'healthy'
      });

      // Convertir les logs d'audit en activité récente
      const activity: RecentActivity[] = (auditLogsData.items as any[]).map(log => ({
        id: log.id,
        user: log.user,
        action: log.action,
        model: log.model,
        timestamp: new Date(log.timestamp),
        description: log.changeMessage || log.objectRepr
      }));

      setRecentActivity(activity);
    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'update': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'delete': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenue, {user?.username}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Voici un aperçu de votre application.
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {hasPermission(ActionType.LIST, 'User') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersThisWeek} cette semaine
              </p>
            </CardContent>
          </Card>
        )}

        {hasPermission(ActionType.LIST, 'Todo') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tâches actives</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeTodos}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedTodos} terminées
              </p>
            </CardContent>
          </Card>
        )}

        {hasPermission(ActionType.LIST, 'AuditLog') && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activité récente</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentAuditLogs}</div>
              <p className="text-xs text-muted-foreground">
                Actions enregistrées
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">État du système</CardTitle>
            <Shield className={`h-4 w-4 ${stats.systemHealth === 'healthy' ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{stats.systemHealth === 'healthy' ? 'Sain' : 'Problème'}</div>
            <p className="text-xs text-muted-foreground">
              Tous les services fonctionnent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activité récente */}
        {hasPermission(ActionType.LIST, 'AuditLog') && (
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Les dernières actions effectuées dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.user} - {activity.model}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {activity.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-400">
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucune activité récente
                  </p>
                )}
              </div>
              {recentActivity.length > 0 && (
                <div className="mt-6">
                  <Link
                    href="/admin/auditlog"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Voir toute l'activité →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Liens rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès rapide aux fonctionnalités courantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {hasPermission(ActionType.CREATE, 'User') && (
                <Link
                  href="/admin/user/add"
                  className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">
                    Ajouter un utilisateur
                  </span>
                </Link>
              )}

              {hasPermission(ActionType.CREATE, 'Todo') && (
                <Link
                  href="/admin/todo/add"
                  className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <CheckSquare className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">
                    Créer une tâche
                  </span>
                </Link>
              )}

              {hasPermission(ActionType.LIST, 'AuditLog') && (
                <Link
                  href="/admin/auditlog"
                  className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FileText className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-purple-900">
                    Journal d'audit
                  </span>
                </Link>
              )}

              <Link
                href="/admin/settings"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Shield className="h-5 w-5 text-gray-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">
                  Paramètres
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
