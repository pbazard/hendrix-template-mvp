# Gestion des Ressources AWS - Synchronisation Automatique

Ce document explique comment utiliser le système de synchronisation automatique des ressources AWS dans votre application.

## Vue d'ensemble

Le système de gestion des ressources AWS permet de :
- **Détecter automatiquement** les ressources AWS créées par Amplify
- **Synchroniser en temps réel** les changements de configuration
- **Basculer entre données réelles et données de démonstration**
- **Surveiller l'état** des ressources avec un tableau de bord intégré

## Composants Principaux

### 1. `useAwsResourcesReal`
Hook qui se connecte à la vraie configuration Amplify via `amplify_outputs.json`.

```typescript
import { useAwsResourcesReal } from '@/hooks/useAwsResourcesReal';

function MyComponent() {
  const { resources, loading, error } = useAwsResourcesReal();
  
  if (loading) return <div>Chargement des ressources...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      {resources.map(resource => (
        <div key={resource.id}>
          {resource.name} ({resource.service})
        </div>
      ))}
    </div>
  );
}
```

### 2. `useAwsResourcesAutoSync`
Hook avancé qui combine données réelles et mock avec synchronisation automatique.

```typescript
import { useAwsResourcesAutoSync } from '@/hooks/useAwsResourcesAutoSync';

function MyComponent() {
  const {
    resources,
    activeSource,
    toggleDataSource,
    refreshRealResources,
    stats
  } = useAwsResourcesAutoSync({
    useRealResources: true,
    autoRefreshInterval: 30000, // 30 secondes
    onResourcesChanged: (resources) => {
      console.log('Ressources mises à jour:', resources.length);
    }
  });
  
  return (
    <div>
      <p>Source active: {activeSource}</p>
      <p>Total: {stats.totalResources} ressources</p>
      <button onClick={toggleDataSource}>
        Basculer vers {activeSource === 'real' ? 'Mock' : 'Real'}
      </button>
    </div>
  );
}
```

### 3. `AwsResourcesManager`
Composant UI pour contrôler la synchronisation des ressources.

```typescript
import { AwsResourcesManager } from '@/components/shared';

function Layout() {
  return (
    <div>
      {/* Votre contenu */}
      <AwsResourcesManager 
        showControls={true}
        onResourcesChanged={(count) => console.log(`${count} ressources`)}
      />
    </div>
  );
}
```

### 4. `AwsResourcesFooter`
Composant d'affichage détaillé des ressources AWS.

```typescript
import { AwsResourcesFooter } from '@/components/shared';

function MyPage() {
  return (
    <div>
      {/* Votre contenu */}
      <AwsResourcesFooter />
    </div>
  );
}
```

## Configuration

### Variables d'environnement
Si `amplify_outputs.json` n'est pas disponible, le système peut utiliser ces variables :

```env
NEXT_PUBLIC_USER_POOL_ID=us-east-1_ABC123
NEXT_PUBLIC_IDENTITY_POOL_ID=us-east-1:xyz-abc-123
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.appsync.amazonaws.com/graphql
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_S3_BUCKET=my-amplify-bucket
```

### Personnalisation des services
Vous pouvez étendre les types de ressources détectées :

```typescript
// Dans useAwsResourcesReal.ts
const detectedResources: AwsResource[] = [];

// Ajouter vos propres détections
if (customConfig.customService) {
  detectedResources.push({
    id: 'custom-resource',
    name: 'My Custom Resource',
    type: 'Custom Type',
    service: 'Custom Service',
    region: 'us-east-1',
    status: 'Active',
    description: 'Ma ressource personnalisée',
    arn: generateArn('Custom', 'us-east-1', 'Type', 'name'),
    consoleUrl: generateConsoleUrl('Custom', 'us-east-1', 'Type', 'name')
  });
}
```

## Script de surveillance

Utilisez le script fourni pour surveiller les changements :

```bash
# Vérifier l'état actuel
./scripts/watch-aws-resources.sh check

# Générer un rapport des ressources
./scripts/watch-aws-resources.sh report

# Surveiller en continu (arrêter avec Ctrl+C)
./scripts/watch-aws-resources.sh watch
```

## Intégration avec Amplify

### 1. Après déploiement Amplify
```bash
amplify push
# Le fichier amplify_outputs.json sera mis à jour automatiquement
# Le système détectera les nouvelles ressources
```

### 2. Ajouter une nouvelle ressource
```typescript
// amplify/data/resource.ts
export const data = defineData({
  schema: {
    Post: a.model({
      title: a.string(),
      content: a.string(),
    }).authorization([a.allow.public()]),
  },
});
```

```bash
amplify push
# Nouvelle table DynamoDB sera automatiquement détectée
```

### 3. Ajouter le stockage S3
```typescript
// amplify/storage/resource.ts
export const storage = defineStorage({
  name: 'myStorage',
  access: (allow) => ({
    'public/*': [allow.guest.to(['read'])],
    'private/{entity_id}/*': [allow.entity('user').to(['read', 'write'])],
  })
});
```

## Modes d'utilisation

### Mode Développement
- Utilise des données mock pour le développement rapide
- Pas besoin de vraies ressources AWS
- Interface de test disponible sur `/dev/aws-resources`

### Mode Production
- Se connecte aux vraies ressources AWS
- Synchronisation automatique toutes les 30 secondes
- Détection des changements en temps réel

### Mode Hybride
- Basculement dynamique entre mock et réel
- Ideal pour les démos et les tests
- Interface de contrôle intégrée

## API Reference

### AwsResource Interface
```typescript
interface AwsResource {
  id: string;           // Identifiant unique
  name: string;         // Nom de la ressource
  type: string;         // Type de ressource (Table, User Pool, etc.)
  service: string;      // Service AWS (DynamoDB, Cognito, etc.)
  region: string;       // Région AWS
  status: string;       // Statut (Active, Inactive, etc.)
  description: string;  // Description
  arn: string;          // ARN AWS complet
  consoleUrl: string;   // URL vers la console AWS
}
```

### Options de configuration
```typescript
interface UseAwsResourcesAutoSyncOptions {
  useRealResources?: boolean;     // true = ressources réelles, false = mock
  autoRefreshInterval?: number;   // Intervalle de refresh en ms (0 = désactivé)
  onResourcesChanged?: (resources: AwsResource[]) => void; // Callback
}
```

## Dépannage

### Ressources non détectées
1. Vérifiez que `amplify_outputs.json` existe et est à jour
2. Lancez `amplify push` pour régénérer la configuration
3. Vérifiez les variables d'environnement

### Erreurs de synchronisation
1. Vérifiez la connectivité réseau
2. Vérifiez les permissions AWS
3. Consultez les logs du navigateur

### Performance
- L'auto-refresh est désactivé si l'intervalle est 0
- Les données sont mises en cache pour éviter les requêtes répétées
- Le composant se re-rend seulement quand les données changent

## Sécurité

- Les ARN et URLs sont générés côté client
- Aucune donnée sensible n'est exposée
- Les permissions AWS sont gérées par Amplify
- Les URLs de console utilisent l'authentification AWS standard
