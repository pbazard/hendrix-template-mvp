'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAwsResources } from './useAwsResources';
import { useAwsResourcesReal } from './useAwsResourcesReal';
import { AwsResource, AwsResourcesByService } from './useAwsResources';

interface UseAwsResourcesAutoSyncOptions {
  useRealResources?: boolean;
  autoRefreshInterval?: number; // en millisecondes
  onResourcesChanged?: (resources: AwsResource[]) => void;
}

export function useAwsResourcesAutoSync(options: UseAwsResourcesAutoSyncOptions = {}) {
  const {
    useRealResources = true,
    autoRefreshInterval = 30000, // 30 secondes par défaut
    onResourcesChanged
  } = options;

  // Hooks pour les données mock et réelles
  const mockResources = useAwsResources();
  const realResources = useAwsResourcesReal();

  // État pour gérer la source de données active
  const [activeSource, setActiveSource] = useState<'mock' | 'real'>(useRealResources ? 'real' : 'mock');
  const [lastResourceCount, setLastResourceCount] = useState(0);

  // Fonction pour basculer entre les sources
  const toggleDataSource = useCallback(() => {
    setActiveSource(prev => prev === 'mock' ? 'real' : 'mock');
  }, []);

  // Fonction pour forcer un refresh des données réelles
  const refreshRealResources = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  // Sélection de la source de données active
  const currentResources = activeSource === 'real' ? realResources : mockResources;

  // Auto-refresh pour les ressources réelles
  useEffect(() => {
    if (activeSource === 'real' && autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        refreshRealResources();
      }, autoRefreshInterval);

      return () => clearInterval(interval);
    }
  }, [activeSource, autoRefreshInterval, refreshRealResources]);

  // Détection des changements de ressources
  useEffect(() => {
    const currentCount = currentResources.getResourceCount();
    if (currentCount !== lastResourceCount && lastResourceCount > 0) {
      console.info(`AWS Resources count changed: ${lastResourceCount} → ${currentCount}`);
      if (onResourcesChanged) {
        onResourcesChanged(currentResources.resources);
      }
    }
    setLastResourceCount(currentCount);
  }, [currentResources.resources, lastResourceCount, onResourcesChanged, currentResources]);

  // Configuration actuelle
  const config = {
    isUsingRealResources: activeSource === 'real',
    isUsingMockResources: activeSource === 'mock',
    autoRefreshEnabled: autoRefreshInterval > 0,
    refreshInterval: autoRefreshInterval,
    lastUpdateTime: new Date().toISOString(),
  };

  // Statistiques
  const stats = {
    totalResources: currentResources.getResourceCount(),
    totalServices: currentResources.getServiceCount(),
    resourcesByService: Object.entries(currentResources.resourcesByService).map(([service, resources]) => ({
      service,
      count: resources.length
    })),
    isLoading: currentResources.loading,
    hasError: !!currentResources.error,
    errorMessage: currentResources.error,
  };

  return {
    // Données des ressources
    resources: currentResources.resources,
    resourcesByService: currentResources.resourcesByService,
    loading: currentResources.loading,
    error: currentResources.error,

    // Fonctions utilitaires
    getResourceCount: currentResources.getResourceCount,
    getServiceCount: currentResources.getServiceCount,
    getResourcesByService: currentResources.getResourcesByService,

    // Contrôles de source de données
    activeSource,
    toggleDataSource,
    refreshRealResources,

    // Configuration et métadonnées
    config,
    stats,

    // Fonctions de contrôle
    setUseRealResources: () => setActiveSource('real'),
    setUseMockResources: () => setActiveSource('mock'),
  };
}
