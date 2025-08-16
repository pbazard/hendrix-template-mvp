/**
 * Model CRUD Service
 * Provides Create, Read, Update, Delete operations for Amplify models
 */

'use client';

import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

export interface CrudOperation {
  operation: 'create' | 'read' | 'update' | 'delete' | 'list';
  modelName: string;
  data?: any;
  id?: string;
  filter?: any;
  limit?: number;
}

export interface CrudResult {
  success: boolean;
  data?: any;
  error?: string;
  operation: string;
  modelName: string;
}

export class ModelCrudService {
  private static instance: ModelCrudService;
  private client: any;

  private constructor() {
    this.client = generateClient<Schema>();
  }

  static getInstance(): ModelCrudService {
    if (!ModelCrudService.instance) {
      ModelCrudService.instance = new ModelCrudService();
    }
    return ModelCrudService.instance;
  }

  /**
   * Create a new record for the specified model
   */
  async create(modelName: string, data: any): Promise<CrudResult> {
    try {
      // Get the model from the client
      const model = this.getModelFromClient(modelName);
      if (!model) {
        return {
          success: false,
          error: `Model ${modelName} not found`,
          operation: 'create',
          modelName
        };
      }

      const result = await model.create(data);
      return {
        success: true,
        data: result.data,
        operation: 'create',
        modelName
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'create',
        modelName
      };
    }
  }

  /**
   * Read a specific record by ID
   */
  async read(modelName: string, id: string): Promise<CrudResult> {
    try {
      const model = this.getModelFromClient(modelName);
      if (!model) {
        return {
          success: false,
          error: `Model ${modelName} not found`,
          operation: 'read',
          modelName
        };
      }

      const result = await model.get({ id });
      return {
        success: true,
        data: result.data,
        operation: 'read',
        modelName
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'read',
        modelName
      };
    }
  }

  /**
   * Update a record
   */
  async update(modelName: string, id: string, data: any): Promise<CrudResult> {
    try {
      const model = this.getModelFromClient(modelName);
      if (!model) {
        return {
          success: false,
          error: `Model ${modelName} not found`,
          operation: 'update',
          modelName
        };
      }

      const result = await model.update({ id, ...data });
      return {
        success: true,
        data: result.data,
        operation: 'update',
        modelName
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'update',
        modelName
      };
    }
  }

  /**
   * Delete a record
   */
  async delete(modelName: string, id: string): Promise<CrudResult> {
    try {
      const model = this.getModelFromClient(modelName);
      if (!model) {
        return {
          success: false,
          error: `Model ${modelName} not found`,
          operation: 'delete',
          modelName
        };
      }

      const result = await model.delete({ id });
      return {
        success: true,
        data: result.data,
        operation: 'delete',
        modelName
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'delete',
        modelName
      };
    }
  }

  /**
   * List records with optional filtering
   */
  async list(modelName: string, options?: { filter?: any; limit?: number }): Promise<CrudResult> {
    try {
      const model = this.getModelFromClient(modelName);
      if (!model) {
        return {
          success: false,
          error: `Model ${modelName} not found`,
          operation: 'list',
          modelName
        };
      }

      let query = model.list();
      
      if (options?.filter) {
        query = query.filter(options.filter);
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const result = await query;
      return {
        success: true,
        data: result.data,
        operation: 'list',
        modelName
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        operation: 'list',
        modelName
      };
    }
  }

  /**
   * Get model from client by name
   */
  private getModelFromClient(modelName: string): any {
    try {
      // Convert model name to proper case for client access
      const clientKey = modelName.charAt(0).toUpperCase() + modelName.slice(1);
      return this.client.models[clientKey];
    } catch (error) {
      console.error(`Error accessing model ${modelName}:`, error);
      return null;
    }
  }

  /**
   * Get available operations for a model
   */
  getAvailableOperations(modelName: string): string[] {
    const model = this.getModelFromClient(modelName);
    if (!model) return [];

    const operations = [];
    
    // Check which operations are available
    if (typeof model.create === 'function') operations.push('create');
    if (typeof model.get === 'function') operations.push('read');
    if (typeof model.update === 'function') operations.push('update');
    if (typeof model.delete === 'function') operations.push('delete');
    if (typeof model.list === 'function') operations.push('list');

    return operations;
  }

  /**
   * Validate data against model schema
   */
  validateData(modelName: string, data: any, operation: 'create' | 'update'): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Basic validation - this could be enhanced with actual schema validation
    if (!data || typeof data !== 'object') {
      errors.push('Data must be a valid object');
    }

    // For create operations, ensure required fields are present
    if (operation === 'create') {
      // This would need to be enhanced with actual model field requirements
      if (!data.id && modelName !== 'Todo') { // Some models auto-generate IDs
        // Skip ID validation for models that auto-generate
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
