# Interface d'Administration Hendrix

Une interface d'administration moderne inspirée de Django Admin, intégrée avec AWS Cognito pour l'authentification et la gestion des utilisateurs.

## 🚀 Fonctionnalités

### Caractéristiques principales
- **Génération automatique d'interface** : Interface intuitive générée automatiquement à partir des modèles
- **Opérations CRUD complètes** : Création, lecture, mise à jour et suppression d'enregistrements
- **Authentification AWS Cognito** : Gestion sécurisée des utilisateurs et groupes
- **Système de permissions granulaire** : Contrôle d'accès basé sur les groupes Cognito
- **Personnalisation ModelAdmin** : Configuration flexible de l'affichage et du comportement
- **Édition en ligne** : Modification de modèles liés dans la même interface
- **Actions personnalisées** : Actions en lot et opérations spécialisées
- **Thématisation** : Interface personnalisable selon votre marque
- **Journal d'audit** : Traçabilité complète des actions utilisateurs
- **Sécurité renforcée** : Protection CSRF et validation des entrées

## 📋 Correspondance Django Admin → Hendrix Admin

| Django Admin | Hendrix Admin | AWS Cognito |
|--------------|---------------|-------------|
| User | CognitoUser | User Pool Users |
| Group | CognitoGroup | User Pool Groups |
| Permission | Permission | Group-based permissions |
| ModelAdmin | ModelAdmin | Configuration des modèles |
| Admin Actions | ModelAction | Actions personnalisées |
| Admin Site | AdminConfig | Configuration globale |

## 🏗️ Architecture

```
src/admin/
├── types/           # Types TypeScript
├── config/          # Configuration des modèles
├── services/        # Services d'authentification et données
├── context/         # Context React
├── components/      # Composants UI
└── index.ts         # Point d'entrée principal
```

### Services principaux

#### CognitoAuthService
- Authentification utilisateur
- Gestion des groupes
- Vérification des permissions
- Opérations sur les utilisateurs

#### DataService
- Opérations CRUD génériques
- Recherche et filtrage
- Pagination
- Export de données
- Journal d'audit

## 🛠️ Configuration

### 1. Configuration des modèles

```typescript
import { ModelAdmin } from '@/admin/types';

export const todoAdmin: ModelAdmin = {
  name: 'Todo',
  verbose_name: 'Tâche',
  verbose_name_plural: 'Tâches',
  fields: [
    {
      name: 'content',
      type: 'text',
      label: 'Contenu',
      required: true,
      maxLength: 500
    }
  ],
  list_display: ['content', 'completed', 'createdAt'],
  list_filter: ['completed'],
  search_fields: ['content'],
  ordering: ['-createdAt'],
  permissions: {
    add: true,
    change: true,
    delete: true,
    view: true
  }
};
```

### 2. Configuration globale

```typescript
import { AdminConfig } from '@/admin/types';

export const adminConfig: AdminConfig = {
  site_title: 'Administration Hendrix',
  site_header: 'Interface d\'Administration Hendrix',
  index_title: 'Administration du site',
  models: {
    Todo: todoAdmin,
    User: userAdmin,
    Group: groupAdmin
  },
  theme: {
    primaryColor: '#3b82f6',
    logoUrl: '/logo.png'
  },
  security: {
    allowedGroups: ['Administrators', 'Staff']
  }
};
```

## 🔐 Sécurité et Permissions

### Groupes Cognito
- **Administrators** : Accès complet à toutes les fonctionnalités
- **Staff** : Accès limité selon la configuration
- **Moderators** : Permissions de modération

### Vérification des permissions
```typescript
import { usePermission } from '@/admin/context/AdminContext';

function MyComponent() {
  const canEdit = usePermission(ActionType.UPDATE, 'Todo');
  
  return (
    <div>
      {canEdit && <EditButton />}
    </div>
  );
}
```

## 🎨 Personnalisation

### Thèmes
L'interface peut être personnalisée via la configuration du thème :

```typescript
theme: {
  primaryColor: '#3b82f6',
  logoUrl: '/custom-logo.png',
  faviconUrl: '/custom-favicon.ico'
}
```

### Actions personnalisées
```typescript
const customAction: ModelAction = {
  name: 'custom_action',
  description: 'Action personnalisée',
  icon: 'star',
  handler: async (items, admin) => {
    // Logique personnalisée
  }
};
```

## 📊 Journal d'audit

Toutes les actions sont automatiquement enregistrées :
- Utilisateur qui a effectué l'action
- Type d'action (CREATE, READ, UPDATE, DELETE)
- Modèle concerné
- Détails des changements
- Horodatage et adresse IP

## 🚦 Utilisation

### 1. Intégration dans une page Next.js

```typescript
import { AdminLayout, AdminDashboard } from '@/admin/components';

export default function AdminPage() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
```

### 2. Navigation
- `/admin` - Tableau de bord principal
- `/admin/[model]` - Liste des éléments du modèle
- `/admin/[model]/add` - Ajouter un nouvel élément
- `/admin/[model]/[id]/change` - Modifier un élément
- `/admin/[model]/[id]` - Détail d'un élément

## 🔧 API Routes

### Utilisateurs
- `POST /api/admin/users` - Liste les utilisateurs
- `PATCH /api/admin/users/[id]` - Met à jour un utilisateur

### Groupes
- `GET /api/admin/groups` - Liste les groupes
- `POST /api/admin/groups` - Crée un groupe

## 📝 TODO

### Prochaines fonctionnalités
- [ ] Implémentation complète du SDK AWS
- [ ] Système de permissions plus granulaire
- [ ] Interface de configuration en temps réel
- [ ] Tableau de bord avec métriques avancées
- [ ] Export/Import de données
- [ ] API REST complète
- [ ] Tests unitaires et d'intégration
- [ ] Documentation interactive

### Améliorations prévues
- [ ] Support multi-langue
- [ ] Mode sombre/clair
- [ ] Notifications push
- [ ] Workflow d'approbation
- [ ] Système de plugins

## 🤝 Contribution

1. Clonez le repository
2. Créez une branche feature
3. Développez votre fonctionnalité
4. Testez vos changements
5. Soumettez une pull request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
