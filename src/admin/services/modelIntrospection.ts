/**
 * Model Introspection Service
 * Analyzes and manages AWS Amplify models and admin configuration
 */

'use client';

import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { adminConfig } from '../config/models';
import { extractAmplifyDeploymentMeta, guessDynamoDBTableName, createRealisticDynamoDBArn } from '@/lib/amplify-resource-utils';

export interface AmplifyModel {
  name: string;
  pluralName: string;
  fields: Record<string, AmplifyModelField>;
  syncable: boolean;
  attributes: ModelAttribute[];
  primaryKeyInfo: PrimaryKeyInfo;
  tableName: string;
  arn: string;
  region: string;
  operations: string[];
  authRules: AuthRule[];
}

export interface AmplifyModelField {
  name: string;
  type: string;
  isArray: boolean;
  isRequired: boolean;
  isReadOnly?: boolean;
  attributes: any[];
  relationship?: {
    type: 'hasOne' | 'hasMany' | 'belongsTo';
    target: string;
  };
}

export interface ModelAttribute {
  type: string;
  properties: any;
}

export interface PrimaryKeyInfo {
  isCustomPrimaryKey: boolean;
  primaryKeyFieldName: string;
  sortKeyFieldNames: string[];
}

export interface AuthRule {
  allow: string;
  provider?: string;
  operations: string[];
  groups?: string[];
}

export interface AdminModel {
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
  source: 'admin_config';
}

export interface ModelIntrospectionResult {
  amplifyModels: AmplifyModel[];
  adminModels: AdminModel[];
  deploymentInfo: {
    appId?: string;
    environment?: string;
    region: string;
    stackName?: string;
  };
  statistics: {
    totalModels: number;
    amplifyModelsCount: number;
    adminModelsCount: number;
    tablesCount: number;
    fieldsCount: number;
  };
}

/**
 * Service for model introspection and analysis
 */
export class ModelIntrospectionService {
  private static instance: ModelIntrospectionService;

  static getInstance(): ModelIntrospectionService {
    if (!ModelIntrospectionService.instance) {
      ModelIntrospectionService.instance = new ModelIntrospectionService();
    }
    return ModelIntrospectionService.instance;
  }

  /**
   * Get comprehensive model information
   */
  async getModelIntrospection(): Promise<ModelIntrospectionResult> {
    try {
      const amplifyConfig = Amplify.getConfig();
      const amplifyModels = this.getAmplifyModels(amplifyConfig);
      const adminModels = this.getAdminModels();
      const deploymentInfo = extractAmplifyDeploymentMeta(amplifyConfig);

      const statistics = {
        totalModels: amplifyModels.length + adminModels.length,
        amplifyModelsCount: amplifyModels.length,
        adminModelsCount: adminModels.length,
        tablesCount: amplifyModels.length, // Each Amplify model has a DynamoDB table
        fieldsCount: amplifyModels.reduce((total, model) => total + Object.keys(model.fields).length, 0)
      };

      return {
        amplifyModels,
        adminModels,
        deploymentInfo: {
          ...deploymentInfo,
          region: deploymentInfo.region || 'us-east-1'
        },
        statistics
      };
    } catch (error) {
      console.error('Error in model introspection:', error);
      return this.getFallbackIntrospection();
    }
  }

  /**
   * Extract Amplify models from configuration
   */
  private getAmplifyModels(amplifyConfig: any): AmplifyModel[] {
    const models: AmplifyModel[] = [];

    if (amplifyConfig?.data?.model_introspection?.models) {
      const region = amplifyConfig.data?.aws_region || amplifyConfig.data?.region || 'us-east-1';
      const modelsConfig = amplifyConfig.data.model_introspection.models;

      Object.entries(modelsConfig).forEach(([modelName, modelInfo]: [string, any]) => {
        const tableName = guessDynamoDBTableName(modelName, amplifyConfig);
        const arn = createRealisticDynamoDBArn(modelName, amplifyConfig);

        // Extract auth rules
        const authRules: AuthRule[] = [];
        const authAttribute = modelInfo.attributes?.find((attr: any) => attr.type === 'auth');
        if (authAttribute?.properties?.rules) {
          authAttribute.properties.rules.forEach((rule: any) => {
            authRules.push({
              allow: rule.allow,
              provider: rule.provider,
              operations: rule.operations || ['create', 'read', 'update', 'delete'],
              groups: rule.groups
            });
          });
        }

        // Convert fields
        const fields: Record<string, AmplifyModelField> = {};
        Object.entries(modelInfo.fields).forEach(([fieldName, fieldInfo]: [string, any]) => {
          fields[fieldName] = {
            name: fieldName,
            type: fieldInfo.type,
            isArray: fieldInfo.isArray || false,
            isRequired: fieldInfo.isRequired || false,
            isReadOnly: fieldInfo.isReadOnly || false,
            attributes: fieldInfo.attributes || []
          };
        });

        models.push({
          name: modelName,
          pluralName: modelInfo.pluralName || `${modelName}s`,
          fields,
          syncable: modelInfo.syncable || false,
          attributes: modelInfo.attributes || [],
          primaryKeyInfo: modelInfo.primaryKeyInfo || {
            isCustomPrimaryKey: false,
            primaryKeyFieldName: 'id',
            sortKeyFieldNames: []
          },
          tableName,
          arn,
          region,
          operations: authRules.flatMap(rule => rule.operations),
          authRules
        });
      });
    }

    return models;
  }

