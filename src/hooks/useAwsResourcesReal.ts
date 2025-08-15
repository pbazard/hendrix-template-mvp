'use client';

import { useState, useEffect } from 'react';
import { AwsResource, AwsResourcesByService } from './useAwsResources';
import { 
  guessDynamoDBTableName, 
  extractAmplifyDeploymentMeta, 
  createRealisticDynamoDBArn,
  formatResourceDisplayName 
} from '@/lib/amplify-resource-utils';

// Interface pour les métadonnées Amplify
interface AmplifyBackendConfig {
  auth?: {
    user_pool_id?: string;
    identity_pool_id?: string;
    user_pool_client_id?: string;
    aws_region?: string;
  };
  data?: {
    url?: string;
    region?: string;
    aws_region?: string;
    default_authorization_type?: string;
    model_introspection?: {
      version: number;
      models: {
        [key: string]: {
          name: string;
          fields: Record<string, any>;
          syncable: boolean;
          pluralName: string;
          attributes: any[];
          primaryKeyInfo: any;
        };
      };
      enums: Record<string, any>;
      nonModels: Record<string, any>;
    };
  };
  storage?: {
    bucket_name?: string;
    region?: string;
  };
  functions?: {
    [key: string]: {
      name: string;
      region: string;
    };
  };
}

// Fonction pour extraire la région des URLs AWS
function extractRegionFromUrl(url: string): string {
  const match = url.match(/https:\/\/[^.]+\.([^.]+)\.amazonaws\.com/);
  return match?.[1] || 'us-east-1';
}

// Fonction pour générer l'ARN basé sur le service et la ressource
function generateArn(service: string, region: string, resourceType: string, resourceName: string, accountId: string = '123456789012'): string {
  const arnPatterns: Record<string, (region: string, resourceName: string, accountId: string) => string> = {
    'DynamoDB': (region, name, account) => `arn:aws:dynamodb:${region}:${account}:table/${name}`,
    'Cognito-UserPool': (region, name, account) => `arn:aws:cognito-idp:${region}:${account}:userpool/${name}`,
    'Cognito-IdentityPool': (region, name, account) => `arn:aws:cognito-identity:${region}:${account}:identitypool/${name}`,
    'AppSync': (region, name, account) => `arn:aws:appsync:${region}:${account}:apis/${name}`,
    'Lambda': (region, name, account) => `arn:aws:lambda:${region}:${account}:function:${name}`,
    'S3': (region, name, account) => `arn:aws:s3:::${name}`,
    'IAM': (region, name, account) => `arn:aws:iam::${account}:role/${name}`,
  };

  const pattern = arnPatterns[`${service}-${resourceType}`] || arnPatterns[service];
  return pattern ? pattern(region, resourceName, accountId) : `arn:aws:${service.toLowerCase()}:${region}:${accountId}:${resourceType}/${resourceName}`;
}

// Fonction pour générer l'URL de la console AWS
function generateConsoleUrl(service: string, region: string, resourceType: string, resourceName: string): string {
  const urlPatterns: Record<string, (region: string, name: string) => string> = {
    'DynamoDB': (region, name) => `https://console.aws.amazon.com/dynamodbv2/home?region=${region}#table?name=${name}`,
    'Cognito-UserPool': (region, name) => `https://console.aws.amazon.com/cognito/users/?region=${region}#/pool/${name}`,
    'Cognito-IdentityPool': (region, name) => `https://console.aws.amazon.com/cognito/federated/?region=${region}#/pool/${name}`,
    'AppSync': (region, name) => `https://console.aws.amazon.com/appsync/home?region=${region}#/${name}/home`,
    'Lambda': (region, name) => `https://console.aws.amazon.com/lambda/home?region=${region}#/functions/${name}`,
    'S3': (region, name) => `https://console.aws.amazon.com/s3/buckets/${name}?region=${region}`,
    'IAM': (region, name) => `https://console.aws.amazon.com/iam/home#/roles/${name}`,
    'CloudFormation': (region, name) => `https://console.aws.amazon.com/cloudformation/home?region=${region}#/stacks/stackinfo?stackId=${name}`,
  };

  const pattern = urlPatterns[`${service}-${resourceType}`] || urlPatterns[service];
  return pattern ? pattern(region, resourceName) : `https://console.aws.amazon.com/${service.toLowerCase()}/home?region=${region}`;
}

