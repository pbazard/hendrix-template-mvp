# Hendrix MVP Template

**Next.js 15 + AWS Amplify + Tailwind + shadcn/ui**

A modern, production-ready template for rapid MVP development with Next.js applications, AWS Amplify backend, Tailwind CSS styling, and shadcn/ui components.

## 🚀 Features

- **Next.js 15** - Latest React framework with App Router
- **TypeScript** - Full type safety
- **AWS Amplify Gen 2** - Backend-as-a-Service with GraphQL API
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Sonner** - Elegant toast notifications
- **Vitest** - Fast unit testing with React Testing Library
- **ESLint + Prettier** - Code quality and formatting

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Account (for Amplify backend)
- Git

## 🛠️ Getting Started

### 1. Use this template

Click the "Use this template" button on GitHub or:

```bash
gh repo create my-new-project --template pbazard/hendrix-template-mvp
cd my-new-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your project

1. **Update project name** in `package.json`
2. **Customize metadata** in `src/app/layout.tsx`
3. **Update README** with your project details

### 4. Initialize Amplify backend

```bash
npx ampx sandbox
```

### 5. Start development

```bash
npm run dev
```

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Utilities
│   └── test/               # Test setup and utilities
├── amplify/                # AWS Amplify backend
├── docs/                   # Documentation
└── public/                 # Static assets
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 🎨 Adding UI Components

```bash
# Add shadcn/ui components
npm run ui:add button
npm run ui:add card
npm run ui:add input
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run ui:add [component]` - Add shadcn/ui component

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Sonner** - Toast notifications

### Backend
- **AWS Amplify Gen 2** - BaaS platform
- **GraphQL** - API layer
- **AWS Cognito** - Authentication
- **AWS AppSync** - Real-time data

### Testing
- **Vitest** - Test framework
- **React Testing Library** - Component testing
- **jsdom** - DOM simulation

### Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks (optional)

## 🔧 Configuration

### Tailwind CSS
- Custom design tokens in `tailwind.config.ts`
- Dark mode support
- shadcn/ui integration

### AWS Amplify
- Backend configuration in `amplify/`
- Type-safe GraphQL schema
- Real-time subscriptions

### Testing
- Configuration in `vitest.config.ts`
- Setup file in `src/test/setup.ts`
- Test utilities in `src/test/test-utils.ts`

## 📖 Documentation

- [Testing Guide](./docs/TESTING.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team
- [AWS Amplify](https://aws.amazon.com/amplify/) team
- [shadcn](https://github.com/shadcn) for the amazing UI components
- [Tailwind CSS](https://tailwindcss.com/) team
