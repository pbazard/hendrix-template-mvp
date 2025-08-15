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
    expect(screen.getByRole('heading', { name: 'QRArtistry MVP' })).toBeInTheDocument()
  })

  it('renders the todos section', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: 'My todos' })).toBeInTheDocument()
  })

  it('renders add todo button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: '+ Add new todo' })).toBeInTheDocument()
  })

  it('renders test toast button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: 'Test Toast' })).toBeInTheDocument()
  })

  it('shows info toast when test toast button is clicked', async () => {
    const { toast } = await import('sonner')
    render(<Home />)
    const testButton = screen.getByRole('button', { name: 'Test Toast' })
    
    fireEvent.click(testButton)
    
    expect(toast.info).toHaveBeenCalledWith('This is an info toast!')
  })

  it('renders footer text', () => {
    render(<Home />)
    expect(screen.getByText(/App successfully hosted with Tailwind CSS/)).toBeInTheDocument()
  })

  it('renders documentation link', () => {
    render(<Home />)
    const link = screen.getByRole('link', { name: /Review next steps/ })
    expect(link).toHaveAttribute('href', expect.stringContaining('docs.amplify.aws'))
  })
})
