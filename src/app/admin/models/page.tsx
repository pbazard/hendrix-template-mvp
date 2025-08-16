/**
 * Models Management Page
 * Displays both AWS Amplify models and admin configuration models
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database,
  Layers,
  Settings,
  Eye,
  Code,
  Download,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Table,
  Key,
  Shield,
  Activity,
  Info
} from 'lucide-react';

import { ModelIntrospectionService, AmplifyModel, AdminModel, ModelIntrospectionResult } from '../services/modelIntrospection';

export default function ModelsPage() {
  const [introspectionData, setIntrospectionData] = useState<ModelIntrospectionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<'all' | 'amplify' | 'admin'>('all');
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
  const [selectedModel, setSelectedModel] = useState<AmplifyModel | AdminModel | null>(null);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const service = ModelIntrospectionService.getInstance();
      const data = await service.getModelIntrospection();
      setIntrospectionData(data);
    } catch (error) {
      console.error('Error loading models:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModelExpansion = (modelName: string) => {
    const newExpanded = new Set(expandedModels);
    if (newExpanded.has(modelName)) {
      newExpanded.delete(modelName);
    } else {
      newExpanded.add(modelName);
    }
    setExpandedModels(newExpanded);
  };

  const getFilteredModels = () => {
    if (!introspectionData) return { amplifyModels: [], adminModels: [] };

    const { amplifyModels, adminModels } = introspectionData;
    
    const filterBySearch = (name: string) => 
      name.toLowerCase().includes(searchTerm.toLowerCase());

    return {
      amplifyModels: amplifyModels.filter(model => filterBySearch(model.name)),
      adminModels: adminModels.filter(model => filterBySearch(model.name))
    };
  };

  const renderModelCard = (model: AmplifyModel | AdminModel, type: 'amplify' | 'admin') => {
    const isExpanded = expandedModels.has(model.name);
    const isAmplifyModel = type === 'amplify';
    const amplifyModel = isAmplifyModel ? model as AmplifyModel : null;
    const adminModel = !isAmplifyModel ? model as AdminModel : null;

    return (
      <div key={`${type}-${model.name}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div 
          className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleModelExpansion(model.name)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-500" />
              )}
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                {isAmplifyModel ? (
                  <Database className="h-5 w-5 text-blue-600" />
                ) : (
                  <Settings className="h-5 w-5 text-purple-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-500">
                  {isAmplifyModel ? 'AWS Amplify Model' : 'Admin Configuration Model'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAmplifyModel && amplifyModel && (
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {Object.keys(amplifyModel.fields).length} fields
                    </p>
                    <p className="text-xs text-gray-500">
                      {amplifyModel.region}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    amplifyModel.syncable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {amplifyModel.syncable ? 'Syncable' : 'Static'}
                  </span>
                </>
              )}
              
              {!isAmplifyModel && adminModel && (
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {adminModel.fieldCount} fields
                    </p>
                    <p className="text-xs text-gray-500">
                      {adminModel.actions.length} actions
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    Admin
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-200 p-6">
            {isAmplifyModel && amplifyModel ? (
              <div className="space-y-6">
                {/* Model Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Model Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Table Name:</dt>
                        <dd className="font-mono text-gray-900">{amplifyModel.tableName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Plural Name:</dt>
                        <dd className="text-gray-900">{amplifyModel.pluralName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Primary Key:</dt>
                        <dd className="text-gray-900">{amplifyModel.primaryKeyInfo.primaryKeyFieldName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Region:</dt>
                        <dd className="text-gray-900">{amplifyModel.region}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Operations</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(amplifyModel.operations)).map(operation => (
                        <span 
                          key={operation}
                          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                        >
                          {operation}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Fields ({Object.keys(amplifyModel.fields).length})</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Array</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Read Only</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.values(amplifyModel.fields).map(field => (
                          <tr key={field.name}>
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">{field.name}</td>
                            <td className="px-3 py-2 text-sm text-gray-500 font-mono">{field.type}</td>
                            <td className="px-3 py-2 text-sm">
                              {field.isRequired ? (
                                <span className="text-red-600">✓</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-sm">
                              {field.isArray ? (
                                <span className="text-blue-600">✓</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-sm">
                              {field.isReadOnly ? (
                                <span className="text-orange-600">✓</span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Auth Rules */}
                {amplifyModel.authRules.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Authorization Rules</h4>
                    <div className="space-y-2">
                      {amplifyModel.authRules.map((rule, index) => (
                        <div key={index} className="bg-gray-50 rounded p-3">
                          <div className="flex items-center space-x-2 text-sm">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{rule.allow}</span>
                            {rule.provider && (
                              <span className="text-gray-500">via {rule.provider}</span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {rule.operations.map(op => (
                              <span key={op} className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                                {op}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ARN */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">DynamoDB ARN</h4>
                  <div className="bg-gray-50 rounded p-3">
                    <code className="text-xs text-gray-700 break-all">{amplifyModel.arn}</code>
                  </div>
                </div>
              </div>
            ) : adminModel && (
              <div className="space-y-6">
                {/* Admin Model Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Model Information</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Verbose Name:</dt>
                        <dd className="text-gray-900">{adminModel.verbose_name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Plural Name:</dt>
                        <dd className="text-gray-900">{adminModel.verbose_name_plural}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Field Count:</dt>
                        <dd className="text-gray-900">{adminModel.fieldCount}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Source:</dt>
                        <dd className="text-gray-900">{adminModel.source}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Permissions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(adminModel.permissions).map(([permission, allowed]) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <span className={`h-2 w-2 rounded-full ${allowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="text-sm text-gray-700 capitalize">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Display Fields */}
                {adminModel.list_display.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">List Display Fields</h4>
                    <div className="flex flex-wrap gap-2">
                      {adminModel.list_display.map(field => (
                        <span key={field} className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Fields */}
                {adminModel.search_fields.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Search Fields</h4>
                    <div className="flex flex-wrap gap-2">
                      {adminModel.search_fields.map(field => (
                        <span key={field} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                {adminModel.actions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Available Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      {adminModel.actions.map(action => (
                        <span key={action} className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredModels = getFilteredModels();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Layers className="h-8 w-8 mr-3 text-blue-600" />
                Models Management
              </h1>
              <p className="text-gray-600 mt-1">AWS Amplify models and admin configuration</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadModels}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Schema
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading models...</span>
          </div>
        ) : introspectionData ? (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Models</p>
                    <p className="text-2xl font-bold text-gray-900">{introspectionData.statistics.totalModels}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Amplify Models</p>
                    <p className="text-2xl font-bold text-gray-900">{introspectionData.statistics.amplifyModelsCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admin Models</p>
                    <p className="text-2xl font-bold text-gray-900">{introspectionData.statistics.adminModelsCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Table className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">DynamoDB Tables</p>
                    <p className="text-2xl font-bold text-gray-900">{introspectionData.statistics.tablesCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <Key className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Fields</p>
                    <p className="text-2xl font-bold text-gray-900">{introspectionData.statistics.fieldsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deployment Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Deployment Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Region:</span>
                  <span className="ml-2 font-medium">{introspectionData.deploymentInfo.region}</span>
                </div>
                {introspectionData.deploymentInfo.appId && (
                  <div>
                    <span className="text-gray-500">App ID:</span>
                    <span className="ml-2 font-mono text-xs">{introspectionData.deploymentInfo.appId}</span>
                  </div>
                )}
                {introspectionData.deploymentInfo.environment && (
                  <div>
                    <span className="text-gray-500">Environment:</span>
                    <span className="ml-2 font-medium">{introspectionData.deploymentInfo.environment}</span>
                  </div>
                )}
                {introspectionData.deploymentInfo.stackName && (
                  <div>
                    <span className="text-gray-500">Stack:</span>
                    <span className="ml-2 font-mono text-xs">{introspectionData.deploymentInfo.stackName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search models..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value as 'all' | 'amplify' | 'admin')}
                  >
                    <option value="all">All Models</option>
                    <option value="amplify">Amplify Models</option>
                    <option value="admin">Admin Models</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AWS Amplify Models */}
            {(selectedSection === 'all' || selectedSection === 'amplify') && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-blue-600" />
                  AWS Amplify Models ({filteredModels.amplifyModels.length})
                </h2>
                {filteredModels.amplifyModels.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No Amplify models found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Check your Amplify configuration and model introspection
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredModels.amplifyModels.map(model => renderModelCard(model, 'amplify'))}
                  </div>
                )}
              </div>
            )}

            {/* Admin Models */}
            {(selectedSection === 'all' || selectedSection === 'admin') && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-purple-600" />
                  Admin Configuration Models ({filteredModels.adminModels.length})
                </h2>
                {filteredModels.adminModels.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No admin models configured</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredModels.adminModels.map(model => renderModelCard(model, 'admin'))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No model data available</p>
          </div>
        )}
      </main>
    </div>
  );
}
