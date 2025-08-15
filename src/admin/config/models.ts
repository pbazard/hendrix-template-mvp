/**
 * Configuration des modèles pour l'interface d'administration Hendrix
 * Basé sur la structure Django Admin avec intégration AWS Cognito
 */

import { ModelAdmin, AdminConfig, ModelAction, ActionType } from '../types';

// Actions personnalisées communes
export const commonActions: Record<string, ModelAction> = {
  bulkDelete: {
    name: 'bulk_delete',
    description: 'Supprimer les éléments sélectionnés',
    icon: 'trash',
    confirmationMessage: 'Êtes-vous sûr de vouloir supprimer les éléments sélectionnés ?',
    handler: async (items, admin) => {
      // Implémentation de la suppression en lot
      console.log(`Suppression en lot de ${items.length} éléments de ${admin.name}`);
    }
  },
  exportCsv: {
    name: 'export_csv',
    description: 'Exporter en CSV',
    icon: 'download',
    handler: async (items, admin) => {
      // Implémentation de l'export CSV
      console.log(`Export CSV de ${items.length} éléments de ${admin.name}`);
    }
  }
};

// Configuration du modèle Todo (existant)
export const todoAdmin: ModelAdmin = {
  name: 'Todo',
  verbose_name: 'Tâche',
  verbose_name_plural: 'Tâches',
  fields: [
    {
      name: 'id',
      type: 'string',
      label: 'ID',
      readonly: true
    },
    {
      name: 'content',
      type: 'text',
      label: 'Contenu',
      required: true,
      maxLength: 500,
      helpText: 'Décrivez la tâche à accomplir'
    },
    {
      name: 'completed',
      type: 'boolean',
      label: 'Terminée',
      defaultValue: false
    },
    {
      name: 'createdAt',
      type: 'date',
      label: 'Créée le',
      readonly: true
    },
    {
      name: 'updatedAt',
      type: 'date',
      label: 'Modifiée le',
      readonly: true
    }
  ],
  list_display: ['content', 'completed', 'createdAt'],
  list_filter: ['completed', 'createdAt'],
  search_fields: ['content'],
  ordering: ['-createdAt'],
  list_per_page: 25,
  actions: [commonActions.bulkDelete, commonActions.exportCsv],
  permissions: {
    add: true,
    change: true,
    delete: true,
    view: true
  }
};

// Configuration du modèle User (Cognito)
export const userAdmin: ModelAdmin = {
  name: 'User',
  verbose_name: 'Utilisateur',
  verbose_name_plural: 'Utilisateurs',
  fields: [
    {
      name: 'id',
      type: 'string',
      label: 'ID',
      readonly: true
    },
    {
      name: 'username',
      type: 'string',
      label: "Nom d'utilisateur",
      required: true,
      readonly: true
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true
    },
    {
      name: 'isActive',
      type: 'boolean',
      label: 'Actif',
      defaultValue: true
    },
    {
      name: 'groups',
      type: 'multiselect',
      label: 'Groupes',
      choices: [] // Sera rempli dynamiquement avec les groupes Cognito
    },
    {
      name: 'dateJoined',
      type: 'date',
      label: 'Date d\'inscription',
      readonly: true
    },
    {
      name: 'lastLogin',
      type: 'date',
      label: 'Dernière connexion',
      readonly: true
    }
  ],
  list_display: ['username', 'email', 'isActive', 'dateJoined'],
  list_filter: ['isActive', 'groups', 'dateJoined'],
  search_fields: ['username', 'email'],
  ordering: ['-dateJoined'],
  fieldsets: [
    {
      name: 'Informations personnelles',
      fields: ['username', 'email']
    },
    {
      name: 'Permissions',
      fields: ['isActive', 'groups'],
      classes: ['collapse']
    },
    {
      name: 'Dates importantes',
      fields: ['dateJoined', 'lastLogin'],
      classes: ['collapse']
    }
  ],
  list_per_page: 50,
  actions: [
    commonActions.exportCsv,
    {
      name: 'activate_users',
      description: 'Activer les utilisateurs sélectionnés',
      icon: 'user-check',
      handler: async (items) => {
        console.log(`Activation de ${items.length} utilisateurs`);
      }
    },
    {
      name: 'deactivate_users',
      description: 'Désactiver les utilisateurs sélectionnés',
      icon: 'user-x',
      confirmationMessage: 'Êtes-vous sûr de vouloir désactiver ces utilisateurs ?',
      handler: async (items) => {
        console.log(`Désactivation de ${items.length} utilisateurs`);
      }
    }
  ],
  permissions: {
    add: true,
    change: true,
    delete: false, // Pas de suppression d'utilisateurs, seulement désactivation
    view: true
  }
};

