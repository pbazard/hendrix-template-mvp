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
          description: 'Main Todo items storage table',
          arn: 'arn:aws:dynamodb:us-east-1:123456789012:table/Todo-dev',
          consoleUrl: 'https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#table?name=Todo-dev'
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
          description: 'Execution role for Amplify functions',
          arn: 'arn:aws:iam::123456789012:role/amplify-todo-app-execution-role',
          consoleUrl: 'https://console.aws.amazon.com/iam/home#/roles/amplify-todo-app-execution-role'
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

  it('shows console links and ARNs when service is expanded', () => {
    render(<AwsResourcesFooter />)
    
    // Expand main section
    const expandButton = screen.getByText(/AWS Resources \(2 resources, 2 services\)/)
    fireEvent.click(expandButton)
    
    // Expand DynamoDB service
    const dynamoButton = screen.getByText('DynamoDB')
    fireEvent.click(dynamoButton)
    
    // Should show ARN and Console button
    expect(screen.getByText(/arn:aws:dynamodb:us-east-1:123456789012:table\/Todo-dev/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Console/ })).toBeInTheDocument()
  })
})
