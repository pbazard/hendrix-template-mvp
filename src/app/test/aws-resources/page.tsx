'use client';

import React from 'react';
import { useAwsResourcesReal } from '@/hooks/useAwsResourcesReal';

export default function TestAwsResourcesPage() {
  const { resources, loading, error, resourcesByService } = useAwsResourcesReal();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Test AWS Resources Real</h1>
        <p>Chargement des ressources...</p>
        <p className="text-sm text-gray-600">Regardez la console du navigateur pour les logs de débogage</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Test AWS Resources Real - Erreur</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Test AWS Resources Real</h1>
      <p className="text-sm text-gray-600 mb-4">
        Regardez la console du navigateur pour les logs de débogage
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Statistiques</h2>
          <ul className="space-y-1 text-sm">
            <li><strong>Total ressources:</strong> {resources.length}</li>
            <li><strong>Services:</strong> {Object.keys(resourcesByService).length}</li>
            <li><strong>Services trouvés:</strong> {Object.keys(resourcesByService).join(', ') || 'Aucun'}</li>
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Répartition par service</h2>
          {Object.keys(resourcesByService).length > 0 ? (
            <ul className="space-y-1 text-sm">
              {Object.entries(resourcesByService).map(([service, resources]) => (
                <li key={service}>
                  <strong>{service}:</strong> {resources.length} ressource(s)
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Aucune ressource détectée</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Détail des ressources ({resources.length})</h2>
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(resource => (
              <div key={resource.id} className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{resource.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {resource.service}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Type:</strong> {resource.type}</p>
                  <p><strong>Région:</strong> {resource.region}</p>
                  <p><strong>Statut:</strong> {resource.status}</p>
                  <p><strong>Description:</strong> {resource.description}</p>
                  <p className="break-all"><strong>ARN:</strong> {resource.arn}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Aucune ressource détectée. Vérifiez la console du navigateur pour les logs de débogage.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Debug: Raw Data</h3>
        <pre className="text-xs overflow-auto bg-white p-2 rounded border max-h-64">
          {JSON.stringify({ resources, resourcesByService }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
