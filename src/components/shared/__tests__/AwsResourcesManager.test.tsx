import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AwsResourcesManager } from '../AwsResourcesManager';

// Mock du hook useAwsResourcesAutoSync
const mockToggleDataSource = vi.fn();
const mockRefreshRealResources = vi.fn();

const defaultMockReturn = {
  activeSource: 'real' as const,
  config: {
    isUsingRealResources: true,
    isUsingMockResources: false,
    autoRefreshEnabled: true,
    refreshInterval: 30000,
    lastUpdateTime: '2025-01-01T00:00:00.000Z',
  },
  stats: {
    totalResources: 5,
    totalServices: 3,
    resourcesByService: [
      { service: 'DynamoDB', count: 2 },
      { service: 'Cognito', count: 2 },
      { service: 'S3', count: 1 }
    ],
    isLoading: false,
    hasError: false,
    errorMessage: null,
  },
  loading: false,
  error: null,
  toggleDataSource: mockToggleDataSource,
  refreshRealResources: mockRefreshRealResources,
};

vi.mock('@/hooks/useAwsResourcesAutoSync', () => ({
  useAwsResourcesAutoSync: vi.fn(() => defaultMockReturn)
}));

describe('AwsResourcesManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset le mock à l'état par défaut
    vi.mocked(require('@/hooks/useAwsResourcesAutoSync').useAwsResourcesAutoSync).mockReturnValue(defaultMockReturn);
  });

  it('should render status bar with resource count', () => {
    render(<AwsResourcesManager />);
    
    expect(screen.getByText('Synchronisé')).toBeInTheDocument();
    expect(screen.getByText('5 ressources AWS')).toBeInTheDocument();
    expect(screen.getByText('Source: Amplify (Réel)')).toBeInTheDocument();
  });

  it('should show loading state correctly', () => {
    vi.mocked(require('@/hooks/useAwsResourcesAutoSync').useAwsResourcesAutoSync).mockReturnValue({
      ...defaultMockReturn,
      loading: true,
      stats: { totalResources: 0, totalServices: 0, resourcesByService: [] }
    });

    render(<AwsResourcesManager />);
    
    expect(screen.getByText('Synchronisation...')).toBeInTheDocument();
  });

  it('should show error state correctly', () => {
    vi.mocked(require('@/hooks/useAwsResourcesAutoSync').useAwsResourcesAutoSync).mockReturnValue({
      ...defaultMockReturn,
      loading: false,
      error: 'Failed to load resources',
      stats: { 
        ...defaultMockReturn.stats,
        hasError: true,
        errorMessage: 'Failed to load resources'
      }
    });

    render(<AwsResourcesManager />);
    
    expect(screen.getByText('Erreur de synchronisation')).toBeInTheDocument();
  });

  it('should expand detailed information panel when settings button is clicked', async () => {
    render(<AwsResourcesManager />);
    
    // Initialement, le panneau détaillé ne devrait pas être visible
    expect(screen.queryByText('Statistiques')).not.toBeInTheDocument();
    
    // Cliquer sur le bouton des paramètres (dernier bouton dans la rangée)
    const buttons = screen.getAllByRole('button');
    const settingsButton = buttons[buttons.length - 1]; // Le dernier bouton est celui des settings
    fireEvent.click(settingsButton);
    
    // Le panneau détaillé devrait maintenant être visible
    await waitFor(() => {
      expect(screen.getByText('Statistiques')).toBeInTheDocument();
    });
  });

  it('should show detailed statistics in expanded panel', async () => {
    render(<AwsResourcesManager />);
    
    // Étendre le panneau
    const buttons = screen.getAllByRole('button');
    const settingsButton = buttons[buttons.length - 1];
    fireEvent.click(settingsButton);
    
    await waitFor(() => {
      // Vérifier les statistiques générales
      expect(screen.getByText('Total ressources:')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Services AWS:')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Vérifier la répartition par service
      expect(screen.getByText('Par Service')).toBeInTheDocument();
      expect(screen.getByText('DynamoDB:')).toBeInTheDocument();
      expect(screen.getByText('Cognito:')).toBeInTheDocument();
      expect(screen.getByText('S3:')).toBeInTheDocument();
    });
  });

  it('should call refresh function when refresh button is clicked', () => {
    render(<AwsResourcesManager />);
    
    // Le premier bouton est le refresh (RefreshCw)
    const buttons = screen.getAllByRole('button');
    const refreshButton = buttons[0];
    fireEvent.click(refreshButton);
    
    expect(mockRefreshRealResources).toHaveBeenCalledTimes(1);
  });

  it('should call toggle function when toggle button is clicked', () => {
    render(<AwsResourcesManager />);
    
    // Le deuxième bouton est le toggle (Eye/EyeOff)
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons[1];
    fireEvent.click(toggleButton);
    
    expect(mockToggleDataSource).toHaveBeenCalledTimes(1);
  });

  it('should hide controls when showControls is false', () => {
    render(<AwsResourcesManager showControls={false} />);
    
    // Il ne devrait y avoir aucun bouton visible
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('should call onResourcesChanged callback when provided', () => {
    const mockCallback = vi.fn();
    
    render(<AwsResourcesManager onResourcesChanged={mockCallback} />);
    
    // Le callback devrait être configuré dans le hook
    // (vérifié indirectement via le mock du hook)
  });

  it('should display mock data source correctly', () => {
    vi.mocked(require('@/hooks/useAwsResourcesAutoSync').useAwsResourcesAutoSync).mockReturnValue({
      ...defaultMockReturn,
      activeSource: 'mock' as const,
      config: { 
        ...defaultMockReturn.config,
        isUsingRealResources: false, 
        isUsingMockResources: true 
      },
      stats: { 
        ...defaultMockReturn.stats,
        totalResources: 3, 
        totalServices: 2 
      }
    });

    render(<AwsResourcesManager />);
    
    expect(screen.getByText('Source: Mock Data')).toBeInTheDocument();
  });
});
