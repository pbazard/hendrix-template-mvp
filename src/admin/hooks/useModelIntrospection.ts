/**
 * Hook for model introspection in admin interface
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ModelIntrospectionService, ModelIntrospectionResult, AmplifyModel, AdminModel } from '../services/modelIntrospection';

export interface UseModelIntrospectionReturn {
  data: ModelIntrospectionResult | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getAmplifyModel: (name: string) => AmplifyModel | undefined;
  getAdminModel: (name: string) => AdminModel | undefined;
  getAllModels: () => (AmplifyModel | AdminModel)[];
  searchModels: (query: string) => (AmplifyModel | AdminModel)[];
}

export function useModelIntrospection(): UseModelIntrospectionReturn {
  const [data, setData] = useState<ModelIntrospectionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const service = ModelIntrospectionService.getInstance();
      const result = await service.getModelIntrospection();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load model introspection';
      setError(errorMessage);
      console.error('Model introspection error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getAmplifyModel = useCallback((name: string): AmplifyModel | undefined => {
    return data?.amplifyModels.find(model => model.name === name);
  }, [data]);

  const getAdminModel = useCallback((name: string): AdminModel | undefined => {
    return data?.adminModels.find(model => model.name === name);
  }, [data]);

  const getAllModels = useCallback((): (AmplifyModel | AdminModel)[] => {
    if (!data) return [];
    return [...data.amplifyModels, ...data.adminModels];
  }, [data]);

  const searchModels = useCallback((query: string): (AmplifyModel | AdminModel)[] => {
    if (!data || !query.trim()) return getAllModels();
    
    const searchTerm = query.toLowerCase();
    const allModels = getAllModels();
    
    return allModels.filter(model => 
      model.name.toLowerCase().includes(searchTerm) ||
      ('verbose_name' in model && model.verbose_name.toLowerCase().includes(searchTerm)) ||
      ('pluralName' in model && model.pluralName.toLowerCase().includes(searchTerm))
    );
  }, [data, getAllModels]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    getAmplifyModel,
    getAdminModel,
    getAllModels,
    searchModels
  };
}
