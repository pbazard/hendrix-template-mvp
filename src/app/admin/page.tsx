/**
 * Simple admin page to test the core functionality
 */

import React from 'react';

export default function AdminSimplePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Admin Panel - Simple Version</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Users</h3>
            <p className="text-gray-600">Manage user accounts</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">42</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Groups</h3>
            <p className="text-gray-600">Manage user groups</p>
            <p className="text-2xl font-bold text-green-600 mt-2">3</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Permissions</h3>
            <p className="text-gray-600">Configure permissions</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">12</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Status</h2>
          <div className="space-y-2">
            <p className="text-green-600">✅ Basic admin page is working</p>
            <p className="text-green-600">✅ No context dependencies</p>
            <p className="text-green-600">✅ Server is responsive</p>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              This is a simplified admin page that works without the complex AdminProvider context.
              Once we resolve the context issue, we can switch back to the full admin interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
