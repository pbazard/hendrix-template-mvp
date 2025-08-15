'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, Eye, Code, Copy } from 'lucide-react';
import { useAwsResourcesReal } from '@/hooks/useAwsResourcesReal';
import { useAwsResourcesAutoSync } from '@/hooks/useAwsResourcesAutoSync';

export default function AwsResourcesDiagnosticPage() {
  const [amplifyConfig, setAmplifyConfig] = useState<any>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const realResources = useAwsResourcesReal();
  const autoSyncResources = useAwsResourcesAutoSync();

  useEffect(() => {
    // Charger la configuration Amplify pour diagnostic
    const loadConfig = async () => {
      try {
        const config = await import('@/amplify_outputs.json');
        setAmplifyConfig(config.default || config);
      } catch (error) {
        setConfigError(error instanceof Error ? error.message : 'Failed to load config');
      }
    };
    loadConfig();
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Database className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Diagnostic AWS Resources</h1>
          <p className="text-muted-foreground">
            Diagnostic complet de la détection des ressources AWS Amplify
          </p>
        </div>
      </div>

      {/* État de la configuration Amplify */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Configuration Amplify (amplify_outputs.json)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {configError ? (
            <div className="text-red-600">
              <strong>Erreur de chargement:</strong> {configError}
            </div>
          ) : amplifyConfig ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Authentification</h4>
                  <div className="space-y-1 text-xs">
                    <div>User Pool ID: <code className="bg-gray-100 px-1 rounded">{amplifyConfig.auth?.user_pool_id || 'N/A'}</code></div>
                    <div>Identity Pool ID: <code className="bg-gray-100 px-1 rounded">{amplifyConfig.auth?.identity_pool_id || 'N/A'}</code></div>
                    <div>Région: <code className="bg-gray-100 px-1 rounded">{amplifyConfig.auth?.aws_region || amplifyConfig.data?.aws_region || 'N/A'}</code></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">API GraphQL</h4>
                  <div className="space-y-1 text-xs">
                    <div>URL: <code className="bg-gray-100 px-1 rounded text-xs break-all">{amplifyConfig.data?.url || 'N/A'}</code></div>
                    <div>Région: <code className="bg-gray-100 px-1 rounded">{amplifyConfig.data?.aws_region || amplifyConfig.data?.region || 'N/A'}</code></div>
                    <div>Auth Type: <code className="bg-gray-100 px-1 rounded">{amplifyConfig.data?.default_authorization_type || 'N/A'}</code></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Modèles de données</h4>
                  <div className="space-y-1 text-xs">
                    {amplifyConfig.data?.model_introspection?.models ? (
                      Object.keys(amplifyConfig.data.model_introspection.models).map(modelName => (
                        <div key={modelName}>
                          <Badge variant="outline" className="text-xs">
                            {modelName}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div>Aucun modèle détecté</div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(amplifyConfig, null, 2), 'config')}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied === 'config' ? 'Copié!' : 'Copier la configuration complète'}
                </Button>
              </div>
            </div>
          ) : (
            <div>Chargement de la configuration...</div>
          )}
        </CardContent>
      </Card>

      {/* État des hooks de ressources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hook useAwsResourcesReal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              useAwsResourcesReal
              <Badge variant={realResources.loading ? 'secondary' : realResources.error ? 'destructive' : 'default'}>
                {realResources.loading ? 'Loading' : realResources.error ? 'Error' : 'Ready'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Ressources détectées:</strong> {realResources.resources.length}
                </div>
                <div>
                  <strong>Services:</strong> {realResources.getServiceCount()}
                </div>
              </div>

              {realResources.error && (
                <div className="text-red-600 text-sm">
                  <strong>Erreur:</strong> {realResources.error}
                </div>
              )}

              <div>
                <h5 className="font-semibold text-sm mb-2">Ressources par service:</h5>
                <div className="space-y-2">
                  {Object.entries(realResources.resourcesByService).map(([service, resources]) => (
                    <div key={service} className="flex items-center justify-between">
                      <span className="text-sm">{service}:</span>
                      <Badge variant="outline">{resources.length}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-sm mb-2">Détail des ressources:</h5>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {realResources.resources.map(resource => (
                    <div key={resource.id} className="border rounded p-2 text-xs">
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-gray-600">{resource.service} - {resource.type}</div>
                      <div className="text-gray-500 truncate">{resource.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hook useAwsResourcesAutoSync */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              useAwsResourcesAutoSync
              <Badge variant={autoSyncResources.loading ? 'secondary' : autoSyncResources.error ? 'destructive' : 'default'}>
                {autoSyncResources.activeSource === 'real' ? 'Live' : 'Demo'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Source active:</strong> {autoSyncResources.activeSource}
                </div>
                <div>
                  <strong>Auto-refresh:</strong> {autoSyncResources.config.autoRefreshEnabled ? 'Activé' : 'Désactivé'}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-sm mb-2">Statistiques:</h5>
                <div className="space-y-1 text-sm">
                  <div>Total ressources: {autoSyncResources.stats.totalResources}</div>
                  <div>Total services: {autoSyncResources.stats.totalServices}</div>
                  <div>Status: {autoSyncResources.stats.isLoading ? 'Chargement' : autoSyncResources.stats.hasError ? 'Erreur' : 'OK'}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={autoSyncResources.toggleDataSource}
                >
                  Basculer vers {autoSyncResources.activeSource === 'real' ? 'Demo' : 'Live'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={autoSyncResources.refreshRealResources}
                  disabled={autoSyncResources.loading}
                >
                  <RefreshCw className={`h-4 w-4 ${autoSyncResources.loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diagnostic des modèles DynamoDB */}
      {amplifyConfig?.data?.model_introspection?.models && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Diagnostic DynamoDB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(amplifyConfig.data.model_introspection.models).map(([modelName, modelInfo]: [string, any]) => (
                <div key={modelName} className="border rounded p-4">
                  <h4 className="font-semibold mb-2">Modèle: {modelName}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Champs ({Object.keys(modelInfo.fields).length}):</strong>
                      <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                        {Object.entries(modelInfo.fields).map(([fieldName, fieldInfo]: [string, any]) => (
                          <li key={fieldName}>
                            <code>{fieldName}</code>: {fieldInfo.type}
                            {fieldInfo.isRequired && <Badge variant="outline" className="ml-1 text-xs">Required</Badge>}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Informations:</strong>
                      <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                        <li>Nom pluriel: {modelInfo.pluralName}</li>
                        <li>Synchronisable: {modelInfo.syncable ? 'Oui' : 'Non'}</li>
                        <li>Clé primaire: {modelInfo.primaryKeyInfo?.primaryKeyFieldName || 'id'}</li>
                        <li>Attributs: {modelInfo.attributes?.length || 0}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
