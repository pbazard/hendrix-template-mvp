/**
 * Service d'authentification et de gestion des utilisateurs avec AWS Cognito
 * Intégration avec l'interface d'administration Hendrix
 * VERSION DÉMO pour le build - À remplacer par l'implémentation réelle AWS Cognito
 */

import { CognitoUser, CognitoGroup, Permission, ActionType } from '../types';

export class CognitoAuthService {
  /**
   * Récupère l'utilisateur actuellement connecté
   * Version démo pour le build - à remplacer par l'implémentation réelle
   */
  static async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      // Version démo pour le build
      return {
        id: 'demo-user',
        username: 'admin',
        email: 'admin@demo.com',
        given_name: 'Admin',
        family_name: 'User',
        groups: ['administrators'],
        attributes: {},
        isActive: true,
        enabled: true,
        dateJoined: new Date(),
        lastLogin: new Date()
      };
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  }

  /**
   * Liste tous les utilisateurs (version démo)
   */
  static async listUsers(): Promise<CognitoUser[]> {
    // Version démo
    return [
      {
        id: 'user1',
        username: 'admin',
        email: 'admin@demo.com',
        given_name: 'Admin',
        family_name: 'User',
        groups: ['administrators'],
        attributes: {},
        isActive: true,
        enabled: true,
        dateJoined: new Date(),
        lastLogin: new Date()
      },
      {
        id: 'user2',
        username: 'staff',
        email: 'staff@demo.com',
        given_name: 'Staff',
        family_name: 'User',
        groups: ['staff'],
        attributes: {},
        isActive: true,
        enabled: true,
        dateJoined: new Date(),
        lastLogin: new Date()
      }
    ];
  }

  /**
   * Crée un nouvel utilisateur (version démo)
   */
  static async createUser(userData: Partial<CognitoUser>): Promise<CognitoUser> {
    console.log('Creating user (demo):', userData);
    return {
      id: 'new-user',
      username: userData.username || 'newuser',
      email: userData.email || 'newuser@demo.com',
      given_name: userData.given_name || 'New',
      family_name: userData.family_name || 'User',
      groups: userData.groups || ['staff'],
      attributes: userData.attributes || {},
      isActive: true,
      enabled: true,
      dateJoined: new Date(),
      lastLogin: new Date()
    };
  }

  /**
   * Met à jour un utilisateur (version démo)
   */
  static async updateUser(username: string, userData: Partial<CognitoUser>): Promise<CognitoUser> {
    console.log('Updating user (demo):', username, userData);
    return {
      id: username,
      username,
      email: userData.email || 'updated@demo.com',
      given_name: userData.given_name || 'Updated',
      family_name: userData.family_name || 'User',
      groups: userData.groups || ['staff'],
      attributes: userData.attributes || {},
      isActive: userData.isActive ?? true,
      enabled: userData.enabled ?? true,
      dateJoined: new Date(),
      lastLogin: new Date()
    };
  }

  /**
   * Supprime un utilisateur (version démo)
   */
  static async deleteUser(username: string): Promise<void> {
    console.log('Deleting user (demo):', username);
  }

  /**
   * Ajoute un utilisateur à un groupe (version démo)
   */
  static async addUserToGroup(username: string, groupName: string): Promise<void> {
    console.log('Adding user to group (demo):', username, groupName);
  }

  /**
   * Retire un utilisateur d'un groupe (version démo)
   */
  static async removeUserFromGroup(username: string, groupName: string): Promise<void> {
    console.log('Removing user from group (demo):', username, groupName);
  }

  /**
   * Liste tous les groupes (version démo)
   */
  static async listGroups(): Promise<CognitoGroup[]> {
    return [
      {
        groupName: 'administrators',
        description: 'Administrateurs système',
        precedence: 1,
        creationDate: new Date(),
        lastModifiedDate: new Date()
      },
      {
        groupName: 'staff',
        description: 'Personnel',
        precedence: 2,
        creationDate: new Date(),
        lastModifiedDate: new Date()
      }
    ];
  }

  /**
   * Vérifie si un utilisateur a une permission spécifique (version démo)
   */
  static hasPermission(user: CognitoUser, action: ActionType, modelName: string): boolean {
    // Administrateurs ont tous les droits
    if (user.groups.includes('administrators')) {
      return true;
    }

    // Staff a des droits limités
    if (user.groups.includes('staff')) {
      if (modelName === 'User' && action !== ActionType.LIST) {
        return false; // Staff ne peut que lister les utilisateurs
      }
      return true;
    }

    return false;
  }

  /**
   * Déconnexion (version démo)
   */
  static async signOut(): Promise<void> {
    console.log('Sign out (demo)');
  }

  /**
   * Vérifie si l'utilisateur est authentifié (version démo)
   */
  static async isAuthenticated(): Promise<boolean> {
    return true; // Toujours authentifié en mode démo
  }

  /**
   * Vérifie si l'utilisateur a accès à l'interface d'administration (version démo)
   */
  static async hasAdminAccess(user: CognitoUser): Promise<boolean> {
    return user.groups.includes('administrators') || user.groups.includes('staff');
  }

  /**
   * Récupère les permissions d'un utilisateur (version démo)
   */
  static async getUserPermissions(user: CognitoUser): Promise<Permission[]> {
    const permissions: Permission[] = [];

    if (user.groups.includes('administrators')) {
      // Administrateurs ont tous les droits
      permissions.push(
        { id: '1', name: 'Can add user', codename: 'add_user', contentType: 'User' },
        { id: '2', name: 'Can change user', codename: 'change_user', contentType: 'User' },
        { id: '3', name: 'Can delete user', codename: 'delete_user', contentType: 'User' },
        { id: '4', name: 'Can view user', codename: 'view_user', contentType: 'User' },
        { id: '5', name: 'Can add todo', codename: 'add_todo', contentType: 'Todo' },
        { id: '6', name: 'Can change todo', codename: 'change_todo', contentType: 'Todo' },
        { id: '7', name: 'Can delete todo', codename: 'delete_todo', contentType: 'Todo' },
        { id: '8', name: 'Can view todo', codename: 'view_todo', contentType: 'Todo' },
        { id: '9', name: 'Can view audit log', codename: 'view_auditlog', contentType: 'AuditLog' }
      );
    } else if (user.groups.includes('staff')) {
      // Staff a des droits limités
      permissions.push(
        { id: '4', name: 'Can view user', codename: 'view_user', contentType: 'User' },
        { id: '5', name: 'Can add todo', codename: 'add_todo', contentType: 'Todo' },
        { id: '6', name: 'Can change todo', codename: 'change_todo', contentType: 'Todo' },
        { id: '8', name: 'Can view todo', codename: 'view_todo', contentType: 'Todo' },
        { id: '9', name: 'Can view audit log', codename: 'view_auditlog', contentType: 'AuditLog' }
      );
    }

    return permissions;
  }
}
