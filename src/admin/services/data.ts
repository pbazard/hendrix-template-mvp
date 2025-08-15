/**
 * Service de gestion des données pour l'interface d'administration
 * Compatible avec AWS Amplify DataStore et GraphQL
 */

import { generateClient } from 'aws-amplify/api';
import { PaginatedData, SearchQuery, FilterOption, AuditLog, ActionType } from '../types';

const client = generateClient();

export class DataService {
  /**
   * Récupère une liste paginée d'éléments avec filtres et recherche
   */
  static async list<T>(
    modelName: string,
    query: SearchQuery = { filters: [] }
  ): Promise<PaginatedData<T>> {
    try {
      const { q, filters, ordering, page = 1, pageSize = 25 } = query;
      
      // Construction de la requête GraphQL
      const graphqlQuery = this.buildGraphQLListQuery(modelName, {
        search: q,
        filters,
        orderBy: ordering,
        limit: pageSize,
        offset: (page - 1) * pageSize
      });

      const response = await client.graphql({
        query: graphqlQuery
      });

      const data = response.data as any;
      const items = data[`list${modelName}s`]?.items || [];
      const total = data[`list${modelName}s`]?.total || 0;

      return {
        items,
        total,
        page,
        pageSize,
        hasNext: page * pageSize < total,
        hasPrevious: page > 1
      };
    } catch (error) {
      console.error(`Erreur lors du listing de ${modelName}:`, error);
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize,
        hasNext: false,
        hasPrevious: false
      };
    }
  }

  /**
   * Récupère un élément par son ID
   */
  static async get<T>(modelName: string, id: string): Promise<T | null> {
    try {
      const graphqlQuery = this.buildGraphQLGetQuery(modelName);
      
      const response = await client.graphql({
        query: graphqlQuery,
        variables: { id }
      });

      const data = response.data as any;
      return data[`get${modelName}`] || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de ${modelName} ${id}:`, error);
      return null;
    }
  }

  /**
   * Crée un nouvel élément
   */
  static async create<T>(modelName: string, input: Partial<T>): Promise<T | null> {
    try {
      // Log de l'audit
      await this.logAction(ActionType.CREATE, modelName, '', JSON.stringify(input));

      const graphqlMutation = this.buildGraphQLCreateMutation(modelName);
      
      const response = await client.graphql({
        query: graphqlMutation,
        variables: { input }
      });

      const data = response.data as any;
      const created = data[`create${modelName}`];
      
      if (created) {
        await this.logAction(ActionType.CREATE, modelName, created.id, `Créé: ${this.getObjectRepr(created)}`);
      }

      return created;
    } catch (error) {
      console.error(`Erreur lors de la création de ${modelName}:`, error);
      return null;
    }
  }

  /**
   * Met à jour un élément
   */
  static async update<T>(modelName: string, id: string, input: Partial<T>): Promise<T | null> {
    try {
      // Récupérer l'état actuel pour l'audit
      const current = await this.get(modelName, id);
      
      const graphqlMutation = this.buildGraphQLUpdateMutation(modelName);
      
      const response = await client.graphql({
        query: graphqlMutation,
        variables: { input: { id, ...input } }
      });

      const data = response.data as any;
      const updated = data[`update${modelName}`];
      
      if (updated) {
        const changes = this.getChanges(current, updated);
        await this.logAction(ActionType.UPDATE, modelName, id, `Modifié: ${changes}`);
      }

      return updated;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de ${modelName} ${id}:`, error);
      return null;
    }
  }

  /**
   * Supprime un élément
   */
  static async delete(modelName: string, id: string): Promise<boolean> {
    try {
      // Récupérer l'élément avant suppression pour l'audit
      const item = await this.get(modelName, id);
      
      const graphqlMutation = this.buildGraphQLDeleteMutation(modelName);
      
      await client.graphql({
        query: graphqlMutation,
        variables: { input: { id } }
      });

      if (item) {
        await this.logAction(ActionType.DELETE, modelName, id, `Supprimé: ${this.getObjectRepr(item)}`);
      }

      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${modelName} ${id}:`, error);
      return false;
    }
  }

  /**
   * Suppression en lot
   */
  static async bulkDelete(modelName: string, ids: string[]): Promise<number> {
    let deletedCount = 0;
    
    for (const id of ids) {
      const success = await this.delete(modelName, id);
      if (success) deletedCount++;
    }

    await this.logAction(
      ActionType.DELETE,
      modelName,
      ids.join(','),
      `Suppression en lot: ${deletedCount}/${ids.length} éléments supprimés`
    );

    return deletedCount;
  }

  /**
   * Export CSV
   */
  static async exportToCsv<T>(
    modelName: string,
    query: SearchQuery,
    fields: string[]
  ): Promise<string> {
    try {
      // Récupérer toutes les données (sans pagination)
      const allData = await this.list<T>(modelName, {
        ...query,
        pageSize: 10000 // Grande limite pour récupérer tout
      });

      const csvLines: string[] = [];
      
      // En-têtes
      csvLines.push(fields.join(','));
      
      // Données
      allData.items.forEach(item => {
        const row = fields.map(field => {
          const value = (item as any)[field];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        });
        csvLines.push(row.join(','));
      });

      await this.logAction(
        ActionType.READ,
        modelName,
        '',
        `Export CSV: ${allData.items.length} éléments exportés`
      );

      return csvLines.join('\n');
    } catch (error) {
      console.error(`Erreur lors de l'export CSV de ${modelName}:`, error);
      return '';
    }
  }

  /**
   * Enregistre une action dans le journal d'audit
   */
  private static async logAction(
    action: ActionType,
    model: string,
    objectId: string,
    changeMessage: string
  ): Promise<void> {
    try {
      // Récupérer l'utilisateur actuel
      const userResponse = await fetch('/api/admin/current-user');
      const user = await userResponse.json();

      const auditLog: Partial<AuditLog> = {
        user: user?.username || 'Système',
        action,
        model,
        objectId,
        objectRepr: changeMessage,
        changeMessage,
        timestamp: new Date(),
        ipAddress: await this.getClientIP()
      };

      // Sauvegarder dans la base de données
      await this.create('AuditLog', auditLog);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'audit:', error);
    }
  }

  /**
   * Construit une requête GraphQL pour lister des éléments
   */
  private static buildGraphQLListQuery(modelName: string, options: any): string {
    return `
      query List${modelName}s($limit: Int, $offset: Int) {
        list${modelName}s(limit: $limit, offset: $offset) {
          items {
            id
            createdAt
            updatedAt
            # Ajoutez ici les champs spécifiques à chaque modèle
          }
          total
        }
      }
    `;
  }

  /**
   * Construit une requête GraphQL pour récupérer un élément
   */
  private static buildGraphQLGetQuery(modelName: string): string {
    return `
      query Get${modelName}($id: ID!) {
        get${modelName}(id: $id) {
          id
          createdAt
          updatedAt
          # Ajoutez ici les champs spécifiques à chaque modèle
        }
      }
    `;
  }

  /**
   * Construit une mutation GraphQL pour créer un élément
   */
  private static buildGraphQLCreateMutation(modelName: string): string {
    return `
      mutation Create${modelName}($input: Create${modelName}Input!) {
        create${modelName}(input: $input) {
          id
          createdAt
          updatedAt
          # Ajoutez ici les champs spécifiques à chaque modèle
        }
      }
    `;
  }

  /**
   * Construit une mutation GraphQL pour mettre à jour un élément
   */
  private static buildGraphQLUpdateMutation(modelName: string): string {
    return `
      mutation Update${modelName}($input: Update${modelName}Input!) {
        update${modelName}(input: $input) {
          id
          createdAt
          updatedAt
          # Ajoutez ici les champs spécifiques à chaque modèle
        }
      }
    `;
  }

  /**
   * Construit une mutation GraphQL pour supprimer un élément
   */
  private static buildGraphQLDeleteMutation(modelName: string): string {
    return `
      mutation Delete${modelName}($input: Delete${modelName}Input!) {
        delete${modelName}(input: $input) {
          id
        }
      }
    `;
  }

  /**
   * Obtient une représentation textuelle d'un objet
   */
  private static getObjectRepr(obj: any): string {
    if (obj.name) return obj.name;
    if (obj.title) return obj.title;
    if (obj.content) return obj.content.substring(0, 50);
    if (obj.username) return obj.username;
    if (obj.email) return obj.email;
    return obj.id || 'Objet sans nom';
  }

  /**
   * Compare deux objets et retourne les changements
   */
  private static getChanges(oldObj: any, newObj: any): string {
    if (!oldObj || !newObj) return 'Changement détecté';
    
    const changes: string[] = [];
    const keys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
    
    keys.forEach(key => {
      if (oldObj[key] !== newObj[key]) {
        changes.push(`${key}: ${oldObj[key]} → ${newObj[key]}`);
      }
    });

    return changes.length > 0 ? changes.join(', ') : 'Aucun changement détecté';
  }

  /**
   * Obtient l'adresse IP du client
   */
  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('/api/admin/client-ip');
      const data = await response.json();
      return data.ip || 'Inconnue';
    } catch {
      return 'Inconnue';
    }
  }
}
