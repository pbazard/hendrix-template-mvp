import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAwsResourcesReal } from '../useAwsResourcesReal';

// Mock du module amplify_outputs.json
vi.mock('@/amplify_outputs.json', () => ({
  default: {
    auth: {
      user_pool_id: 'us-east-1_ABC123',
      identity_pool_id: 'us-east-1:xyz-abc-123',
    },
    data: {
      url: 'https://api123.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
    },
    storage: {
      bucket_name: 'amplify-app-bucket-123',
      region: 'us-east-1',
    }
  }
}));

describe('useAwsResourcesReal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load real AWS resources from amplify_outputs.json', async () => {
    const { result } = renderHook(() => useAwsResourcesReal());

    // Au début, loading devrait être true
    expect(result.current.loading).toBe(true);
    expect(result.current.resources).toEqual([]);

    // Attendre que les ressources soient chargées
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vérifier que les ressources sont chargées
    expect(result.current.resources.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();

    // Vérifier qu'on a bien des ressources de différents services
    const services = Array.from(new Set(result.current.resources.map(r => r.service)));
    expect(services).toContain('Cognito');
    expect(services).toContain('AppSync');
    expect(services).toContain('S3');
  });

  it('should generate correct ARNs for resources', async () => {
    const { result } = renderHook(() => useAwsResourcesReal());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vérifier les ARNs générés
    const userPoolResource = result.current.resources.find(r => 
      r.service === 'Cognito' && r.type === 'User Pool'
    );
    expect(userPoolResource?.arn).toMatch(/^arn:aws:cognito-idp:us-east-1:\d+:userpool\/us-east-1_ABC123$/);

    const s3Resource = result.current.resources.find(r => 
      r.service === 'S3'
    );
    expect(s3Resource?.arn).toMatch(/^arn:aws:s3:::amplify-app-bucket-123$/);
  });

  it('should generate correct console URLs', async () => {
    const { result } = renderHook(() => useAwsResourcesReal());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vérifier les URLs de console générées
    const appSyncResource = result.current.resources.find(r => 
      r.service === 'AppSync'
    );
    expect(appSyncResource?.consoleUrl).toContain('console.aws.amazon.com/appsync');
    expect(appSyncResource?.consoleUrl).toContain('region=us-east-1');
  });

  it('should group resources by service correctly', async () => {
    const { result } = renderHook(() => useAwsResourcesReal());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Vérifier le groupement par service
    expect(result.current.resourcesByService).toHaveProperty('Cognito');
    expect(result.current.resourcesByService).toHaveProperty('AppSync');
    expect(result.current.resourcesByService).toHaveProperty('S3');

    // Vérifier que Cognito a bien 2 ressources (User Pool et Identity Pool)
    expect(result.current.resourcesByService.Cognito).toHaveLength(2);
  });

  it('should provide utility functions', async () => {
    const { result } = renderHook(() => useAwsResourcesReal());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Tester les fonctions utilitaires
    expect(result.current.getResourceCount()).toBeGreaterThan(0);
    expect(result.current.getServiceCount()).toBeGreaterThan(0);
    
    const cognitoResources = result.current.getResourcesByService('Cognito');
    expect(cognitoResources).toHaveLength(2);
    
    const nonExistentResources = result.current.getResourcesByService('NonExistent');
    expect(nonExistentResources).toHaveLength(0);
  });

  it('should handle missing amplify_outputs.json gracefully', async () => {
    // Mock l'échec du chargement du fichier de configuration
    vi.doMock('@/amplify_outputs.json', () => {
      throw new Error('Module not found');
    });

    const { result } = renderHook(() => useAwsResourcesReal());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Devrait avoir des ressources d'exemple même sans configuration
    expect(result.current.resources.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();

    // Devrait avoir au moins une ressource d'exemple
    const exampleResource = result.current.resources.find(r => 
      r.description?.includes('Example')
    );
    expect(exampleResource).toBeDefined();
  });
});