export function useAwsResourcesReal() {
  const [resources, setResources] = useState<AwsResource[]>([]);
  const [resourcesByService, setResourcesByService] = useState<AwsResourcesByService>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealAwsResources = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger la configuration Amplify
        let amplifyConfig: AmplifyBackendConfig = {};
        
        try {
          // Essayer de charger la vraie configuration Amplify
          amplifyConfig = await import('@/amplify_outputs.json');
        } catch (configError) {
          console.warn('amplify_outputs.json not found, using environment or fallback data');
          
          // Fallback: essayer de lire depuis les variables d'environnement ou d'autres sources
          amplifyConfig = {
            auth: {
              user_pool_id: process.env.NEXT_PUBLIC_USER_POOL_ID,
              identity_pool_id: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
            },
            data: {
              url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
              region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
            },
            storage: {
              bucket_name: process.env.NEXT_PUBLIC_S3_BUCKET,
              region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
            }
          };
        }

        const detectedResources: AwsResource[] = [];

        // Analyser les ressources Cognito
        if (amplifyConfig.auth?.user_pool_id) {
          const region = amplifyConfig.data?.aws_region || amplifyConfig.data?.region || amplifyConfig.auth?.aws_region || 'us-east-1';
          detectedResources.push({
            id: `user-pool-${amplifyConfig.auth.user_pool_id}`,
            name: amplifyConfig.auth.user_pool_id,
            type: 'User Pool',
            service: 'Cognito',
            region,
            status: 'Active',
            description: 'Amplify User Pool for authentication',
            arn: generateArn('Cognito', region, 'UserPool', amplifyConfig.auth.user_pool_id),
            consoleUrl: generateConsoleUrl('Cognito', region, 'UserPool', amplifyConfig.auth.user_pool_id)
          });
        }

        if (amplifyConfig.auth?.identity_pool_id) {
          const region = amplifyConfig.data?.aws_region || amplifyConfig.data?.region || amplifyConfig.auth?.aws_region || 'us-east-1';
          detectedResources.push({
            id: `identity-pool-${amplifyConfig.auth.identity_pool_id}`,
            name: amplifyConfig.auth.identity_pool_id,
            type: 'Identity Pool',
            service: 'Cognito',
            region,
            status: 'Active',
            description: 'Amplify Identity Pool for federated identities',
            arn: generateArn('Cognito', region, 'IdentityPool', amplifyConfig.auth.identity_pool_id),
            consoleUrl: generateConsoleUrl('Cognito', region, 'IdentityPool', amplifyConfig.auth.identity_pool_id)
          });
        }

        // Analyser les modèles DynamoDB à partir de model_introspection
        if (amplifyConfig.data?.model_introspection?.models) {
          const region = amplifyConfig.data?.aws_region || amplifyConfig.data?.region || 'us-east-1';
          const models = amplifyConfig.data.model_introspection.models;
          const deploymentMeta = extractAmplifyDeploymentMeta(amplifyConfig);
          
          Object.entries(models).forEach(([modelName, modelInfo]) => {
            // Générer le nom de la table DynamoDB le plus probable
            const tableName = guessDynamoDBTableName(modelName, amplifyConfig);
            const displayName = formatResourceDisplayName(tableName, 'Table');
            
            // Créer un ARN réaliste
            const tableArn = createRealisticDynamoDBArn(modelName, amplifyConfig);
            
            detectedResources.push({
              id: `dynamodb-table-${modelName.toLowerCase()}`,
              name: displayName,
              type: 'Table',
              service: 'DynamoDB',
              region,
              status: 'Active',
              description: `Table DynamoDB pour le modèle ${modelName} (${Object.keys(modelInfo.fields).length} champs: ${Object.keys(modelInfo.fields).slice(0, 3).join(', ')}${Object.keys(modelInfo.fields).length > 3 ? '...' : ''})`,
              arn: tableArn,
              consoleUrl: generateConsoleUrl('DynamoDB', region, 'Table', tableName)
            });
          });
        }

        // Analyser les ressources AppSync/GraphQL
        if (amplifyConfig.data?.url) {
          const region = amplifyConfig.data.aws_region || amplifyConfig.data.region || extractRegionFromUrl(amplifyConfig.data.url);
          const apiId = amplifyConfig.data.url.split('/')[2].split('.')[0];
          
          detectedResources.push({
            id: `appsync-${apiId}`,
            name: `amplify-graphql-api-${apiId}`,
            type: 'GraphQL API',
            service: 'AppSync',
            region,
            status: 'Active',
            description: 'Main GraphQL API endpoint created by Amplify',
            arn: generateArn('AppSync', region, 'API', apiId),
            consoleUrl: generateConsoleUrl('AppSync', region, 'API', apiId)
          });
        }

        // Analyser les ressources S3
        if (amplifyConfig.storage?.bucket_name) {
          const region = amplifyConfig.storage.region || 'us-east-1';
          detectedResources.push({
            id: `s3-${amplifyConfig.storage.bucket_name}`,
            name: amplifyConfig.storage.bucket_name,
            type: 'Bucket',
            service: 'S3',
            region,
            status: 'Active',
            description: 'S3 bucket for file storage',
            arn: generateArn('S3', region, 'Bucket', amplifyConfig.storage.bucket_name),
            consoleUrl: generateConsoleUrl('S3', region, 'Bucket', amplifyConfig.storage.bucket_name)
          });
        }

        // Si aucune ressource n'est détectée, utiliser des données d'exemple
        if (detectedResources.length === 0) {
          console.info('No real AWS resources detected, showing example resources');
          detectedResources.push(
            {
              id: 'example-table',
              name: 'amplify-todo-table-dev',
              type: 'Table',
              service: 'DynamoDB',
              region: 'us-east-1',
              status: 'Active',
              description: 'Example DynamoDB table (replace with real resources)',
              arn: generateArn('DynamoDB', 'us-east-1', 'Table', 'amplify-todo-table-dev'),
              consoleUrl: generateConsoleUrl('DynamoDB', 'us-east-1', 'Table', 'amplify-todo-table-dev')
            }
          );
        }

        // Grouper par service
        const grouped = detectedResources.reduce((acc, resource) => {
          if (!acc[resource.service]) {
            acc[resource.service] = [];
          }
          acc[resource.service].push(resource);
          return acc;
        }, {} as AwsResourcesByService);

        setResources(detectedResources);
        setResourcesByService(grouped);
        
      } catch (err) {
        console.error('Error fetching AWS resources:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch AWS resources');
      } finally {
        setLoading(false);
      }
    };

    fetchRealAwsResources();
  }, []);

  const getResourceCount = () => resources.length;
  const getServiceCount = () => Object.keys(resourcesByService).length;
  const getResourcesByService = (serviceName: string) => resourcesByService[serviceName] || [];

  return {
    resources,
    resourcesByService,
    loading,
    error,
    getResourceCount,
    getServiceCount,
    getResourcesByService,
  };
}
