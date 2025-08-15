/**
 * Service d'authentification et de gestion des utilisateurs avec AWS Cognito
 * Intégration avec l'interface d'administration Hendrix
 */

import { Auth } from 'aws-amplify';
import { CognitoUser, CognitoGroup, Permission, ActionType } from '../types';

export class CognitoAuthService {
  /**
   * Récupère l'utilisateur actuellement connecté
   */
  static async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      const userInfo = await Auth.currentUserInfo();
      
      return {
        id: user.username,
        username: user.username,
        email: userInfo?.attributes?.email || '',
        groups: userInfo?.signInUserSession?.accessToken?.payload['cognito:groups'] || [],
        attributes: userInfo?.attributes || {},
        isActive: true,
        dateJoined: new Date(user.UserCreateDate || Date.now()),
        lastLogin: new Date(user.LastLoginDate || Date.now())
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Liste tous les utilisateurs (nécessite des permissions d'administration)
   */
  static async listUsers(limit: number = 50, paginationToken?: string): Promise<{
    users: CognitoUser[];
    nextToken?: string;
  }> {
    try {
      // Utilisation de l'API Admin Cognito (nécessite des permissions appropriées)
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        },
        body: JSON.stringify({ limit, paginationToken })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la liste des utilisateurs:', error);
      return { users: [] };
    }
  }

  /**
   * Met à jour un utilisateur
   */
  static async updateUser(userId: string, updates: Partial<CognitoUser>): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        },
        body: JSON.stringify(updates)
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      return false;
    }
  }

  /**
   * Active ou désactive un utilisateur
   */
  static async setUserActive(userId: string, isActive: boolean): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/users/${userId}/${isActive ? 'enable' : 'disable'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors du changement de statut de l\'utilisateur:', error);
      return false;
    }
  }

  /**
   * Liste tous les groupes Cognito
   */
  static async listGroups(): Promise<CognitoGroup[]> {
    try {
      const response = await fetch('/api/admin/groups', {
        headers: {
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des groupes');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la liste des groupes:', error);
      return [];
    }
  }

  /**
   * Crée un nouveau groupe
   */
  static async createGroup(group: Omit<CognitoGroup, 'creationDate' | 'lastModifiedDate'>): Promise<boolean> {
    try {
      const response = await fetch('/api/admin/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        },
        body: JSON.stringify(group)
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la création du groupe:', error);
      return false;
    }
  }

  /**
   * Ajoute un utilisateur à un groupe
   */
  static async addUserToGroup(userId: string, groupName: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/users/${userId}/groups/${groupName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur au groupe:', error);
      return false;
    }
  }

  /**
   * Retire un utilisateur d'un groupe
   */
  static async removeUserFromGroup(userId: string, groupName: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/users/${userId}/groups/${groupName}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur du groupe:', error);
      return false;
    }
  }

  /**
   * Vérifie si l'utilisateur a les permissions pour une action donnée
   */
  static async hasPermission(
    user: CognitoUser,
    action: ActionType,
    model: string
  ): Promise<boolean> {
    // Vérification basée sur les groupes Cognito
    const adminGroups = ['Administrators', 'Staff'];
    const hasAdminAccess = user.groups.some(group => adminGroups.includes(group));

    if (hasAdminAccess) {
      return true; // Les administrateurs ont tous les droits
    }

    // Logique de permissions plus granulaire basée sur les groupes
    const permissions = await this.getUserPermissions(user);
    const permissionKey = `${model}.${action}`;
    
    return permissions.some(p => p.codename === permissionKey);
  }

  /**
   * Récupère les permissions d'un utilisateur
   */
  static async getUserPermissions(user: CognitoUser): Promise<Permission[]> {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/permissions`, {
        headers: {
          'Authorization': `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`
        }
      });

      if (!response.ok) {
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des permissions:', error);
      return [];
    }
  }

  /**
   * Déconnexion
   */
  static async signOut(): Promise<void> {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Vérifie si l'utilisateur a accès à l'interface d'administration
   */
  static async hasAdminAccess(user: CognitoUser): Promise<boolean> {
    const adminGroups = ['Administrators', 'Staff', 'Moderators'];
    return user.groups.some(group => adminGroups.includes(group));
  }
}
