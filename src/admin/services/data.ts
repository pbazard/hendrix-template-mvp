/**
 * Service de gestion des données pour l'interface d'administration Hendrix
 * VERSION DÉMO pour le build - À remplacer par l'implémentation réelle
 */

import { PaginatedData, SearchQuery, FilterOption, AuditLog, ActionType } from '../types';

export class DataService {
  /**
   * Liste les éléments d'un modèle (version démo)
   */
  static async list<T = any>(
    modelName: string,
    query: SearchQuery = { filters: [] }
  ): Promise<PaginatedData<T>> {
    console.log('Liste des éléments (démo):', modelName, query);

    // Données de démonstration
    const demoData: Record<string, any[]> = {
      'User': [
        { id: '1', username: 'admin', email: 'admin@demo.com', groups: ['administrators'] },
        { id: '2', username: 'staff', email: 'staff@demo.com', groups: ['staff'] }
      ],
      'Todo': [
        { id: '1', title: 'Tâche exemple 1', completed: false, createdAt: new Date().toISOString() },
        { id: '2', title: 'Tâche exemple 2', completed: true, createdAt: new Date().toISOString() },
        { id: '3', title: 'Tâche exemple 3', completed: false, createdAt: new Date().toISOString() }
      ],
      'AuditLog': [
        {
          id: '1',
          user: 'admin',
          action: 'CREATE',
          model: 'Todo',
          objectId: '1',
          objectRepr: 'Tâche exemple 1',
          changeMessage: 'Création de la tâche',
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          user: 'admin',
          action: 'UPDATE',
          model: 'Todo',
          objectId: '2',
          objectRepr: 'Tâche exemple 2',
          changeMessage: 'Mise à jour de la tâche',
          timestamp: new Date().toISOString()
        }
      ]
    };

    const items = demoData[modelName] || [];
    const limit = query.pageSize || 20;
    const offset = ((query.page || 1) - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      items: paginatedItems as T[],
      total: items.length,
      page: query.page || 1,
      pageSize: limit,
      hasNext: offset + limit < items.length,
      hasPrevious: offset > 0
    };
  }

  /**
   * Récupère un élément par son ID (version démo)
   */
  static async get<T = any>(modelName: string, id: string): Promise<T | null> {
    console.log('Récupération élément (démo):', modelName, id);
    
    const listResult = await this.list<T>(modelName);
    const item = listResult.items.find((item: any) => item.id === id);
    return item || null;
  }

  /**
   * Crée un nouvel élément (version démo)
   */
  static async create<T = any>(modelName: string, data: Partial<T>): Promise<T | null> {
    console.log('Création élément (démo):', modelName, data);
    
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newItem as T;
  }

  /**
   * Met à jour un élément (version démo)
   */
  static async update<T = any>(modelName: string, id: string, data: Partial<T>): Promise<T | null> {
    console.log('Mise à jour élément (démo):', modelName, id, data);
    
    const existingItem = await this.get<T>(modelName, id);
    if (!existingItem) {
      return null;
    }

    const updatedItem = {
      ...existingItem,
      ...data,
      updatedAt: new Date().toISOString()
    };

    return updatedItem;
  }

  /**
   * Supprime un élément (version démo)
   */
  static async delete(modelName: string, id: string): Promise<void> {
    console.log('Suppression élément (démo):', modelName, id);
  }

  /**
   * Recherche dans les éléments (version démo)
   */
  static async search<T = any>(
    modelName: string,
    query: SearchQuery
  ): Promise<PaginatedData<T>> {
    console.log('Recherche (démo):', modelName, query);
    return this.list<T>(modelName, query);
  }

  /**
   * Obtient les filtres disponibles pour un modèle (version démo)
   */
  static async getAvailableFilters(modelName: string): Promise<FilterOption[]> {
    console.log('Filtres disponibles (démo):', modelName);
    
    // Retourne un tableau vide pour simplifier
    return [];
  }

  /**
   * Exécute une action en lot (version démo)
   */
  static async bulkAction(
    modelName: string,
    action: string,
    ids: string[],
    data?: Record<string, any>
  ): Promise<{ success: boolean; message: string; affectedCount: number }> {
    console.log('Action en lot (démo):', modelName, action, ids, data);
    
    return {
      success: true,
      message: `Action ${action} exécutée avec succès sur ${ids.length} éléments`,
      affectedCount: ids.length
    };
  }

  /**
   * Enregistre une entrée dans le journal d'audit (version démo)
   */
  static async logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    console.log('Log audit (démo):', log);
  }
}
