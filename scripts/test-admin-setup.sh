#!/bin/bash

# Script de test pour l'interface d'administration Hendrix

set -e

echo "🧪 Test de l'interface d'administration Hendrix"
echo "=============================================="
echo ""

# Vérification de l'environnement
echo "📋 Vérification de l'environnement..."

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js détecté: $NODE_VERSION"
else
    echo "❌ Node.js non trouvé"
    exit 1
fi

# Vérifier npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm détecté: $NPM_VERSION"
else
    echo "❌ npm non trouvé"
    exit 1
fi

# Vérifier le fichier package.json
if [ -f "package.json" ]; then
    echo "✅ package.json trouvé"
else
    echo "❌ package.json non trouvé - êtes-vous dans le bon répertoire ?"
    exit 1
fi

echo ""

# Vérification des fichiers de l'administration
echo "📁 Vérification des fichiers de l'administration..."

ADMIN_FILES=(
    "src/admin/types/index.ts"
    "src/admin/config/models.ts"
    "src/admin/services/auth.ts"
    "src/admin/services/data.ts"
    "src/admin/context/AdminContext.tsx"
    "src/admin/components/AdminLayout.tsx"
    "src/admin/components/AdminDashboard.tsx"
    "src/app/admin/page.tsx"
    "src/app/api/admin/users/route.ts"
    "src/app/api/admin/groups/route.ts"
)

MISSING_FILES=()

for file in "${ADMIN_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (manquant)"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Fichiers manquants détectés. L'installation pourrait être incomplète."
    echo ""
fi

# Vérification de la configuration Amplify
echo ""
echo "⚙️  Vérification de la configuration Amplify..."

if [ -f "amplify_outputs.json" ]; then
    echo "✅ amplify_outputs.json trouvé"
    
    # Vérifier la présence des clés importantes
    if grep -q "user_pool_id" amplify_outputs.json; then
        USER_POOL_ID=$(grep -o '"user_pool_id": "[^"]*"' amplify_outputs.json | cut -d'"' -f4)
        echo "✅ User Pool ID: $USER_POOL_ID"
    else
        echo "❌ User Pool ID non trouvé dans amplify_outputs.json"
    fi
    
    if grep -q "aws_region" amplify_outputs.json; then
        AWS_REGION=$(grep -o '"aws_region": "[^"]*"' amplify_outputs.json | head -1 | cut -d'"' -f4)
        echo "✅ AWS Region: $AWS_REGION"
    else
        echo "❌ AWS Region non trouvé dans amplify_outputs.json"
    fi
else
    echo "❌ amplify_outputs.json non trouvé"
fi

echo ""

# Test des dépendances
echo "📦 Vérification des dépendances..."

REQUIRED_DEPS=(
    "next"
    "react"
    "aws-amplify"
    "tailwindcss"
    "sonner"
)

OPTIONAL_DEPS=(
    "@aws-sdk/client-cognito-identity-provider"
    "@radix-ui/react-dropdown-menu"
)

# Vérifier les dépendances requises
for dep in "${REQUIRED_DEPS[@]}"; do
    if npm list "$dep" &> /dev/null; then
        echo "✅ $dep (installé)"
    else
        echo "❌ $dep (manquant)"
    fi
done

# Vérifier les dépendances optionnelles
echo ""
echo "📦 Dépendances optionnelles (pour fonctionnalités avancées):"
for dep in "${OPTIONAL_DEPS[@]}"; do
    if npm list "$dep" &> /dev/null; then
        echo "✅ $dep (installé)"
    else
        echo "⚠️  $dep (recommandé pour la production)"
    fi
done

echo ""

# Test de compilation
echo "🔨 Test de compilation TypeScript..."

if npx tsc --noEmit --skipLibCheck; then
    echo "✅ Compilation TypeScript réussie"
else
    echo "❌ Erreurs de compilation TypeScript détectées"
fi

echo ""

# Instructions finales
echo "🚀 Instructions pour tester l'interface d'administration:"
echo ""
echo "1. Installer les dépendances manquantes (si nécessaire):"
echo "   npm install @aws-sdk/client-cognito-identity-provider @radix-ui/react-dropdown-menu"
echo ""
echo "2. Configurer les groupes Cognito:"
echo "   chmod +x scripts/setup-cognito-groups.sh"
echo "   ./scripts/setup-cognito-groups.sh"
echo ""
echo "3. Démarrer l'application de développement:"
echo "   npm run dev"
echo ""
echo "4. Accéder aux interfaces de test:"
echo "   - Page de test: http://localhost:3000/admin/test"
echo "   - Interface admin: http://localhost:3000/admin"
echo ""
echo "5. Créer un utilisateur test et l'ajouter au groupe 'Administrators'"
echo ""

# Vérification AWS CLI (optionnel)
if command -v aws &> /dev/null; then
    echo "✅ AWS CLI détecté - vous pouvez utiliser les scripts de configuration"
else
    echo "ℹ️  AWS CLI non détecté - configuration manuelle via la console AWS nécessaire"
fi

echo ""
echo "✅ Test terminé!"
echo ""

# Proposer de lancer les tests automatiques
read -p "Voulez-vous lancer l'application de test maintenant ? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Lancement de l'application..."
    npm run dev
fi
