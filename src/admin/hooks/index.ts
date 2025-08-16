import { useState, useEffect, useCallback } from 'react';
import { CognitoUser, ActionType } from '../types';
import { CognitoAuthService } from '../services/auth';

// Export model introspection hook
export { useModelIntrospection } from './useModelIntrospection';
export type { UseModelIntrospectionReturn } from './useModelIntrospection';

/**
 * Hook pour gérer l'authentification dans l'admin
 */
export const useAdminAuth = () => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const currentUser = await CognitoAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const signOut = useCallback(async () => {
    try {
      await CognitoAuthService.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de déconnexion');
    }
  }, []);

  const hasPermission = useCallback((action: ActionType, modelName: string) => {
    if (!user) return false;
    return CognitoAuthService.hasPermission(user, action, modelName);
  }, [user]);

  return {
    user,
    loading,
    error,
    signOut,
    hasPermission,
    isAuthenticated: !!user,
    isAdmin: user?.groups.includes('administrators') || false,
    isStaff: user?.groups.includes('staff') || false
  };
};

/**
 * Hook pour gérer la sélection multiple
 */
export const useSelection = (keyField = 'id') => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((item: any) => {
    const id = item[keyField];
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, [keyField]);

  const toggleAll = useCallback((items: any[]) => {
    const allIds = items.map(item => item[keyField]);
    const allSelected = allIds.every(id => selectedIds.has(id));
    
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }, [selectedIds, keyField]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((item: any) => {
    const id = item[keyField];
    return selectedIds.has(id);
  }, [selectedIds, keyField]);

  const isAllSelected = useCallback((items: any[]) => {
    return items.length > 0 && items.every(item => isSelected(item));
  }, [isSelected]);

  return {
    selectedIds: Array.from(selectedIds),
    selectedCount: selectedIds.size,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected
  };
};

/**
 * Hook pour gérer l'état de chargement et d'erreur
 */
export const useAsyncState = <T>(initialValue: T | null = null) => {
  const [data, setData] = useState<T | null>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialValue);
    setError(null);
    setLoading(false);
  }, [initialValue]);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
};

/**
 * Hook pour gérer la pagination
 */
export const usePagination = (initialLimit = 20) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    limit,
    offset,
    total,
    totalPages,
    setLimit,
    setTotal,
    goToPage,
    nextPage,
    prevPage,
    reset,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};
