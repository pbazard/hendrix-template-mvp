import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '@/app/page'

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}))

// Mock AWS Amplify
vi.mock('aws-amplify/data', () => ({
  generateClient: vi.fn(() => ({
    models: {
      Todo: {
        observeQuery: vi.fn(() => ({
          subscribe: vi.fn((callback) => {
            callback.next({ items: [] })
            return { unsubscribe: vi.fn() }
          }),
        })),
        create: vi.fn(),
      },
    },
  })),
}))

vi.mock('aws-amplify', () => ({
  Amplify: {
    configure: vi.fn(),
  },
}))

vi.mock('../../amplify_outputs.json', () => ({}))
vi.mock('@aws-amplify/ui-react/styles.css', () => ({}))

describe('Home Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: '🚀 Hendrix MVP Template' })).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<Home />)
    expect(screen.getByText(/A complete Todo CRUD application with AWS Amplify/)).toBeInTheDocument()
  })

  it('renders test toast button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: 'Test Toast Notification' })).toBeInTheDocument()
  })

  it('renders add new todo form', () => {
    render(<Home />)
    expect(screen.getByText('Add New Todo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument()
  })

  it('renders overview section', () => {
    render(<Home />)
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'All 0' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Active 0' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Completed 0' })).toBeInTheDocument()
  })

  it('renders documentation links', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: '📖 View Documentation' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🐛 Report Issues' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '🔧 Amplify Docs' })).toBeInTheDocument()
  })

  it('shows info toast when test toast button is clicked', async () => {
    const { toast } = await import('sonner')
    render(<Home />)
    const testButton = screen.getByRole('button', { name: 'Test Toast Notification' })
    
    fireEvent.click(testButton)
    
    expect(toast.info).toHaveBeenCalledWith('This is an info toast!', {
      description: 'Template is working perfectly!'
    })
  })
})
