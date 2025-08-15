import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AwsResourcesFooter } from '../AwsResourcesFooter'

// Mock the custom hook
vi.mock('@/hooks/useAwsResources', () => ({
  useAwsResources: () => ({
    resourcesByService: {
      'DynamoDB': [
        {
          id: 'todo-table-dev',
          name: 'Todo-dev',
          type: 'Table',
          service: 'DynamoDB',
          region: 'us-east-1',
          status: 'Active',
          description: 'Main Todo items storage table'
        }
      ],
      'IAM': [
        {
          id: 'amplify-execution-role',
          name: 'amplify-todo-app-execution-role',
          type: 'Role',
          service: 'IAM',
          region: 'Global',
          status: 'Active',
          description: 'Execution role for Amplify functions'
        }
      ]
    },
    loading: false,
    error: null,
    getResourceCount: () => 2,
    getServiceCount: () => 2,
    getResourcesByService: () => []
  })
}))

describe('AwsResourcesFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders AWS resources summary button', () => {
    render(<AwsResourcesFooter />)
    expect(screen.getByText(/AWS Resources \(2 resources, 2 services\)/)).toBeInTheDocument()
  })

  it('expands to show resource details when clicked', () => {
    render(<AwsResourcesFooter />)
    
    const expandButton = screen.getByText(/AWS Resources \(2 resources, 2 services\)/)
    fireEvent.click(expandButton)
    
    expect(screen.getByText('AWS Resources Created by Amplify')).toBeInTheDocument()
    expect(screen.getByText('DynamoDB')).toBeInTheDocument()
    expect(screen.getByText('IAM')).toBeInTheDocument()
  })

  it('shows service names when expanded', () => {
    render(<AwsResourcesFooter />)
    
    const expandButton = screen.getByText(/AWS Resources \(2 resources, 2 services\)/)
    fireEvent.click(expandButton)
    
    expect(screen.getByText('DynamoDB')).toBeInTheDocument()
    expect(screen.getByText('IAM')).toBeInTheDocument()
  })
})
