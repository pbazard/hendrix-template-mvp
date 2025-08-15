import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAwsResources } from '../useAwsResources'

// Mock setTimeout to control timing in tests
vi.useFakeTimers()

describe('useAwsResources', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  it('starts with loading state', () => {
    const { result } = renderHook(() => useAwsResources())
    
    expect(result.current.loading).toBe(true)
    expect(result.current.resources).toEqual([])
    expect(result.current.resourcesByService).toEqual({})
    expect(result.current.error).toBe(null)
  })

  it('loads resources successfully', async () => {
    const { result } = renderHook(() => useAwsResources())
    
    // Fast-forward time to complete the mock API call
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.resources.length).toBeGreaterThan(0)
    expect(result.current.resourcesByService).toBeDefined()
    expect(result.current.error).toBe(null)
  })

  it('groups resources by service correctly', async () => {
    const { result } = renderHook(() => useAwsResources())
    
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    const services = Object.keys(result.current.resourcesByService)
    expect(services).toContain('DynamoDB')
    expect(services).toContain('IAM')
    expect(services).toContain('Cognito')
    expect(services).toContain('AppSync')
    expect(services).toContain('Lambda')
    expect(services).toContain('CloudFormation')
    expect(services).toContain('S3')
  })

  it('provides correct resource and service counts', async () => {
    const { result } = renderHook(() => useAwsResources())
    
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.getResourceCount()).toBe(9) // Total mock resources
    expect(result.current.getServiceCount()).toBe(7) // Total services
  })

  it('gets resources by service correctly', async () => {
    const { result } = renderHook(() => useAwsResources())
    
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    const dynamoResources = result.current.getResourcesByService('DynamoDB')
    expect(dynamoResources).toHaveLength(1)
    expect(dynamoResources[0].name).toBe('Todo-dev')
    
    const iamResources = result.current.getResourcesByService('IAM')
    expect(iamResources).toHaveLength(2)
    
    const nonExistentResources = result.current.getResourcesByService('NonExistent')
    expect(nonExistentResources).toEqual([])
  })

  it('handles DynamoDB resources correctly', async () => {
    const { result } = renderHook(() => useAwsResources())
    
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    const dynamoResources = result.current.resourcesByService['DynamoDB']
    expect(dynamoResources).toBeDefined()
    expect(dynamoResources[0]).toMatchObject({
      id: 'todo-table-dev',
      name: 'Todo-dev',
      type: 'Table',
      service: 'DynamoDB',
      region: 'us-east-1',
      status: 'Active'
    })
  })

  it('handles IAM resources correctly', async () => {
    const { result } = renderHook(() => useAwsResources())
    
    vi.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    const iamResources = result.current.resourcesByService['IAM']
    expect(iamResources).toBeDefined()
    expect(iamResources).toHaveLength(2)
    expect(iamResources.every(resource => resource.service === 'IAM')).toBe(true)
    expect(iamResources.every(resource => resource.region === 'Global')).toBe(true)
  })
})
