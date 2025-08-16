/**
 * Enhanced Admin Dashboard - Hendrix Template
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  TrendingUp, 
  Clock,
  CheckSquare,
  FileText,
  Bell,
  Search,
  Database,
  Layers
} from 'lucide-react';

import { useModelIntrospection } from '@/admin/hooks/useModelIntrospection';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  recentActivities: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalGroups: 0,
    recentActivities: 0,
    systemHealth: 'healthy'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const { data: modelData, loading: modelLoading } = useModelIntrospection();

  useEffect(() => {
    // Simulate loading stats
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 127,
        activeUsers: 89,
        totalGroups: 5,
        recentActivities: 23,
        systemHealth: 'healthy'
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new user', time: '2 minutes ago', type: 'create' },
    { id: 2, user: 'Jane Smith', action: 'Updated permissions', time: '5 minutes ago', type: 'update' },
    { id: 3, user: 'Admin', action: 'Modified group settings', time: '10 minutes ago', type: 'modify' },
    { id: 4, user: 'System', action: 'Automated backup completed', time: '1 hour ago', type: 'system' }
  ];

  const quickActions = [
    { title: 'Add New User', icon: Users, description: 'Create a new user account', color: 'bg-blue-500' },
    { title: 'Manage Groups', icon: Shield, description: 'Configure user groups and permissions', color: 'bg-green-500' },
    { title: 'System Settings', icon: Settings, description: 'Configure system preferences', color: 'bg-purple-500' },
    { title: 'View Reports', icon: FileText, description: 'Generate and view system reports', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome to Hendrix Administration</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">↗ +12% from last month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-sm text-green-600 mt-1">↗ +5% from yesterday</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Groups</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalGroups}</p>
                <p className="text-sm text-gray-500 mt-1">Administrators, Staff, Users</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-3xl font-bold text-green-600">Healthy</p>
                <p className="text-sm text-gray-500 mt-1">All systems operational</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Models Overview */}
        {!modelLoading && modelData && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-blue-600" />
                    Models Overview
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">AWS Amplify and admin configuration models</p>
                </div>
                <a 
                  href="/admin/models"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View All →
                </a>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto bg-blue-50 rounded-lg mb-3">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{modelData.statistics.amplifyModelsCount}</h3>
                  <p className="text-sm text-gray-600">Amplify Models</p>
                  <p className="text-xs text-gray-500 mt-1">{modelData.statistics.tablesCount} DynamoDB tables</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto bg-purple-50 rounded-lg mb-3">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{modelData.statistics.adminModelsCount}</h3>
                  <p className="text-sm text-gray-600">Admin Models</p>
                  <p className="text-xs text-gray-500 mt-1">Configuration-based</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 mx-auto bg-green-50 rounded-lg mb-3">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{modelData.statistics.fieldsCount}</h3>
                  <p className="text-sm text-gray-600">Total Fields</p>
                  <p className="text-xs text-gray-500 mt-1">Across all models</p>
                </div>
              </div>
              
              {modelData.amplifyModels.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Amplify Models</h4>
                  <div className="space-y-2">
                    {modelData.amplifyModels.slice(0, 3).map(model => (
                      <div key={model.name} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{model.name}</span>
                          <span className="text-xs text-gray-500 ml-2">({Object.keys(model.fields).length} fields)</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          model.syncable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {model.syncable ? 'Syncable' : 'Static'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600 text-sm mt-1">Common administrative tasks</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left group"
                  >
                    <div className={`${action.color} p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              <p className="text-gray-600 text-sm mt-1">Latest system activities</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`
                      w-2 h-2 rounded-full mt-2 flex-shrink-0
                      ${activity.type === 'create' ? 'bg-green-500' : 
                        activity.type === 'update' ? 'bg-blue-500' : 
                        activity.type === 'modify' ? 'bg-yellow-500' : 'bg-gray-500'}
                    `}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View all activities →
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            <p className="text-gray-600 text-sm mt-1">Current system performance and health</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckSquare className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">Authentication</h3>
                <p className="text-sm text-green-600 mt-1">Operational</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">Security</h3>
                <p className="text-sm text-green-600 mt-1">Secure</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">Performance</h3>
                <p className="text-sm text-green-600 mt-1">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
