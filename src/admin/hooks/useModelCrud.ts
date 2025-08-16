/**
 * Hook for Model CRUD Operations
 * Provides easy access to Create, Read, Update, Delete operations
 */

'use client';

import { useState, useCallback } from 'react';
import { ModelCrudService, CrudResult } from '../services/modelCrud';

export interface UseCrudOptions {
  onSuccess?: (result: CrudResult) => void;
  onError?: (error: string) => void;
}

export function useModelCrud(options?: UseCrudOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<CrudResult | null>(null);

  const crudService = ModelCrudService.getInstance();

  const handleResult = useCallback((result: CrudResult) => {
    setLastResult(result);
    if (result.success) {
      setError(null);
      options?.onSuccess?.(result);
    } else {
      setError(result.error || 'Operation failed');
      options?.onError?.(result.error || 'Operation failed');
    }
  }, [options]);

  const create = useCallback(async (modelName: string, data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await crudService.create(modelName, data);
      handleResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      options?.onError?.(error);
      return { success: false, error, operation: 'create', modelName };
    } finally {
      setLoading(false);
    }
  }, [crudService, handleResult, options]);

  const read = useCallback(async (modelName: string, id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await crudService.read(modelName, id);
      handleResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      options?.onError?.(error);
      return { success: false, error, operation: 'read', modelName };
    } finally {
      setLoading(false);
    }
  }, [crudService, handleResult, options]);

  const update = useCallback(async (modelName: string, id: string, data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await crudService.update(modelName, id, data);
      handleResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      options?.onError?.(error);
      return { success: false, error, operation: 'update', modelName };
    } finally {
      setLoading(false);
    }
  }, [crudService, handleResult, options]);

  const remove = useCallback(async (modelName: string, id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await crudService.delete(modelName, id);
      handleResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      options?.onError?.(error);
      return { success: false, error, operation: 'delete', modelName };
    } finally {
      setLoading(false);
    }
  }, [crudService, handleResult, options]);

  const list = useCallback(async (modelName: string, options?: { filter?: any; limit?: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await crudService.list(modelName, options);
      handleResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      setError(error);
      return { success: false, error, operation: 'list', modelName };
    } finally {
      setLoading(false);
    }
  }, [crudService, handleResult]);

  const getAvailableOperations = useCallback((modelName: string) => {
    return crudService.getAvailableOperations(modelName);
  }, [crudService]);

  const validateData = useCallback((modelName: string, data: any, operation: 'create' | 'update') => {
    return crudService.validateData(modelName, data, operation);
  }, [crudService]);

  return {
    // State
    loading,
    error,
    lastResult,
    
    // Operations
    create,
    read,
    update,
    remove,
    list,
    
    // Utilities
    getAvailableOperations,
    validateData,
    
    // Clear functions
    clearError: () => setError(null),
    clearResult: () => setLastResult(null)
  };
}
