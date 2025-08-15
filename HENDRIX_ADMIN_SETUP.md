# Guide d'Installation - Interface d'Administration Hendrix

## 📦 Installation

### 1. Dépendances requises

Ajoutez les dépendances suivantes à votre `package.json` :

```bash
# AWS SDK (à installer plus tard)
npm install @aws-sdk/client-cognito-identity-provider

# Radix UI pour les composants (si pas déjà installé)
npm install @radix-ui/react-dropdown-menu @radix-ui/react-icons

# Utilitaires
npm install sonner  # Pour les notifications (déjà installé)
```

### 2. Configuration des variables d'environnement

Ajoutez les variables suivantes à votre fichier `.env.local` :

```env
# AWS Cognito Configuration
COGNITO_USER_POOL_ID=eu-west-1_7muhJha11
COGNITO_USER_POOL_CLIENT_ID=1mgqpra2j31eam5l3vsrfi69mp
AWS_REGION=eu-west-1

# Administration
ADMIN_SECRET_KEY=your-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
```

### 3. Configuration Amplify

Assurez-vous que votre `amplify_outputs.json` contient la configuration Cognito correcte.

## 🚀 Démarrage rapide

### 1. Accès à l'interface d'administration

1. Démarrez votre application : `npm run dev`
2. Naviguez vers : `http://localhost:3000/admin`
3. Connectez-vous avec un utilisateur membre du groupe "Administrators" ou "Staff"

### 2. Configuration des groupes Cognito

Via la console AWS Cognito, créez les groupes suivants :

- **Administrators** : Accès complet
- **Staff** : Accès limité
- **Moderators** : Permissions de modération

### 3. Attribution des utilisateurs aux groupes

Ajoutez vos utilisateurs aux groupes appropriés via :
- Console AWS Cognito
- AWS CLI
- API Cognito

## 🔧 Configuration avancée

### 1. Personnalisation des modèles

Modifiez le fichier `src/admin/config/models.ts` pour ajouter vos propres modèles :

```typescript
export const myModelAdmin: ModelAdmin = {
  name: 'MyModel',
  verbose_name: 'Mon Modèle',
  verbose_name_plural: 'Mes Modèles',
  fields: [
    {
      name: 'title',
      type: 'string',
      label: 'Titre',
      required: true
    }
  ],
  list_display: ['title', 'createdAt'],
  search_fields: ['title']
};

// Ajoutez à la configuration principale
export const adminConfig: AdminConfig = {
  // ... configuration existante
  models: {
    Todo: todoAdmin,
    User: userAdmin,
    Group: groupAdmin,
    MyModel: myModelAdmin  // ← Ajoutez votre modèle ici
  }
};
```

### 2. Ajout de routes API

Créez les routes API pour vos modèles dans `src/app/api/admin/` :

```typescript
// src/app/api/admin/mymodel/route.ts
export async function GET() {
  // Logique de récupération
}

export async function POST() {
  // Logique de création
}
```

### 3. Personnalisation du thème

Modifiez la configuration du thème dans `models.ts` :

```typescript
theme: {
  primaryColor: '#your-color',
  logoUrl: '/your-logo.png',
  faviconUrl: '/your-favicon.ico'
}
```

## 🔐 Sécurité

### 1. Middleware d'authentification

Ajoutez un middleware pour protéger les routes admin :

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Vérifiez l'authentification
    // Redirigez vers la page de connexion si nécessaire
  }
}

export const config = {
  matcher: '/admin/:path*'
};
```

### 2. Validation des permissions

Utilisez les hooks de permissions dans vos composants :

```typescript
import { usePermission } from '@/admin/context/AdminContext';

function MyComponent() {
  const canCreate = usePermission(ActionType.CREATE, 'MyModel');
  
  if (!canCreate) {
    return <div>Accès refusé</div>;
  }
  
  return <CreateForm />;
}
```

## 🧪 Tests

### 1. Test de l'interface

```bash
# Démarrez l'application
npm run dev

# Testez les URLs suivantes :
# http://localhost:3000/admin
# http://localhost:3000/admin/todo
# http://localhost:3000/admin/user
```

### 2. Test des permissions

1. Créez des utilisateurs test dans différents groupes
2. Testez l'accès aux différentes sections
3. Vérifiez que les actions sont correctement restreintes

## 🐛 Dépannage

### Problèmes courants

1. **Erreur d'authentification**
   - Vérifiez la configuration Cognito
   - Assurez-vous que l'utilisateur appartient à un groupe autorisé

2. **Composants manquants**
   - Installez les dépendances manquantes
   - Vérifiez les imports

3. **Permissions insuffisantes**
   - Vérifiez l'appartenance aux groupes
   - Consultez la configuration des permissions

### Logs de débogage

Activez les logs de débogage en ajoutant :

```env
DEBUG=admin:*
NODE_ENV=development
```

## 📞 Support

Pour obtenir de l'aide :

1. Consultez la documentation dans `src/admin/README.md`
2. Vérifiez les logs de la console
3. Examinez la configuration des groupes Cognito
4. Testez avec un utilisateur administrateur

## 🔄 Mise à jour

Pour mettre à jour l'interface d'administration :

1. Sauvegardez votre configuration personnalisée
2. Mettez à jour les fichiers de base
3. Réappliquez vos personnalisations
4. Testez les nouvelles fonctionnalités
