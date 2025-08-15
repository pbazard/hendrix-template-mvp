#!/bin/bash

# Script de test pour vérifier les imports après réorganisation

echo "🔍 Vérification des imports après réorganisation..."

# Test des imports TypeScript
echo "📦 Test de compilation TypeScript..."
npx tsc --noEmit --skipLibCheck src/app/admin/page.tsx

if [ $? -eq 0 ]; then
    echo "✅ Compilation TypeScript OK"
else
    echo "❌ Erreurs de compilation TypeScript"
    exit 1
fi

# Vérification qu'aucun import obsolète ne subsiste
echo "🔍 Vérification des imports obsolètes..."

OBSOLETE_IMPORTS=$(grep -r "@/admin/components/Admin.*\.tsx" src/ --include="*.tsx" --include="*.ts" || true)

if [ -z "$OBSOLETE_IMPORTS" ]; then
    echo "✅ Aucun import obsolète trouvé"
else
    echo "❌ Imports obsolètes trouvés:"
    echo "$OBSOLETE_IMPORTS"
    exit 1
fi

# Test que tous les nouveaux modules sont exportés
echo "📋 Test des exports des nouveaux modules..."

# Test hooks
if grep -q "export.*useAdminAuth" src/admin/hooks/index.ts; then
    echo "✅ Hooks exports OK"
else
    echo "❌ Erreur dans les exports hooks"
    exit 1
fi

# Test utils
if grep -q "export.*formatUtils" src/admin/utils/index.ts; then
    echo "✅ Utils exports OK"
else
    echo "❌ Erreur dans les exports utils"
    exit 1
fi

# Test constants
if grep -q "export.*ADMIN_ROUTES" src/admin/constants/index.ts; then
    echo "✅ Constants exports OK"
else
    echo "❌ Erreur dans les exports constants"
    exit 1
fi

# Test components
if grep -q "export.*AdminLayout" src/admin/components/index.ts; then
    echo "✅ Components exports OK"
else
    echo "❌ Erreur dans les exports components"
    exit 1
fi

echo ""
echo "🎉 Tous les tests sont passés ! L'organisation est correcte."
echo ""
echo "📁 Nouvelle structure:"
echo "├── components/"
echo "│   ├── layout/     # ✅ Composants de structure"
echo "│   ├── forms/      # ✅ Formulaires"
echo "│   └── ui/         # ✅ Interface utilisateur"
echo "├── hooks/          # ✅ Hooks React"
echo "├── utils/          # ✅ Utilitaires"
echo "├── constants/      # ✅ Constantes"
echo "└── ..."
echo ""
echo "🚀 Prêt pour le développement !"
