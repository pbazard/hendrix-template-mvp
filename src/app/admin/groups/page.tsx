/**
 * Groups Management Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  Users, 
  Edit,
  Trash2,
  MoreVertical,
  Settings
} from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: Date;
  isSystem: boolean;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  useEffect(() => {
    // Simulate loading groups and permissions
    const timer = setTimeout(() => {
      setPermissions([
        { id: 'view_admin', name: 'View Admin', description: 'Can access admin interface', category: 'Admin' },
        { id: 'manage_users', name: 'Manage Users', description: 'Can create, edit, and delete users', category: 'Users' },
        { id: 'manage_groups', name: 'Manage Groups', description: 'Can create, edit, and delete groups', category: 'Groups' },
        { id: 'view_analytics', name: 'View Analytics', description: 'Can view system analytics', category: 'Analytics' },
        { id: 'manage_qr_codes', name: 'Manage QR Codes', description: 'Can create and manage QR codes', category: 'QR Codes' },
        { id: 'view_qr_codes', name: 'View QR Codes', description: 'Can view QR codes', category: 'QR Codes' },
      ]);

      setGroups([
        {
          id: '1',
          name: 'administrators',
          description: 'Full system administrators with all permissions',
          permissions: ['view_admin', 'manage_users', 'manage_groups', 'view_analytics', 'manage_qr_codes'],
          userCount: 1,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
          isSystem: true
        },
        {
          id: '2',
          name: 'staff',
          description: 'Staff members with limited admin access',
          permissions: ['view_admin', 'view_analytics', 'manage_qr_codes', 'view_qr_codes'],
          userCount: 5,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
          isSystem: true
        },
        {
          id: '3',
          name: 'users',
          description: 'Regular users with basic permissions',
          permissions: ['view_qr_codes'],
          userCount: 125,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          isSystem: true
        },
        {
          id: '4',
          name: 'qr_managers',
          description: 'Users who can manage QR codes',
          permissions: ['manage_qr_codes', 'view_qr_codes'],
          userCount: 8,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          isSystem: false
        }
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionsByCategory = (permissionIds: string[]) => {
    const groupedPermissions: { [key: string]: Permission[] } = {};
    
    permissionIds.forEach(id => {
      const permission = permissions.find(p => p.id === id);
      if (permission) {
        if (!groupedPermissions[permission.category]) {
          groupedPermissions[permission.category] = [];
        }
        groupedPermissions[permission.category].push(permission);
      }
    });
    
    return groupedPermissions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="h-8 w-8 mr-3 text-blue-600" />
                Group Management
              </h1>
              <p className="text-gray-600 mt-1">Manage user groups and permissions</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create New Group
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Groups List */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Groups</h2>
            
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading groups...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer transition-all hover:shadow-md ${
                      selectedGroup?.id === group.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                          {group.isSystem && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                              System
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{group.description}</p>
                        <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {group.userCount} users
                          </div>
                          <div className="flex items-center">
                            <Settings className="h-4 w-4 mr-1" />
                            {group.permissions.length} permissions
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        {!group.isSystem && (
                          <button className="text-red-600 hover:text-red-900 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Group Details</h2>
            
            {selectedGroup ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{selectedGroup.name}</h3>
                    {selectedGroup.isSystem && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                        System Group
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{selectedGroup.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Users:</span>
                      <span className="ml-2 text-gray-600">{selectedGroup.userCount}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Created:</span>
                      <span className="ml-2 text-gray-600">
                        {selectedGroup.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Permissions</h4>
                  <div className="space-y-4">
                    {Object.entries(getPermissionsByCategory(selectedGroup.permissions)).map(([category, perms]) => (
                      <div key={category}>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">{category}</h5>
                        <div className="space-y-2">
                          {perms.map((permission) => (
                            <div key={permission.id} className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                                <p className="text-xs text-gray-500">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Edit Group
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                      Manage Users
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a group to view details</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
