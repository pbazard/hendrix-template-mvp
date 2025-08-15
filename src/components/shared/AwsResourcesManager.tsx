'use client';

import React, { useState } from 'react';
import { RefreshCw, Settings, Eye, EyeOff, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAwsResourcesAutoSync } from '@/hooks/useAwsResourcesAutoSync';

interface AwsResourcesManagerProps {
  className?: string;
  showControls?: boolean;
  onResourcesChanged?: (count: number) => void;
}

export function AwsResourcesManager({ 
  className = '', 
  showControls = true,
  onResourcesChanged 
}: AwsResourcesManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    activeSource,
    config,
    stats,
    loading,
    error,
    toggleDataSource,
    refreshRealResources,
  } = useAwsResourcesAutoSync({
    useRealResources: true,
    autoRefreshInterval: 30000,
    onResourcesChanged: (resources) => {
      if (onResourcesChanged) {
        onResourcesChanged(resources.length);
      }
    }
  });

  const getStatusColor = () => {
    if (loading) return 'text-yellow-600';
    if (error) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusIcon = () => {
    if (loading) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (error) return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (loading) return 'Synchronisation...';
    if (error) return 'Erreur de synchronisation';
    return 'Synchronisé';
  };

  return (
    <div className={`border-t bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-2">
        {/* Barre de statut compacte */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Activity className="h-4 w-4" />
              <span>{stats.totalResources} ressources AWS</span>
            </div>

            <div className="text-gray-500">
              Source: {activeSource === 'real' ? 'Amplify (Réel)' : 'Mock Data'}
            </div>
          </div>

          {showControls && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshRealResources}
                disabled={loading}
                className="h-8 px-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDataSource}
                className="h-8 px-2"
              >
                {activeSource === 'real' ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 px-2"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Panneau d'informations détaillées */}
        {isExpanded && (
          <Card className="mt-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Statistiques générales */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Statistiques</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Total ressources:</span>
                    <span className="font-mono">{stats.totalResources}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Services AWS:</span>
                    <span className="font-mono">{stats.totalServices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-refresh:</span>
                    <span className={`font-mono ${config.autoRefreshEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                      {config.autoRefreshEnabled ? 'Activé' : 'Désactivé'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Répartition par service */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Par Service</h4>
                <div className="space-y-1 text-xs">
                  {stats.resourcesByService.map(({ service, count }) => (
                    <div key={service} className="flex justify-between">
                      <span>{service}:</span>
                      <span className="font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Configuration</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Source:</span>
                    <span className="font-mono">
                      {config.isUsingRealResources ? 'Amplify' : 'Mock'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intervalle:</span>
                    <span className="font-mono">{config.refreshInterval / 1000}s</span>
                  </div>
                  {error && (
                    <div className="text-red-600 text-xs mt-2">
                      <strong>Erreur:</strong> {stats.errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDataSource}
              >
                Basculer vers {activeSource === 'real' ? 'Mock' : 'Amplify'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshRealResources}
                disabled={loading}
              >
                {loading ? 'Synchronisation...' : 'Actualiser'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
