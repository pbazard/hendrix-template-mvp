/**
 * CRUD Demo Page
 * Demonstrates the CRUD functionality for models
 */

'use client';

import React, { useState } from 'react';
import { 
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  List,
  ArrowLeft,
  Code,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function CrudDemoPage() {
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);

  const operations = [
    {
      id: 'create',
      name: 'Create',
      icon: Plus,
      description: 'Add new records to your models',
      color: 'bg-green-100 text-green-800 border-green-200',
      iconColor: 'text-green-600',
      features: [
        'Form validation based on model schema',
        'Type-aware input fields',
        'Required field indicators',
        'Real-time error handling'
      ]
    },
    {
      id: 'read',
      name: 'Read',
      icon: Eye,
      description: 'View individual records by ID',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      iconColor: 'text-blue-600',
      features: [
        'Fetch records by primary key',
        'Read-only field display',
        'Formatted data visualization',
        'Relationship field handling'
      ]
    },
    {
      id: 'update',
      name: 'Update',
      icon: Edit,
      description: 'Modify existing records',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      iconColor: 'text-yellow-600',
      features: [
        'Pre-populate forms with existing data',
        'Partial updates supported',
        'Optimistic UI updates',
        'Conflict resolution'
      ]
    },
    {
      id: 'delete',
      name: 'Delete',
      icon: Trash2,
      description: 'Remove records from your models',
      color: 'bg-red-100 text-red-800 border-red-200',
      iconColor: 'text-red-600',
      features: [
        'Confirmation dialogs',
        'Cascading delete support',
        'Soft delete options',
        'Audit trail maintenance'
      ]
    },
    {
      id: 'list',
      name: 'List',
      icon: List,
      description: 'Browse multiple records with filtering',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      iconColor: 'text-purple-600',
      features: [
        'Paginated results',
        'Advanced filtering',
        'Sorting capabilities',
        'Search functionality'
      ]
    }
  ];

  const modelTypes = [
    {
      name: 'AWS Amplify Models',
      description: 'Business models deployed in your AWS environment',
      color: 'bg-blue-50 border-blue-200',
      icon: Database,
      iconColor: 'text-blue-600',
      examples: ['Todo', 'User', 'Product', 'Order'],
      capabilities: [
        'Direct DynamoDB operations',
        'Real-time subscriptions',
        'Offline sync support',
        'Authorization rules'
      ]
    },
    {
      name: 'Admin Configuration Models',
      description: 'Administrative models for system configuration',
      color: 'bg-purple-50 border-purple-200',
      icon: Settings,
      iconColor: 'text-purple-600',
      examples: ['UserGroup', 'Permission', 'Setting', 'Audit'],
      capabilities: [
        'Administrative workflows',
        'Permission management',
        'Configuration storage',
        'System monitoring'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/models"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Code className="h-8 w-8 mr-3 text-indigo-600" />
                  CRUD Operations Demo
                </h1>
                <p className="text-gray-600 mt-1">Interactive model management capabilities</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Enhanced Model Management
              </h2>
              <p className="text-gray-600 mb-4">
                The admin interface now supports full CRUD (Create, Read, Update, Delete) operations 
                for all your models. Each model type has distinct visual styling and appropriate 
                operation capabilities.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">New Features:</h3>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• Color-coded model types (Blue for Amplify, Purple for Admin)</li>
                  <li>• Interactive CRUD buttons on each model card</li>
                  <li>• Dynamic forms based on model schema</li>
                  <li>• Real-time data validation and error handling</li>
                  <li>• Responsive modal interfaces for all operations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Model Types */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Model Types</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modelTypes.map((modelType) => {
              const Icon = modelType.icon;
              return (
                <div key={modelType.name} className={`bg-white rounded-lg shadow-sm border-2 ${modelType.color} p-6`}>
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 h-12 w-12 rounded-lg ${modelType.color} flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 ${modelType.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {modelType.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {modelType.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Example Models:</h4>
                        <div className="flex flex-wrap gap-2">
                          {modelType.examples.map(example => (
                            <span key={example} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Capabilities:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {modelType.capabilities.map((capability, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {capability}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CRUD Operations */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">CRUD Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operations.map((operation) => {
              const Icon = operation.icon;
              const isSelected = selectedOperation === operation.id;
              
              return (
                <div
                  key={operation.id}
                  className={`bg-white rounded-lg shadow-sm border-2 transition-all cursor-pointer ${
                    isSelected ? operation.color : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOperation(isSelected ? null : operation.id)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`h-10 w-10 rounded-lg ${operation.color.split(' ')[0]} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${operation.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {operation.name}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {operation.description}
                    </p>
                    
                    {isSelected && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {operation.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                How to Use CRUD Operations
              </h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">1. Navigate to Models Page</h3>
                  <p>Go back to the main Models Management page to see your deployed models.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">2. Identify Model Types</h3>
                  <p>Amplify models have blue styling, while Admin models use purple styling.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">3. Use CRUD Actions</h3>
                  <p>Click the action buttons in the top-right of each model card to perform operations.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">4. Follow Modal Prompts</h3>
                  <p>Each operation opens a specialized modal with appropriate forms and validation.</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  href="/admin/models"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Models
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
