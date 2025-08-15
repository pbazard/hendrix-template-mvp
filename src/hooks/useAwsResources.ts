'use client';

import { useState, useEffect } from 'react';

export interface AwsResource {
  id: string;
  name: string;
  type: string;
  service: string;
  region?: string;
  status?: string;
  description?: string;
  arn?: string;
  consoleUrl?: string;
}

export interface AwsResourcesByService {
  [service: string]: AwsResource[];
}

// Mock data representing typical AWS resources created by Amplify
const mockAwsResources: AwsResource[] = [
  // DynamoDB
  {
    id: 'todo-table-dev',
    name: 'Todo-dev',
    type: 'Table',
    service: 'DynamoDB',
    region: 'us-east-1',
    status: 'Active',
    description: 'Main Todo items storage table',
    arn: 'arn:aws:dynamodb:us-east-1:123456789012:table/Todo-dev',
    consoleUrl: 'https://console.aws.amazon.com/dynamodbv2/home?region=us-east-1#table?name=Todo-dev'
  },
  
  // IAM Roles
  {
    id: 'amplify-execution-role',
    name: 'amplify-todo-app-execution-role',
    type: 'Role',
    service: 'IAM',
    region: 'Global',
    status: 'Active',
    description: 'Execution role for Amplify functions',
    arn: 'arn:aws:iam::123456789012:role/amplify-todo-app-execution-role',
    consoleUrl: 'https://console.aws.amazon.com/iam/home#/roles/amplify-todo-app-execution-role'
  },
  {
    id: 'unauth-role',
    name: 'amplify-todo-app-unauth-role',
    type: 'Role',
    service: 'IAM',
    region: 'Global',
    status: 'Active',
    description: 'Role for unauthenticated users',
    arn: 'arn:aws:iam::123456789012:role/amplify-todo-app-unauth-role',
    consoleUrl: 'https://console.aws.amazon.com/iam/home#/roles/amplify-todo-app-unauth-role'
  },
  
  // Cognito
  {
    id: 'user-pool',
    name: 'todo-app-user-pool',
    type: 'User Pool',
    service: 'Cognito',
    region: 'us-east-1',
    status: 'Active',
    description: 'User authentication pool',
    arn: 'arn:aws:cognito-idp:us-east-1:123456789012:userpool/us-east-1_abcdefgh',
    consoleUrl: 'https://console.aws.amazon.com/cognito/users/?region=us-east-1#/pool/us-east-1_abcdefgh'
  },
  {
    id: 'identity-pool',
    name: 'todo-app-identity-pool',
    type: 'Identity Pool',
    service: 'Cognito',
    region: 'us-east-1',
    status: 'Active',
    description: 'Federated identity pool',
    arn: 'arn:aws:cognito-identity:us-east-1:123456789012:identitypool/us-east-1:12345678-1234-1234-1234-123456789012',
    consoleUrl: 'https://console.aws.amazon.com/cognito/federated/?region=us-east-1#/pool/us-east-1:12345678-1234-1234-1234-123456789012'
  },
  
  // AppSync
  {
    id: 'graphql-api',
    name: 'todo-app-graphql-api',
    type: 'GraphQL API',
    service: 'AppSync',
    region: 'us-east-1',
    status: 'Active',
    description: 'Main GraphQL API endpoint',
    arn: 'arn:aws:appsync:us-east-1:123456789012:apis/abcdefghijklmnopqrstuvwxyz',
    consoleUrl: 'https://console.aws.amazon.com/appsync/home?region=us-east-1#/abcdefghijklmnopqrstuvwxyz/home'
  },
  
  // Lambda
  {
    id: 'resolver-function',
    name: 'todo-resolver-function',
    type: 'Function',
    service: 'Lambda',
    region: 'us-east-1',
    status: 'Active',
    description: 'GraphQL resolver function',
    arn: 'arn:aws:lambda:us-east-1:123456789012:function:todo-resolver-function',
    consoleUrl: 'https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/todo-resolver-function'
  },
  
  // CloudFormation
  {
    id: 'amplify-stack',
    name: 'amplify-todo-app-dev',
    type: 'Stack',
    service: 'CloudFormation',
    region: 'us-east-1',
    status: 'CREATE_COMPLETE',
    description: 'Main Amplify application stack',
    arn: 'arn:aws:cloudformation:us-east-1:123456789012:stack/amplify-todo-app-dev/12345678-1234-1234-1234-123456789012',
    consoleUrl: 'https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/stackinfo?stackId=arn:aws:cloudformation:us-east-1:123456789012:stack/amplify-todo-app-dev/12345678-1234-1234-1234-123456789012'
  },
  
  // S3
  {
    id: 'deployment-bucket',
    name: 'amplify-todo-app-deployment-bucket',
    type: 'Bucket',
    service: 'S3',
    region: 'us-east-1',
    status: 'Active',
    description: 'Deployment artifacts storage',
    arn: 'arn:aws:s3:::amplify-todo-app-deployment-bucket',
    consoleUrl: 'https://console.aws.amazon.com/s3/buckets/amplify-todo-app-deployment-bucket?region=us-east-1'
  }
];

export function useAwsResources() {
  const [resources, setResources] = useState<AwsResource[]>([]);
  const [resourcesByService, setResourcesByService] = useState<AwsResourcesByService>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call to get AWS resources
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would call AWS APIs or Amplify CLI
        // to get actual resource information
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        setResources(mockAwsResources);
        
        // Group resources by service
        const grouped = mockAwsResources.reduce((acc, resource) => {
          if (!acc[resource.service]) {
            acc[resource.service] = [];
          }
          acc[resource.service].push(resource);
          return acc;
        }, {} as AwsResourcesByService);
        
        setResourcesByService(grouped);
        setError(null);
      } catch (err) {
        setError('Failed to load AWS resources');
        console.error('Error fetching AWS resources:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const getResourceCount = () => resources.length;
  
  const getServiceCount = () => Object.keys(resourcesByService).length;
  
  const getResourcesByService = (serviceName: string) => 
    resourcesByService[serviceName] || [];

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