// Configuration du modèle Group (Cognito)
export const groupAdmin: ModelAdmin = {
  name: 'Group',
  verbose_name: 'Groupe',
  verbose_name_plural: 'Groupes',
  fields: [
    {
      name: 'groupName',
      type: 'string',
      label: 'Nom du groupe',
      required: true,
      maxLength: 128
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      helpText: 'Description optionnelle du groupe'
    },
    {
      name: 'precedence',
      type: 'number',
      label: 'Précédence',
      helpText: 'Ordre de priorité du groupe (plus petit = plus prioritaire)'
    },
    {
      name: 'creationDate',
      type: 'date',
      label: 'Date de création',
      readonly: true
    }
  ],
  list_display: ['groupName', 'description', 'precedence', 'creationDate'],
  list_filter: ['creationDate'],
  search_fields: ['groupName', 'description'],
  ordering: ['precedence', 'groupName'],
  list_per_page: 25,
  actions: [commonActions.exportCsv],
  permissions: {
    add: true,
    change: true,
    delete: true,
    view: true
  }
};

// Configuration du modèle AuditLog
export const auditLogAdmin: ModelAdmin = {
  name: 'AuditLog',
  verbose_name: 'Journal d\'audit',
  verbose_name_plural: 'Journaux d\'audit',
  fields: [
    {
      name: 'id',
      type: 'string',
      label: 'ID',
      readonly: true
    },
    {
      name: 'user',
      type: 'string',
      label: 'Utilisateur',
      readonly: true
    },
    {
      name: 'action',
      type: 'select',
      label: 'Action',
      choices: [
        { value: 'create', label: 'Création' },
        { value: 'read', label: 'Lecture' },
        { value: 'update', label: 'Modification' },
        { value: 'delete', label: 'Suppression' },
        { value: 'list', label: 'Liste' }
      ],
      readonly: true
    },
    {
      name: 'model',
      type: 'string',
      label: 'Modèle',
      readonly: true
    },
    {
      name: 'objectId',
      type: 'string',
      label: 'ID de l\'objet',
      readonly: true
    },
    {
      name: 'objectRepr',
      type: 'string',
      label: 'Représentation',
      readonly: true
    },
    {
      name: 'changeMessage',
      type: 'text',
      label: 'Message de changement',
      readonly: true
    },
    {
      name: 'timestamp',
      type: 'date',
      label: 'Horodatage',
      readonly: true
    },
    {
      name: 'ipAddress',
      type: 'string',
      label: 'Adresse IP',
      readonly: true
    }
  ],
  list_display: ['user', 'action', 'model', 'objectRepr', 'timestamp'],
  list_filter: ['action', 'model', 'timestamp'],
  search_fields: ['user', 'objectRepr', 'changeMessage'],
  ordering: ['-timestamp'],
  list_per_page: 50,
  actions: [commonActions.exportCsv],
  permissions: {
    add: false,
    change: false,
    delete: false,
    view: true
  }
};

// Configuration principale de l'administration
export const adminConfig: AdminConfig = {
  site_title: 'Administration Hendrix',
  site_header: 'Interface d\'Administration Hendrix',
  index_title: 'Administration du site',
  models: {
    Todo: todoAdmin,
    User: userAdmin,
    Group: groupAdmin,
    AuditLog: auditLogAdmin
  },
  theme: {
    primaryColor: '#3b82f6',
    logoUrl: '/logo.png'
  },
  security: {
    requireMFA: false,
    sessionTimeout: 3600, // 1 heure
    allowedGroups: ['Administrators', 'Staff']
  }
};

// Utilitaires pour la gestion des permissions
export const checkPermission = (
  userGroups: string[],
  action: ActionType,
  model: string,
  config: AdminConfig
): boolean => {
  // Vérifier si l'utilisateur appartient à un groupe autorisé
  const allowedGroups = config.security?.allowedGroups || [];
  if (allowedGroups.length > 0 && !userGroups.some(group => allowedGroups.includes(group))) {
    return false;
  }

  // Vérifier les permissions spécifiques au modèle
  const modelConfig = config.models[model];
  if (!modelConfig) return false;

  const permissions = modelConfig.permissions;
  if (!permissions) return true; // Si pas de permissions définies, autoriser

  switch (action) {
    case ActionType.CREATE:
      return permissions.add ?? true;
    case ActionType.READ:
    case ActionType.LIST:
      return permissions.view ?? true;
    case ActionType.UPDATE:
      return permissions.change ?? true;
    case ActionType.DELETE:
      return permissions.delete ?? true;
    default:
      return false;
  }
};
