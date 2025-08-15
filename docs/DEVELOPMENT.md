# Development Guide

## 🏗️ Project Architecture

### Frontend Architecture
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ConfigureAmplify.tsx # Amplify configuration
├── lib/                  # Utilities and helpers
│   └── utils.ts          # Tailwind utilities (cn function)
└── test/                 # Testing setup
    ├── setup.ts          # Global test configuration
    └── test-utils.ts     # Testing utilities
```

### Backend Architecture (AWS Amplify)
```
amplify/
├── backend.ts            # Backend configuration
├── auth/                 # Authentication setup
│   └── resource.ts       # Cognito configuration
└── data/                 # GraphQL API
    └── resource.ts       # Database schema
```

## 🎨 Styling Guide

### Tailwind CSS + shadcn/ui
- Use Tailwind utility classes for styling
- shadcn/ui components follow design tokens in `tailwind.config.ts`
- Custom components should use the `cn()` utility from `@/lib/utils`

```tsx
import { cn } from "@/lib/utils"

export function MyComponent({ className, ...props }) {
  return (
    <div className={cn("base-styles", className)} {...props}>
      Content
    </div>
  )
}
```

### Design Tokens
- Colors: Defined in CSS variables (light/dark mode)
- Spacing: Use Tailwind's spacing scale
- Typography: Inter font loaded by default
- Border radius: Controlled by `--radius` CSS variable

## 🔧 State Management

### Local State
- Use React `useState` for component state
- Use `useReducer` for complex state logic

### Server State (AWS Amplify)
```tsx
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '@/amplify/data/resource'

const client = generateClient<Schema>()

// Query data
const { data } = await client.models.Todo.list()

// Real-time subscriptions
client.models.Todo.observeQuery().subscribe({
  next: (data) => setTodos([...data.items])
})
```

## 🧪 Testing Strategy

### Unit Tests
- Test individual components in isolation
- Mock external dependencies (AWS Amplify, Next.js)
- Focus on component behavior and user interactions

### Integration Tests
- Test component interactions
- Test data flow between components
- Test form submissions and API calls

### Testing Best Practices
```tsx
// ✅ Good: Test user behavior
it('shows success message when form is submitted', async () => {
  render(<ContactForm />)
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(screen.getByText(/success/i)).toBeInTheDocument()
})

// ❌ Avoid: Testing implementation details
it('calls handleSubmit when form is submitted', () => {
  const handleSubmit = vi.fn()
  render(<ContactForm onSubmit={handleSubmit} />)
  // ...
})
```

## 📦 Component Development

### Creating New Components

1. **Use shadcn/ui when possible:**
```bash
npm run ui:add dialog
npm run ui:add form
```

2. **Create custom components:**
```tsx
// src/components/MyComponent.tsx
import { cn } from "@/lib/utils"

interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("default-styles", className)}>
      {children}
    </div>
  )
}
```

3. **Add tests:**
```tsx
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from '../MyComponent'

describe('MyComponent', () => {
  it('renders children correctly', () => {
    render(<MyComponent>Test content</MyComponent>)
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })
})
```

## 🛠️ Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Install any new dependencies
npm install

# Start development server
npm run dev

# Run tests in watch mode
npm test
```

### 2. Code Quality
```bash
# Lint code
npm run lint

# Run all tests
npm test -- --run

# Check test coverage
npm run test:coverage

# Build for production
npm run build
```

### 3. Commit Guidelines
Use conventional commits:
```bash
git commit -m "feat: add user profile component"
git commit -m "fix: resolve login form validation"
git commit -m "docs: update API documentation"
git commit -m "test: add integration tests for auth flow"
```

## 🔒 Environment Configuration

### Development
- Use `.env.local` for local environment variables
- AWS credentials managed by Amplify CLI
- Hot reload enabled for fast development

### Production
- Environment variables configured in deployment platform
- AWS resources managed by Amplify hosting
- Optimized builds with code splitting

## 📈 Performance

### Next.js Optimizations
- Automatic code splitting
- Image optimization with `next/image`
- Font optimization with `next/font`
- Static generation where possible

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

### Core Web Vitals
- Monitor with Next.js built-in analytics
- Optimize images and fonts
- Use `loading="lazy"` for below-fold content

## 🚀 Deployment

### Amplify Hosting
```bash
# Deploy to AWS Amplify
npx ampx sandbox # For development
# Production deployment via Amplify Console
```

### Other Platforms
- Vercel: Zero-config deployment
- Netlify: Static site hosting
- Docker: Container deployment

## 🔍 Debugging

### Development Tools
- React Developer Tools
- Next.js built-in debugging
- Vitest UI for test debugging
- AWS Amplify Studio for backend

### Common Issues
1. **Hydration errors**: Check for server/client rendering differences
2. **Import errors**: Verify TypeScript paths and aliases
3. **Build errors**: Check for type errors and missing dependencies
4. **Test failures**: Verify mocks and async operations
