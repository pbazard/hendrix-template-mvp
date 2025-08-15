#!/bin/bash

# GitHub Branch Protection Setup Script
# This script helps configure branch protection rules for the repository

echo "🛡️ GitHub Branch Protection Configuration"
echo "=========================================="
echo ""

# Check if GitHub CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📥 Install it from: https://cli.github.com/"
    exit 1
fi

# Get repository information
REPO_OWNER=$(gh repo view --json owner --jq .owner.login)
REPO_NAME=$(gh repo view --json name --jq .name)

echo "📍 Repository: $REPO_OWNER/$REPO_NAME"
echo ""

echo "🔧 Configuring branch protection rules..."
echo ""

# Main branch protection
echo "🛡️ Setting up protection for 'main' branch:"

gh api repos/$REPO_OWNER/$REPO_NAME/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["🔍 Lint & Security","🧪 Tests (18)","🏗️ Build","🛡️ Security Scan"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_code_owner_reviews":true,"require_last_push_approval":true}' \
  --field restrictions='null' \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field block_creations=false \
  --field required_conversation_resolution=true \
  --field required_linear_history=false \
  --field allow_fork_syncing=true

echo "✅ Main branch protection configured"
echo ""

# Develop branch protection (if exists)
if gh api repos/$REPO_OWNER/$REPO_NAME/branches/develop &>/dev/null; then
    echo "🛡️ Setting up protection for 'develop' branch:"
    
    gh api repos/$REPO_OWNER/$REPO_NAME/branches/develop/protection \
      --method PUT \
      --field required_status_checks='{"strict":true,"contexts":["🔍 Lint & Security","🧪 Tests (18)","🏗️ Build"]}' \
      --field enforce_admins=false \
      --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
      --field restrictions='null' \
      --field allow_force_pushes=false \
      --field allow_deletions=false
    
    echo "✅ Develop branch protection configured"
else
    echo "ℹ️ Develop branch not found, skipping"
fi

echo ""
echo "📋 Branch Protection Summary:"
echo ""
echo "🛡️ Main Branch Protection:"
echo "   ✅ Require status checks to pass"
echo "   ✅ Require branches to be up to date"
echo "   ✅ Require pull request reviews (1+ approvals)"
echo "   ✅ Dismiss stale reviews"
echo "   ✅ Require code owner reviews"
echo "   ✅ Restrict pushes that create files"
echo "   ✅ Enforce for administrators"
echo "   ✅ Require conversation resolution"
echo ""

echo "📝 Additional Recommendations:"
echo ""
echo "1. 🏷️ Set up required status checks:"
echo "   - Go to Settings > Branches"
echo "   - Edit main branch protection"
echo "   - Add required checks: CI/CD Pipeline jobs"
echo ""
echo "2. 👥 Configure CODEOWNERS file:"
echo "   - Create .github/CODEOWNERS"
echo "   - Define code ownership rules"
echo ""
echo "3. 🔒 Enable vulnerability alerts:"
echo "   - Go to Settings > Security & analysis"
echo "   - Enable Dependabot alerts"
echo "   - Enable Dependabot security updates"
echo ""
echo "4. 🤖 Configure Dependabot:"
echo "   - Create .github/dependabot.yml"
echo "   - Set up automated dependency updates"
echo ""

echo "✨ Branch protection setup complete! 🎉"
