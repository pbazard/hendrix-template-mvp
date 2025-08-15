/**
 * Utilitaires pour l'interface d'administration Hendrix
 */

import { ActionType, ModelField, CognitoUser } from '../types';
import { VALIDATION_MESSAGES, DATE_FORMATS, DEFAULT_PERMISSIONS, COGNITO_GROUPS } from '../constants';

/**
 * Formatage et validation
 */
export const formatUtils = {
  /**
   * Formate une date selon le format spécifié
   */
  formatDate: (date: Date | string, format: keyof typeof DATE_FORMATS = 'DISPLAY'): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'DISPLAY':
        return dateObj.toLocaleDateString('fr-FR');
      case 'DISPLAY_WITH_TIME':
        return dateObj.toLocaleDateString('fr-FR') + ' ' + dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      case 'ISO':
        return dateObj.toISOString().split('T')[0];
      case 'TIME_ONLY':
        return dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      default:
        return dateObj.toLocaleDateString('fr-FR');
    }
  },

  /**
   * Formate une taille de fichier en format lisible
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Formate un nombre avec séparateurs de milliers
   */
  formatNumber: (num: number): string => {
    return num.toLocaleString('fr-FR');
  },

  /**
   * Tronque un texte à une longueur donnée
   */
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  },
};

/**
 * Validation des données
 */
export const validationUtils = {
  /**
   * Valide un email
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valide un mot de passe selon les critères Cognito
   */
  isValidPassword: (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  /**
   * Valide un nom d'utilisateur
   */
  isValidUsername: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    return usernameRegex.test(username) && username.length >= 3;
  },

  /**
   * Valide une valeur selon la configuration du champ
   */
  validateField: (value: any, field: ModelField): string | null => {
    // Champ requis
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return VALIDATION_MESSAGES.REQUIRED;
    }

    // Validation selon le type
    if (value && typeof value === 'string') {
      switch (field.type) {
        case 'email':
          if (!validationUtils.isValidEmail(value)) {
            return VALIDATION_MESSAGES.EMAIL_INVALID;
          }
          break;
        
        case 'string':
        case 'text':
          if (field.maxLength && value.length > field.maxLength) {
            return VALIDATION_MESSAGES.MAX_LENGTH(field.maxLength);
          }
          if (field.minLength && value.length < field.minLength) {
            return VALIDATION_MESSAGES.MIN_LENGTH(field.minLength);
          }
          break;
      }
    }

    // Validation personnalisée
    if (field.validation && typeof field.validation === 'function') {
      return field.validation(value);
    }

    return null;
  },
};

/**
 * Utilitaires pour les permissions
 */
export const permissionUtils = {
  /**
   * Vérifie si un utilisateur a une permission spécifique
   */
  hasPermission: (user: CognitoUser, action: ActionType, modelName: string): boolean => {
    // Super administrateurs ont tous les droits
    if (user.groups.includes(COGNITO_GROUPS.ADMINISTRATORS)) {
      return true;
    }

    // Vérifier les permissions par groupe
    for (const group of user.groups) {
      const groupPermissions = DEFAULT_PERMISSIONS[group as keyof typeof DEFAULT_PERMISSIONS];
      if (!groupPermissions) continue;

      // Vérifier permission globale (*)
      const globalPerms = (groupPermissions as any)['*'];
      if (globalPerms && globalPerms.includes(action)) {
        return true;
      }

      // Vérifier permission spécifique au modèle
      const modelPerms = (groupPermissions as any)[modelName];
      if (modelPerms && modelPerms.includes(action)) {
        return true;
      }
    }

    return false;
  },

  /**
   * Obtient toutes les permissions d'un utilisateur
   */
  getUserPermissions: (user: CognitoUser): Record<string, string[]> => {
    const permissions: Record<string, string[]> = {};

    for (const group of user.groups) {
      const groupPermissions = DEFAULT_PERMISSIONS[group as keyof typeof DEFAULT_PERMISSIONS];
      if (!groupPermissions) continue;

      for (const [model, actions] of Object.entries(groupPermissions)) {
        if (!permissions[model]) {
          permissions[model] = [];
        }
        // Fusion des permissions en évitant les doublons
        const existingPerms = permissions[model];
        const newPerms = (actions as string[]).filter((action: string) => !existingPerms.includes(action));
        permissions[model] = existingPerms.concat(newPerms);
      }
    }

    return permissions;
  },
};

/**
 * Utilitaires pour les URL et navigation
 */
export const urlUtils = {
  /**
   * Construit une URL d'administration pour un modèle
   */
  buildAdminUrl: (modelName: string, action?: 'add' | 'change' | 'delete', id?: string): string => {
    const basePath = `/admin/${modelName.toLowerCase()}`;
    
    if (action === 'add') {
      return `${basePath}/add`;
    }
    
    if (id) {
      if (action === 'change') {
        return `${basePath}/${id}/change`;
      }
      if (action === 'delete') {
        return `${basePath}/${id}/delete`;
      }
      return `${basePath}/${id}`;
    }
    
    return basePath;
  },

  /**
   * Extrait les paramètres d'une URL
   */
  parseAdminUrl: (pathname: string): { modelName?: string; action?: string; id?: string } => {
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments[0] !== 'admin') {
      return {};
    }

    const result: any = {};
    
    if (segments[1]) {
      result.modelName = segments[1];
    }
    
    if (segments[2]) {
      if (segments[2] === 'add') {
        result.action = 'add';
      } else if (segments[3] === 'change') {
        result.id = segments[2];
        result.action = 'change';
      } else if (segments[3] === 'delete') {
        result.id = segments[2];
        result.action = 'delete';
      } else {
        result.id = segments[2];
      }
    }

    return result;
  },
};

/**
 * Utilitaires pour les données
 */
export const dataUtils = {
  /**
   * Génère un ID unique
   */
  generateId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Débounce une fonction
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Tri un tableau d'objets par une propriété
   */
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },

  /**
   * Filtre un tableau d'objets par une recherche textuelle
   */
  filterBySearch: <T>(
    array: T[],
    searchTerm: string,
    searchFields: (keyof T)[]
  ): T[] => {
    if (!searchTerm.trim()) return array;
    
    const term = searchTerm.toLowerCase();
    return array.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return typeof value === 'string' && value.toLowerCase().includes(term);
      })
    );
  },

  /**
   * Groupe un tableau d'objets par une propriété
   */
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },
};

/**
 * Utilitaires pour l'export de données
 */
export const exportUtils = {
  /**
   * Convertit un tableau d'objets en CSV
   */
  toCSV: (data: any[], headers: string[]): string => {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  },

  /**
   * Télécharge des données en tant que fichier
   */
  downloadFile: (content: string, filename: string, type: string = 'text/plain'): void => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
