# Testing Configuration

## Overview

This project uses **Vitest** as the primary testing framework with React Testing Library for component testing.

## Testing Stack

- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM simulation environment
- **@testing-library/jest-dom** - Custom Jest matchers
- **Sonner** - Toast notifications (with mocking support)

## Available Scripts

```bash
# Run tests in watch mode
npm test

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts          # Global test setup
│   └── test-utils.ts     # Testing utilities and mocks
├── app/
│   └── __tests__/        # App-level tests
├── components/
│   └── ui/
│       └── __tests__/    # Component tests
└── lib/
    └── __tests__/        # Utility function tests
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

### Testing with Mocks

The setup automatically mocks:
- **Next.js Router** - Navigation functions
- **AWS Amplify** - Data client and configuration
- **Sonner** - Toast notifications

### Using Test Utilities

```typescript
import { createMockTodo, createMockAmplifyClient } from '@/test/test-utils'

const mockTodo = createMockTodo('1', 'Test todo')
const mockClient = createMockAmplifyClient([mockTodo])
```

## Coverage Configuration

Coverage reports are generated using v8 and include:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

Excluded from coverage:
- `node_modules/`
- `src/test/`
- Type definition files
- `amplify/` directory
- `.next/` build directory

## Best Practices

1. **Descriptive test names** - Use clear, specific descriptions
2. **One assertion per test** - Keep tests focused
3. **Mock external dependencies** - Isolate components under test
4. **Test user interactions** - Use `userEvent` for realistic interactions
5. **Test accessibility** - Use semantic queries (`getByRole`, `getByLabelText`)

## Configuration Files

- `vitest.config.ts` - Vitest configuration
- `src/test/setup.ts` - Global test setup and mocks
- `src/test/test-utils.ts` - Reusable testing utilities
