#!/bin/bash

# Template Cleanup Script
# Run this script when creating a new project from the template

echo "🧹 Cleaning up template for new project..."

# Function to prompt for user input
prompt_for_input() {
    read -p "$1: " value
    echo "$value"
}

# Get project information
PROJECT_NAME=$(prompt_for_input "Enter your project name")
PROJECT_DESCRIPTION=$(prompt_for_input "Enter project description")
AUTHOR_NAME=$(prompt_for_input "Enter your name")
AUTHOR_EMAIL=$(prompt_for_input "Enter your email")
GITHUB_USERNAME=$(prompt_for_input "Enter your GitHub username")

echo "📝 Updating project files..."

# Update package.json
sed -i "s/nextjs-amplify-template/$PROJECT_NAME/g" package.json
sed -i "s/A modern Next.js template with AWS Amplify, Tailwind CSS, and shadcn\/ui/$PROJECT_DESCRIPTION/g" package.json
sed -i "s/Your Name <your.email@example.com>/$AUTHOR_NAME <$AUTHOR_EMAIL>/g" package.json
sed -i "s/yourusername/$GITHUB_USERNAME/g" package.json

# Update app metadata
sed -i "s/QRArtistry MVP/$PROJECT_NAME/g" src/app/layout.tsx
sed -i "s/Create beautiful QR codes with artistic designs/$PROJECT_DESCRIPTION/g" src/app/layout.tsx

# Copy template README
if [ -f "README-TEMPLATE.md" ]; then
    cp README-TEMPLATE.md README.md
    echo "📄 README updated with template content"
fi

# Create .env.local from example
if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "🔧 Created .env.local from example"
fi

# Clean up template-specific files
echo "🗑️  Cleaning up template files..."
rm -f TEMPLATE-SETUP.md
rm -f README-TEMPLATE.md
rm -f scripts/setup-template.sh

# Remove git history and reinitialize
echo "🔄 Reinitializing git repository..."
rm -rf .git
git init
git add .
git commit -m "Initial commit from nextjs-amplify-template"

echo "✅ Template setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your remote repository:"
echo "   git remote add origin https://github.com/$GITHUB_USERNAME/$PROJECT_NAME.git"
echo "   git push -u origin main"
echo ""
echo "2. Install dependencies:"
echo "   npm install"
echo ""
echo "3. Start development:"
echo "   npm run dev"
echo ""
echo "4. Set up Amplify backend:"
echo "   npx ampx sandbox"
echo ""
echo "Happy coding! 🚀"
