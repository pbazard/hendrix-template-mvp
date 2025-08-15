# 🚀 Hendrix MVP Template

<div align="center">
  <img src="public/logo.png" alt="Hendrix MVP Template Logo" width="200" height="200">
</div>

> **Ready-to-use Next.js template for rapid MVP development**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-Gen2-orange?logo=amazonaws)](https://aws.amazon.com/amplify/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-3.2-green?logo=vitest)](https://vitest.dev/)

A modern, production-ready template for building MVPs quickly with the latest web technologies.

## ✨ Features

- 🎯 **Next.js 15** - Latest React framework with App Router
- 🔷 **TypeScript** - Full type safety and developer experience
- ☁️ **AWS Amplify Gen 2** - Serverless backend with GraphQL API
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible component library
- 🍞 **Sonner** - Elegant toast notifications
- 🧪 **Vitest** - Fast unit testing with React Testing Library
- 📱 **Responsive** - Mobile-first design approach

## 🚀 Quick Start

### 1. Use this template

Click the **"Use this template"** button above or:

```bash
gh repo create my-awesome-mvp --template pbazard/qrartistry-mvp
cd my-awesome-mvp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Start development

```bash
npm run dev
```

### 5. Initialize backend (optional)

```bash
npx ampx sandbox
```

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   └── ui/             # shadcn/ui components
│   ├── lib/                # Utility functions
│   └── test/               # Test configuration
├── amplify/                # AWS Amplify backend
├── docs/                   # Documentation
└── scripts/                # Automation scripts
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run ui:add [component]` | Add shadcn/ui component |

## 📚 Documentation

- 📖 [Setup Guide](TEMPLATE-SETUP.md) - How to use this template
- 🔧 [Development Guide](docs/DEVELOPMENT.md) - Development workflow
- 🧪 [Testing Guide](docs/TESTING.md) - Testing strategies

## 🎨 Customization

### Add UI Components

```bash
npm run ui:add button
npm run ui:add dialog
npm run ui:add form
```

### Customize Styling

Edit `tailwind.config.ts` for design tokens and `src/app/globals.css` for global styles.

### Configure Backend

Modify `amplify/data/resource.ts` to define your data schema and `amplify/auth/resource.ts` for authentication.

## 🌟 What's Included

### Frontend Stack
- **Next.js 15** with App Router
- **TypeScript** configuration
- **Tailwind CSS** with custom design system
- **shadcn/ui** component library
- **Sonner** for notifications

### Backend Stack
- **AWS Amplify Gen 2** for infrastructure
- **GraphQL API** with type generation
- **AWS Cognito** for authentication
- **Real-time subscriptions**

### Developer Experience
- **Vitest** for testing
- **ESLint** for code quality
- **TypeScript** for type safety
- **Hot reload** for fast development

## 🚀 Deployment

### AWS Amplify Hosting

#### Development
```bash
npx ampx sandbox
```

#### Production
1. **Connect your repository** to AWS Amplify Console
2. **Build settings** are configured in `amplify.yml`
3. **Node.js version** is specified in `.nvmrc` (Node 20)

#### Troubleshooting Common Issues

**Package Lock Sync Error:**
```bash
# Fix locally then commit
npm install
git add package-lock.json
git commit -m "fix: sync package-lock.json"
```

**Build Configuration:**
- Ensure `amplify.yml` is in root directory
- Node.js 20 is specified in `.nvmrc`
- Build command uses `npm ci` for consistency

#### Environment Variables
Set these in Amplify Console > Environment Variables:
```
NODE_VERSION=20
NODE_OPTIONS=--max-old-space-size=4096
```

### Other Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting  
- **Docker**: Container deployment

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- [Next.js](https://nextjs.org/) by Vercel
- [AWS Amplify](https://aws.amazon.com/amplify/) by Amazon
- [Tailwind CSS](https://tailwindcss.com/) by Tailwind Labs
- [shadcn/ui](https://ui.shadcn.com/) by shadcn

---

<div align="center">

**[Use this template](https://github.com/pbazard/qrartistry-mvp/generate)** to start building your MVP today! 🚀

</div>

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.