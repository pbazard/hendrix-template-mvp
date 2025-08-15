import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAwsResourcesAutoSync } from '../useAwsResourcesAutoSync';

// Mock des hooks dependencies
vi.mock('../useAwsResources', () => ({
  useAwsResources: () => ({
    resources: [
      {
        id: 'mock-table',
        name: 'mock-table',
        type: 'Table',
        service: 'DynamoDB',
        region: 'us-east-1',
        status: 'Active',
        description: 'Mock DynamoDB table',
        arn: 'arn:aws:dynamodb:us-east-1:123456789012:table/mock-table',
        consoleUrl: 'https://console.aws.amazon.com/dynamodb'
      }
    ],
    resourcesByService: {
      'DynamoDB': [{
        id: 'mock-table',
        name: 'mock-table',
        type: 'Table',
        service: 'DynamoDB',
        region: 'us-east-1',
        status: 'Active',
        description: 'Mock DynamoDB table',
        arn: 'arn:aws:dynamodb:us-east-1:123456789012:table/mock-table',
        consoleUrl: 'https://console.aws.amazon.com/dynamodb'
      }]
    },
    loading: false,
    error: null,
    getResourceCount: () => 1,
    getServiceCount: () => 1,
    getResourcesByService: (service: string) => service === 'DynamoDB' ? [{}] : []
  })
}));

vi.mock('../useAwsResourcesReal', () => ({
  useAwsResourcesReal: () => ({
    resources: [
      {
        id: 'real-user-pool',
        name: 'real-user-pool',
        type: 'User Pool',
        service: 'Cognito',
        region: 'us-east-1',
        status: 'Active',
        description: 'Real Cognito User Pool',
        arn: 'arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_ABC123',
        consoleUrl: 'https://console.aws.amazon.com/cognito'
      }
    ],
    resourcesByService: {
      'Cognito': [{
        id: 'real-user-pool',
        name: 'real-user-pool',
        type: 'User Pool',
        service: 'Cognito',
        region: 'us-east-1',
        status: 'Active',
        description: 'Real Cognito User Pool',
        arn: 'arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_ABC123',
        consoleUrl: 'https://console.aws.amazon.com/cognito'
      }]
    },
    loading: false,
    error: null,
    getResourceCount: () => 1,
    getServiceCount: () => 1,
    getResourcesByService: (service: string) => service === 'Cognito' ? [{}] : []
  })
}));

describe('useAwsResourcesAutoSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should default to real resources when useRealResources is true', () => {
    const { result } = renderHook(() => useAwsResourcesAutoSync({
      useRealResources: true
    }));

    expect(result.current.activeSource).toBe('real');
    expect(result.current.config.isUsingRealResources).toBe(true);
    expect(result.current.config.isUsingMockResources).toBe(false);
  });

  it('should default to mock resources when useRealResources is false', () => {
    const { result } = renderHook(() => useAwsResourcesAutoSync({
      useRealResources: false
    }));

    expect(result.current.activeSource).toBe('mock');
    expect(result.current.config.isUsingRealResources).toBe(false);
    expect(result.current.config.isUsingMockResources).toBe(true);
  });

  it('should toggle data source correctly', () => {
    const { result } = renderHook(() => useAwsResourcesAutoSync({
      useRealResources: true
    }));

    expect(result.current.activeSource).toBe('real');

    // Toggle to mock
    result.current.toggleDataSource();
    expect(result.current.activeSource).toBe('mock');

    // Toggle back to real
    result.current.toggleDataSource();
    expect(result.current.activeSource).toBe('real');
  });

  it('should provide correct stats based on active source', () => {
    const { result } = renderHook(() => useAwsResourcesAutoSync({
      useRealResources: true
    }));

    // Avec les données réelles
    expect(result.current.stats.totalResources).toBe(1);
    expect(result.current.stats.totalServices).toBe(1);
    expect(result.current.stats.resourcesByService).toEqual([
      { service: 'Cognito', count: 1 }
    ]);

    // Basculer vers mock
    result.current.toggleDataSource();
    
    expect(result.current.stats.totalResources).toBe(1);
    expect(result.current.stats.totalServices).toBe(1);
    expect(result.current.stats.resourcesByService).toEqual([
      { service: 'DynamoDB', count: 1 }
    ]);
  });

  it('should call onResourcesChanged callback when resources change', async () => {
    const onResourcesChanged = vi.fn();
    
    const { result, rerender } = renderHook(() => useAwsResourcesAutoSync({
      useRealResources: true,
      onResourcesChanged
    }));

    // Attendre l'initialisation
    await waitFor(() => {
      expect(result.current.stats.totalResources).toBe(1);
    });

    // Le callback devrait être appelé au changement
    result.current.toggleDataSource();
    
    await waitFor(() => {
      expect(onResourcesChanged).toHaveBeenCalled();
    });
  });

  it('should provide utility functions for data source control', () => {
    const { result } = renderHook(() => useAwsResourcesAutoSync());

    // Tester setUseRealResources
    result.current.setUseRealResources();
    expect(result.current.activeSource).toBe('real');

    // Tester setUseMockResources
    result.current.setUseMockResources();
    expect(result.current.activeSource).toBe('mock');
  });

  it('should configure auto-refresh interval correctly', () => {
    const { result } = renderHook(() => useAwsResourcesAutoSync({
      autoRefreshInterval: 10000
    }));

    expect(result.current.config.autoRefreshEnabled).toBe(true);
    expect(result.current.config.refreshInterval).toBe(10000);
  });

  it('should disable auto-refresh when interval is 0', () => {
    const { result } = renderHook(() => useAwsResourcesAutoSync({
      autoRefreshInterval: 0
    }));

    expect(result.current.config.autoRefreshEnabled).toBe(false);
    expect(result.current.config.refreshInterval).toBe(0);
  });

  it('should provide correct resource access functions', () => {
    const { result } = renderHook(() => useAwsResourcesAutoSync({
      useRealResources: true
    }));

    // Tester les fonctions utilitaires
    expect(result.current.getResourceCount()).toBe(1);
    expect(result.current.getServiceCount()).toBe(1);
    
    const cognitoResources = result.current.getResourcesByService('Cognito');
    expect(cognitoResources).toHaveLength(1);
    
    const nonExistentResources = result.current.getResourcesByService('NonExistent');
    expect(nonExistentResources).toHaveLength(0);
  });
});
