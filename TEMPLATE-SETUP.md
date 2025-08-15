# 🚀 Guide de Configuration du Template

Ce guide vous aide à configurer votre nouveau projet basé sur le template **Hendrix MVP**.

## 📋 Checklist de Configuration

### 1. Configuration Initiale

- [ ] **Cloner ou utiliser le template**
  ```bash
  # Via GitHub CLI
  gh repo create mon-nouveau-projet --template pbazard/hendrix-template-mvp
  
  # Ou via interface GitHub
  # Cliquez sur "Use this template" sur GitHub
  ```

- [ ] **Mettre à jour les informations du projet**
  - [ ] Modifier `package.json` : nom, description, auteur, repository
  - [ ] Mettre à jour `README.md`
  - [ ] Personnaliser `LICENSE` si nécessaire

2. **Create new project from template:**
   ```bash
   # Using GitHub CLI
   gh repo create my-new-project --template pbazard/hendrix-template-mvp --public
   
   # Or click "Use this template" on GitHub
   ```

### Method 2: Clone and customize

```bash
# Clone the template
git clone https://github.com/pbazard/hendrix-template-mvp.git my-new-project
cd my-new-project

# Remove git history and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit from template"

# Add your remote
git remote add origin https://github.com/yourusername/my-new-project.git
git push -u origin main
```

## 🔧 Customization Checklist

After creating your new project:

### 1. Update package.json
- [ ] Change `name` field
- [ ] Update `description`
- [ ] Update `author`
- [ ] Update `repository` URL

### 2. Update app metadata
- [ ] Edit `src/app/layout.tsx` - title and description
- [ ] Update `public/` assets (favicon, etc.)

### 3. Customize README
- [ ] Replace `README-TEMPLATE.md` content in your `README.md`
- [ ] Add your project-specific information
- [ ] Update installation and setup instructions

### 4. Environment setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Configure your AWS credentials
- [ ] Set up Amplify backend: `npx ampx sandbox`

### 5. Remove template-specific files (optional)
- [ ] Delete `README-TEMPLATE.md`
- [ ] Delete `TEMPLATE-SETUP.md`
- [ ] Remove example todos functionality
- [ ] Customize the homepage

## 🏗️ Building your app

### Start with the basics
1. **Design your data model** in `amplify/data/resource.ts`
2. **Create your UI components** using shadcn/ui
3. **Add your business logic** in the app pages
4. **Write tests** for your components

### Best practices
- Use TypeScript for everything
- Follow the existing folder structure
- Write tests as you develop
- Use semantic commits
- Keep dependencies updated

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [AWS Amplify Gen 2 Docs](https://docs.amplify.aws/react/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/docs/components)
- [Vitest Testing Guide](https://vitest.dev/guide/)

## 🤝 Contributing to the template

If you find improvements that could benefit all projects:

1. Fork the original template repository
2. Make your improvements
3. Submit a pull request with:
   - Clear description of the improvement
   - Why it benefits all projects
   - Any breaking changes

Happy coding! 🚀
