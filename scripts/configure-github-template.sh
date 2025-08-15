#!/bin/bash

# GitHub Template Configuration Helper
# This script provides instructions for configuring your repository as a GitHub template

echo "🎯 GitHub Template Configuration Guide"
echo "========================================"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get repository information
REPO_URL=$(git config --get remote.origin.url)
REPO_NAME=$(basename -s .git "$REPO_URL")
REPO_OWNER=$(dirname "$REPO_URL" | xargs basename)

echo "📍 Repository: $REPO_OWNER/$REPO_NAME"
echo "🌐 URL: https://github.com/$REPO_OWNER/$REPO_NAME"
echo ""

echo "🔧 Steps to configure as GitHub Template:"
echo ""
echo "1. 🌐 Open repository settings:"
echo "   https://github.com/$REPO_OWNER/$REPO_NAME/settings"
echo ""
echo "2. 📋 Scroll down to 'Template repository' section"
echo ""
echo "3. ✅ Check the 'Template repository' checkbox"
echo ""
echo "4. 💾 Click 'Update settings' or 'Save changes'"
echo ""

echo "🎉 Once configured, users can create new repositories from your template:"
echo ""
echo "📝 Via GitHub Web:"
echo "   - Go to your repository page"
echo "   - Click 'Use this template' button (green button)"
echo "   - Choose 'Create a new repository'"
echo ""
echo "💻 Via GitHub CLI:"
echo "   gh repo create my-new-project --template $REPO_OWNER/$REPO_NAME"
echo ""
echo "🐙 Via Git clone (alternative):"
echo "   git clone https://github.com/$REPO_OWNER/$REPO_NAME.git my-new-project"
echo "   cd my-new-project"
echo "   rm -rf .git"
echo "   git init"
echo ""

echo "📚 Template Features Included:"
echo "   ✅ Next.js 15 + TypeScript"
echo "   ✅ AWS Amplify Gen 2 backend"
echo "   ✅ Tailwind CSS + shadcn/ui"
echo "   ✅ Vitest testing framework"
echo "   ✅ Sonner toast notifications"
echo "   ✅ Complete documentation"
echo "   ✅ Setup automation script"
echo ""

echo "🚀 Opening repository settings page..."

# Try to open the settings page
if command -v gh &> /dev/null; then
    echo "   Using GitHub CLI..."
    gh repo view --web
    echo ""
    echo "   Navigate to Settings tab manually"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://github.com/$REPO_OWNER/$REPO_NAME/settings"
elif command -v open &> /dev/null; then
    open "https://github.com/$REPO_OWNER/$REPO_NAME/settings"
else
    echo "   Please open manually: https://github.com/$REPO_OWNER/$REPO_NAME/settings"
fi

echo ""
echo "💡 Need help? Check the documentation:"
echo "   - README-TEMPLATE.md"
echo "   - TEMPLATE-SETUP.md"
echo "   - docs/DEVELOPMENT.md"
echo ""
echo "✨ Happy templating! 🎉"
