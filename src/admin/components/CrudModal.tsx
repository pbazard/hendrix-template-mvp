/**
 * CRUD Modal Component
 * Provides a modal interface for Create, Read, Update, Delete operations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Eye, Edit, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { AmplifyModel, AmplifyModelField } from '../services/modelIntrospection';
import { useModelCrud } from '../hooks/useModelCrud';

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: AmplifyModel;
  operation: 'create' | 'read' | 'update' | 'delete' | 'list';
  recordId?: string;
  initialData?: any;
  onSuccess?: () => void;
}

export default function CrudModal({
  isOpen,
  onClose,
  model,
  operation,
  recordId,
  initialData,
  onSuccess
}: CrudModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [records, setRecords] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const { 
    loading, 
    error, 
    create, 
    read, 
    update, 
    remove, 
    list,
    clearError 
  } = useModelCrud({
    onSuccess: (result) => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onSuccess?.();
      
      if (operation === 'list') {
        setRecords(result.data || []);
      }
    }
  });

  useEffect(() => {
    if (isOpen) {
      clearError();
      setShowSuccess(false);
      
      if (operation === 'update' && initialData) {
        setFormData(initialData);
      } else if (operation === 'read' && recordId) {
        handleRead();
      } else if (operation === 'list') {
        handleList();
      } else {
        setFormData({});
      }
    }
  }, [isOpen, operation, recordId, initialData]);

  const handleRead = async () => {
    if (recordId) {
      const result = await read(model.name, recordId);
      if (result.success) {
        setFormData(result.data || {});
      }
    }
  };

  const handleList = async () => {
    const result = await list(model.name, { limit: 50 });
    if (result.success) {
      setRecords(result.data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (operation) {
      case 'create':
        await create(model.name, formData);
        break;
      case 'update':
        if (recordId) {
          await update(model.name, recordId, formData);
        }
        break;
      case 'delete':
        if (recordId) {
          await remove(model.name, recordId);
        }
        break;
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const renderField = (fieldName: string, field: AmplifyModelField, isReadOnly = false) => {
    const value = formData[fieldName] || '';
    
    const baseInputClass = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      isReadOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
    }`;

    switch (field.type) {
      case 'String':
      case 'ID':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className={baseInputClass}
            readOnly={isReadOnly}
            placeholder={field.isRequired ? 'Required' : 'Optional'}
          />
        );
      
      case 'Int':
      case 'Float':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className={baseInputClass}
            readOnly={isReadOnly}
            placeholder={field.isRequired ? 'Required' : 'Optional'}
          />
        );
      
      case 'Boolean':
        return (
          <select
            value={value.toString()}
            onChange={(e) => handleInputChange(fieldName, e.target.value === 'true')}
            className={baseInputClass}
            disabled={isReadOnly}
          >
            <option value="">Select...</option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      
      case 'AWSDateTime':
        return (
          <input
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className={baseInputClass}
            readOnly={isReadOnly}
          />
        );
      
      default:
        return (
          <textarea
            value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleInputChange(fieldName, parsed);
              } catch {
                handleInputChange(fieldName, e.target.value);
              }
            }}
            className={`${baseInputClass} h-20 resize-none`}
            readOnly={isReadOnly}
            placeholder={field.isRequired ? 'Required JSON' : 'Optional JSON'}
          />
        );
    }
  };

  const getModalTitle = () => {
    const operationMap = {
      create: 'Create',
      read: 'View',
      update: 'Edit',
      delete: 'Delete',
      list: 'List'
    };
    return `${operationMap[operation]} ${model.name}`;
  };

  const getModalIcon = () => {
    switch (operation) {
      case 'create': return <Plus className="h-5 w-5" />;
      case 'read': return <Eye className="h-5 w-5" />;
      case 'update': return <Edit className="h-5 w-5" />;
      case 'delete': return <Trash2 className="h-5 w-5" />;
      case 'list': return <Eye className="h-5 w-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {getModalIcon()}
            <h2 className="text-xl font-semibold text-gray-900">{getModalTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Operation completed successfully!
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {operation === 'list' ? (
            /* List View */
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Found {records.length} record(s)
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(model.fields).slice(0, 5).map(fieldName => (
                        <th key={fieldName} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {fieldName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record, index) => (
                      <tr key={record.id || index} className="hover:bg-gray-50">
                        {Object.keys(model.fields).slice(0, 5).map(fieldName => (
                          <td key={fieldName} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {typeof record[fieldName] === 'object' 
                              ? JSON.stringify(record[fieldName])
                              : String(record[fieldName] || '')
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : operation === 'delete' ? (
            /* Delete Confirmation */
            <div className="text-center py-8">
              <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {model.name} record? This action cannot be undone.
              </p>
              {recordId && (
                <p className="text-sm text-gray-500 mb-6">
                  Record ID: <span className="font-mono">{recordId}</span>
                </p>
              )}
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(model.fields).map(([fieldName, field]) => (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {fieldName}
                      {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                      {field.isReadOnly && <span className="text-gray-400 ml-1">(read-only)</span>}
                    </label>
                    {renderField(fieldName, field, operation === 'read' || field.isReadOnly)}
                    <div className="mt-1 text-xs text-gray-500">
                      Type: {field.type} {field.isArray && '[]'}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {operation === 'read' || operation === 'list' ? 'Close' : 'Cancel'}
          </button>
          
          {operation !== 'read' && operation !== 'list' && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${
                operation === 'delete'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  {operation === 'delete' ? <Trash2 className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  {operation === 'create' ? 'Create' : operation === 'update' ? 'Update' : 'Delete'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
