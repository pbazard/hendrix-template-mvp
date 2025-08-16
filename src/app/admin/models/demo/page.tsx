/**
 * Demo page to showcase the Models Management functionality
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Database, 
  Layers, 
  Settings,
  ExternalLink,
  Code,
  Table,
  Shield
} from 'lucide-react';

export default function ModelsDemo() {
  const features = [
    {
      title: 'AWS Amplify Models',
      description: 'View and analyze models deployed through AWS Amplify with full introspection',
      icon: Database,
      items: [
        'Model fields and types',
        'DynamoDB table names and ARNs',
        'Authorization rules',
        'GraphQL operations',
        'Sync capabilities'
      ]
    },
    {
      title: 'Admin Configuration Models',
      description: 'Manage admin interface model configurations',
      icon: Settings,
      items: [
        'Field configurations',
        'Display settings',
        'Search configurations',
        'Action permissions',
        'Custom actions'
      ]
    },
    {
      title: 'Real-time Introspection',
      description: 'Live analysis of your Amplify deployment',
      icon: Code,
      items: [
        'Deployment metadata',
        'Region information',
        'Model statistics',
        'Field count analysis',
        'Operation permissions'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Layers className="h-8 w-8 mr-3 text-blue-600" />
                Models Management Demo
              </h1>
              <p className="text-gray-600 mt-1">AWS Amplify and Admin Models Introspection</p>
            </div>
            <Link
              href="/admin/models"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Models Manager
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Models Management?</h2>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            The Models Management feature provides comprehensive introspection and management of both 
            AWS Amplify deployed models and admin interface configuration models. It automatically 
            analyzes your Amplify deployment to show real DynamoDB table names, ARNs, authorization 
            rules, and much more.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Introspection</h3>
              <p className="text-gray-600 text-sm">Real-time analysis of your Amplify deployment</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Table className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">DynamoDB Integration</h3>
              <p className="text-gray-600 text-sm">Shows actual table names and ARNs</p>
            </div>
            
            <div className="text-center">
              <div className="h-16 w-16 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Authorization Analysis</h3>
              <p className="text-gray-600 text-sm">Detailed auth rules and permissions</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Example Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Example Model Analysis</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Amplify Model Example */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                Amplify Model: Todo
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Table Name:</span>
                  <span className="text-sm font-mono">Todo-dev</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fields:</span>
                  <span className="text-sm">6 (id, content, isDone, priority, createdAt, updatedAt)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Operations:</span>
                  <span className="text-sm">create, read, update, delete</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Auth:</span>
                  <span className="text-sm">API Key (public)</span>
                </div>
                <div className="text-xs text-gray-500 font-mono break-all pt-2 border-t">
                  ARN: arn:aws:dynamodb:eu-west-1:*:table/Todo-dev
                </div>
              </div>
            </div>

            {/* Admin Model Example */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                Admin Model: User
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Verbose Name:</span>
                  <span className="text-sm">User</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fields:</span>
                  <span className="text-sm">8 configured fields</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Permissions:</span>
                  <span className="text-sm">add, change, view</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Actions:</span>
                  <span className="text-sm">3 custom actions</span>
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Source: admin configuration
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to explore?</h2>
          <p className="text-gray-600 mb-6">
            Access the full Models Management interface to see all your deployed models
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/models"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Layers className="h-5 w-5 mr-2" />
              Open Models Manager
            </Link>
            <Link
              href="/admin"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
