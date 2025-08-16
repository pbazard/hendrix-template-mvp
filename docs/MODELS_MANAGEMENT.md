# Models Management - AWS Amplify Introspection

## Overview

The Models Management feature provides comprehensive introspection and management of both AWS Amplify deployed models and admin interface configuration models. It automatically analyzes your Amplify deployment to show real DynamoDB table names, ARNs, authorization rules, and detailed model information.

## Features

### 🗄️ AWS Amplify Models Introspection

- **Real-time Model Detection**: Automatically discovers models from your Amplify deployment
- **DynamoDB Integration**: Shows actual table names and ARNs using Amplify naming conventions
- **Field Analysis**: Detailed field information including types, requirements, and relationships
- **Authorization Rules**: Complete analysis of auth rules and permissions
- **Operations Mapping**: Shows available GraphQL operations (create, read, update, delete)
- **Sync Capabilities**: Indicates which models support offline sync

### ⚙️ Admin Configuration Models

- **Configuration Management**: View and analyze admin interface model configurations
- **Permission Analysis**: Detailed breakdown of admin permissions
- **Field Configuration**: Display fields, search fields, and custom actions
- **Action Management**: View available admin actions and their configurations

### 📊 Statistics and Analytics

- **Model Overview**: Total counts of Amplify and admin models
- **Field Statistics**: Total field counts across all models
- **DynamoDB Tables**: Count of associated database tables
- **Deployment Information**: Region, App ID, environment details

## Usage

### Accessing Models Management

1. **From Admin Dashboard**: Click on the "Models" section in the sidebar
2. **Direct URL**: Navigate to `/admin/models`
3. **Demo Page**: Visit `/admin/models/demo` for feature overview

### Model Introspection Service

```typescript
import { ModelIntrospectionService } from '@/admin/services/modelIntrospection';

// Get model introspection data
const service = ModelIntrospectionService.getInstance();
const data = await service.getModelIntrospection();

console.log('Amplify Models:', data.amplifyModels);
console.log('Admin Models:', data.adminModels);
console.log('Statistics:', data.statistics);
```

### Using the Hook

```typescript
import { useModelIntrospection } from '@/admin/hooks/useModelIntrospection';

function MyComponent() {
  const { data, loading, error, refetch } = useModelIntrospection();
  
  if (loading) return <div>Loading models...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Amplify Models: {data?.statistics.amplifyModelsCount}</h2>
      <h2>Admin Models: {data?.statistics.adminModelsCount}</h2>
    </div>
  );
}
```

## Model Information Provided

### For Amplify Models

- **Basic Info**: Model name, plural name, syncable status
- **Fields**: Complete field definitions with types and constraints
- **Database**: DynamoDB table name and ARN
- **Authorization**: Auth rules with providers and operations
- **GraphQL**: Available operations and their permissions
- **Deployment**: Region and stack information

### For Admin Models

- **Configuration**: Verbose names and descriptions
- **Fields**: Field count and configuration details
- **Display**: List display fields and search configuration
- **Actions**: Available admin actions and permissions
- **Permissions**: Add, change, delete, and view permissions

## API Reference

### ModelIntrospectionService

#### Methods

- `getInstance()`: Get singleton instance
- `getModelIntrospection()`: Get complete model data
- `getModelOperations(modelName)`: Get available operations for a model
- `getModelStatistics(model)`: Get statistics for a specific model
- `generateGraphQLOperations(modelName)`: Generate GraphQL operation templates

### Types

```typescript
interface AmplifyModel {
  name: string;
  pluralName: string;
  fields: Record<string, AmplifyModelField>;
  syncable: boolean;
  tableName: string;
  arn: string;
  region: string;
  operations: string[];
  authRules: AuthRule[];
}

interface AdminModel {
  name: string;
  verbose_name: string;
  verbose_name_plural: string;
  fieldCount: number;
  permissions: {
    add: boolean;
    change: boolean;
    delete: boolean;
    view: boolean;
  };
  list_display: string[];
  search_fields: string[];
  actions: string[];
}
```

## Integration with Amplify

The introspection service automatically:

1. **Reads Amplify Configuration**: Uses `Amplify.getConfig()` to access deployment info
2. **Analyzes Model Introspection**: Extracts models from `model_introspection` data
3. **Generates Table Names**: Uses Amplify naming conventions to predict DynamoDB table names
4. **Creates ARNs**: Generates realistic ARNs for DynamoDB resources
5. **Extracts Auth Rules**: Parses authorization configuration from model attributes

## Deployment Information

The service extracts and displays:

- **App ID**: Amplify application identifier
- **Environment**: Current deployment environment (dev, staging, prod)
- **Region**: AWS region where resources are deployed
- **Stack Name**: CloudFormation stack name

## Error Handling

- **Graceful Fallbacks**: Falls back to admin-only models if Amplify introspection fails
- **Error Reporting**: Detailed error messages for troubleshooting
- **Loading States**: Proper loading indicators during data fetching
- **Retry Mechanism**: Ability to refetch data on demand

## File Structure

```
src/admin/
├── services/
│   └── modelIntrospection.ts     # Core introspection service
├── hooks/
│   └── useModelIntrospection.ts  # React hook for model data
└── components/
    └── AdminSidebar.tsx          # Updated with Models navigation

src/app/admin/
├── models/
│   ├── page.tsx                  # Main models management page
│   └── demo/
│       └── page.tsx              # Demo and documentation page
└── page.tsx                      # Dashboard with models overview
```

## Troubleshooting

### No Amplify Models Detected

1. Verify Amplify configuration is properly loaded
2. Check that `model_introspection` is available in config
3. Ensure models are properly deployed

### Incorrect Table Names

1. Table naming follows Amplify conventions but may vary
2. Check actual DynamoDB console for verification
3. Update naming logic in `amplify-resource-utils.ts` if needed

### Missing Authorization Rules

1. Verify auth directives are properly configured in schema
2. Check that auth attributes are present in model introspection
3. Ensure proper auth provider configuration

## Future Enhancements

- **Live DynamoDB Integration**: Real-time table status and metrics
- **Schema Evolution**: Track model changes over time
- **Performance Metrics**: Query performance and optimization suggestions
- **Custom Model Actions**: Direct model operations from the interface
- **Export/Import**: Schema export and documentation generation
