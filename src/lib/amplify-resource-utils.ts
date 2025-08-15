'use client';

/**
 * Utilitaires pour récupérer les vrais noms des ressources AWS créées par Amplify
 */

// Interface pour les détails des tables DynamoDB
interface DynamoDBTableInfo {
  modelName: string;
  tableName: string;
  region: string;
}

// Interface pour les métadonnées de déploiement Amplify
interface AmplifyDeploymentMeta {
  appId?: string;
  environmentName?: string;
  region?: string;
  stackName?: string;
}

/**
 * Extrait les métadonnées de déploiement à partir de la configuration Amplify
 */
export function extractAmplifyDeploymentMeta(amplifyConfig: any): AmplifyDeploymentMeta {
  let appId = '';
  let region = amplifyConfig.data?.aws_region || amplifyConfig.data?.region || amplifyConfig.auth?.aws_region || 'us-east-1';
  let environmentName = 'dev'; // Par défaut

  // Essayer d'extraire l'App ID depuis l'URL AppSync
  if (amplifyConfig.data?.url) {
    const urlParts = amplifyConfig.data.url.split('.');
    if (urlParts.length > 0) {
      appId = urlParts[0].split('//')[1]; // Extraire l'ID de l'URL
    }
  }

  // Essayer d'extraire depuis le User Pool ID
  if (!appId && amplifyConfig.auth?.user_pool_id) {
    // Les User Pool ID ont le format: region_randomString
    const poolParts = amplifyConfig.auth.user_pool_id.split('_');
    if (poolParts.length > 1) {
      appId = poolParts[1].substring(0, 8); // Prendre les premiers caractères
    }
  }

  return {
    appId,
    environmentName,
    region,
    stackName: appId ? `amplify-${appId}-${environmentName}` : undefined
  };
}

/**
 * Génère les vrais noms de tables DynamoDB basés sur les conventions Amplify
 */
export function generateDynamoDBTableNames(modelNames: string[], deploymentMeta: AmplifyDeploymentMeta): DynamoDBTableInfo[] {
  const { appId, environmentName, region } = deploymentMeta;
  
  return modelNames.map(modelName => {
    // Différents patterns que Amplify peut utiliser
    const possibleNames = [
      // Pattern le plus commun: {ModelName}-{AppId}-{Environment}
      appId ? `${modelName}-${appId}-${environmentName}` : null,
      // Pattern alternatif: {ModelName}-{Environment}
      `${modelName}-${environmentName}`,
      // Pattern simple: {ModelName}
      modelName,
      // Pattern avec stack: amplify-{AppId}-{Environment}-{ModelName}
      appId ? `amplify-${appId}-${environmentName}-${modelName}` : null,
    ].filter(Boolean) as string[];

    return {
      modelName,
      tableName: possibleNames[0], // Utiliser le plus probable
      region: region || 'us-east-1'
    };
  });
}

/**
 * Essaie de deviner le vrai nom de la table DynamoDB
 * en analysant les patterns communs utilisés par Amplify
 */
export function guessDynamoDBTableName(modelName: string, amplifyConfig: any): string {
  const deploymentMeta = extractAmplifyDeploymentMeta(amplifyConfig);
  const tableInfos = generateDynamoDBTableNames([modelName], deploymentMeta);
  
  return tableInfos[0]?.tableName || `${modelName}-dev`;
}

/**
 * Crée un ARN DynamoDB réaliste basé sur les conventions Amplify
 */
export function createRealisticDynamoDBArn(modelName: string, amplifyConfig: any): string {
  const region = amplifyConfig.data?.aws_region || amplifyConfig.data?.region || 'us-east-1';
  const tableName = guessDynamoDBTableName(modelName, amplifyConfig);
  
  // ARN pattern: arn:aws:dynamodb:region:account-id:table/table-name
  // Utiliser un account-id générique pour l'affichage
  return `arn:aws:dynamodb:${region}:*:table/${tableName}`;
}

/**
 * Essaie de récupérer les vrais noms des ressources via l'API AWS (si possible)
 * Note: Ceci nécessiterait des credentials AWS et des permissions appropriées
 */
export async function fetchRealResourceNames(region: string): Promise<{
  dynamodbTables: string[];
  s3Buckets: string[];
  lambdaFunctions: string[];
} | null> {
  // Cette fonction pourrait être implémentée avec AWS SDK
  // mais nécessiterait des credentials appropriés
  
  console.warn('fetchRealResourceNames: AWS SDK integration not implemented in browser context');
  return null;
}

/**
 * Valide si une table DynamoDB existe (conceptuellement)
 * En pratique, ceci nécessiterait une API backend
 */
export function validateTableExists(tableName: string, region: string): Promise<boolean> {
  // En production, vous pourriez avoir une API backend qui vérifie l'existence
  // Pour l'instant, on assume que la table existe si elle est dans amplify_outputs.json
  return Promise.resolve(true);
}

/**
 * Formate les noms de ressources pour l'affichage
 */
export function formatResourceDisplayName(resourceName: string, resourceType: string): string {
  // Supprimer les préfixes communs pour un affichage plus propre
  const cleaned = resourceName
    .replace(/^amplify-/, '')
    .replace(/-[a-z0-9]{8,}-dev$/, '-dev') // Simplifier les hash longs
    .replace(/-[a-z0-9]{8,}-prod$/, '-prod');
  
  return cleaned;
}

/**
 * Génère des suggestions de noms de ressources basées sur les patterns Amplify
 */
export function suggestResourceNames(modelName: string, environment: string = 'dev'): {
  tableName: string;
  displayName: string;
  description: string;
}[] {
  return [
    {
      tableName: `${modelName}-${environment}`,
      displayName: `${modelName} (${environment})`,
      description: `Table DynamoDB pour le modèle ${modelName} en environnement ${environment}`
    },
    {
      tableName: `amplify-${modelName}-${environment}`,
      displayName: `Amplify ${modelName} (${environment})`,
      description: `Table Amplify pour ${modelName}`
    }
  ];
}