  /**
   * Extract admin models from configuration
   */
  private getAdminModels(): AdminModel[] {
    const models: AdminModel[] = [];

    Object.entries(adminConfig.models).forEach(([modelName, modelConfig]) => {
      models.push({
        name: modelName,
        verbose_name: modelConfig.verbose_name || modelName,
        verbose_name_plural: modelConfig.verbose_name_plural || `${modelName}s`,
        fieldCount: modelConfig.fields.length,
        permissions: {
          add: modelConfig.permissions?.add ?? true,
          change: modelConfig.permissions?.change ?? true,
          delete: modelConfig.permissions?.delete ?? true,
          view: modelConfig.permissions?.view ?? true
        },
        list_display: modelConfig.list_display,
        search_fields: modelConfig.search_fields,
        actions: modelConfig.actions?.map(action => action.name) || [],
        source: 'admin_config'
      });
    });

    return models;
  }

  /**
   * Get available operations for a model
   */
  getModelOperations(modelName: string): string[] {
    try {
      const amplifyConfig = Amplify.getConfig() as any;
      const models = amplifyConfig?.data?.model_introspection?.models;
      
      if (models && models[modelName]) {
        const authAttribute = models[modelName].attributes?.find((attr: any) => attr.type === 'auth');
        if (authAttribute?.properties?.rules) {
          return authAttribute.properties.rules.flatMap((rule: any) => rule.operations || []);
        }
      }

      return ['create', 'read', 'update', 'delete', 'list'];
    } catch (error) {
      console.error(`Error getting operations for model ${modelName}:`, error);
      return [];
    }
  }

  /**
   * Get model statistics
   */
  getModelStatistics(model: AmplifyModel): Record<string, any> {
    return {
      fieldsCount: Object.keys(model.fields).length,
      requiredFieldsCount: Object.values(model.fields).filter(field => field.isRequired).length,
      readOnlyFieldsCount: Object.values(model.fields).filter(field => field.isReadOnly).length,
      relationshipFieldsCount: Object.values(model.fields).filter(field => field.relationship).length,
      authRulesCount: model.authRules.length,
      operationsCount: Array.from(new Set(model.operations)).length,
      hasPrimaryKey: model.primaryKeyInfo.primaryKeyFieldName !== null,
      hasCustomPrimaryKey: model.primaryKeyInfo.isCustomPrimaryKey,
      isSyncable: model.syncable
    };
  }

  /**
   * Fallback when introspection fails
   */
  private getFallbackIntrospection(): ModelIntrospectionResult {
    return {
      amplifyModels: [],
      adminModels: this.getAdminModels(),
      deploymentInfo: {
        region: 'us-east-1'
      },
      statistics: {
        totalModels: 0,
        amplifyModelsCount: 0,
        adminModelsCount: this.getAdminModels().length,
        tablesCount: 0,
        fieldsCount: 0
      }
    };
  }

  /**
   * Generate GraphQL operations for a model
   */
  generateGraphQLOperations(modelName: string): Record<string, string> {
    const lowerModelName = modelName.toLowerCase();
    const pluralName = `${lowerModelName}s`;

    return {
      list: `query List${modelName}s($filter: Model${modelName}FilterInput) {
  list${modelName}s(filter: $filter) {
    items {
      id
      createdAt
      updatedAt
    }
  }
}`,
      get: `query Get${modelName}($id: ID!) {
  get${modelName}(id: $id) {
    id
    createdAt
    updatedAt
  }
}`,
      create: `mutation Create${modelName}($input: Create${modelName}Input!) {
  create${modelName}(input: $input) {
    id
    createdAt
    updatedAt
  }
}`,
      update: `mutation Update${modelName}($input: Update${modelName}Input!) {
  update${modelName}(input: $input) {
    id
    createdAt
    updatedAt
  }
}`,
      delete: `mutation Delete${modelName}($input: Delete${modelName}Input!) {
  delete${modelName}(input: $input) {
    id
  }
}`
    };
  }
}
