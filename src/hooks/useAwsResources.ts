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
    description: 'Main Todo items storage table'
  },
  
  // IAM Roles
  {
    id: 'amplify-execution-role',
    name: 'amplify-todo-app-execution-role',
    type: 'Role',
    service: 'IAM',
    region: 'Global',
    status: 'Active',
    description: 'Execution role for Amplify functions'
  },
  {
    id: 'unauth-role',
    name: 'amplify-todo-app-unauth-role',
    type: 'Role',
    service: 'IAM',
    region: 'Global',
    status: 'Active',
    description: 'Role for unauthenticated users'
  },
  
  // Cognito
  {
    id: 'user-pool',
    name: 'todo-app-user-pool',
    type: 'User Pool',
    service: 'Cognito',
    region: 'us-east-1',
    status: 'Active',
    description: 'User authentication pool'
  },
  {
    id: 'identity-pool',
    name: 'todo-app-identity-pool',
    type: 'Identity Pool',
    service: 'Cognito',
    region: 'us-east-1',
    status: 'Active',
    description: 'Federated identity pool'
  },
  
  // AppSync
  {
    id: 'graphql-api',
    name: 'todo-app-graphql-api',
    type: 'GraphQL API',
    service: 'AppSync',
    region: 'us-east-1',
    status: 'Active',
    description: 'Main GraphQL API endpoint'
  },
  
  // Lambda
  {
    id: 'resolver-function',
    name: 'todo-resolver-function',
    type: 'Function',
    service: 'Lambda',
    region: 'us-east-1',
    status: 'Active',
    description: 'GraphQL resolver function'
  },
  
  // CloudFormation
  {
    id: 'amplify-stack',
    name: 'amplify-todo-app-dev',
    type: 'Stack',
    service: 'CloudFormation',
    region: 'us-east-1',
    status: 'CREATE_COMPLETE',
    description: 'Main Amplify application stack'
  },
  
  // S3
  {
    id: 'deployment-bucket',
    name: 'amplify-todo-app-deployment-bucket',
    type: 'Bucket',
    service: 'S3',
    region: 'us-east-1',
    status: 'Active',
    description: 'Deployment artifacts storage'
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
