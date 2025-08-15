/**
 * Hendrix Admin Types - Inspired by Django Admin
 * Utilise AWS Cognito pour l'authentification et la gestion des utilisateurs
 */

import { Schema } from '@aws-amplify/datastore';

// Types de base pour l'authentification Cognito
export interface CognitoUser {
  id: string;
  username: string;
  email: string;
  groups: string[];
  attributes: Record<string, any>;
  isActive: boolean;
  dateJoined: Date;
  lastLogin?: Date;
}

export interface CognitoGroup {
  groupName: string;
  description?: string;
  precedence?: number;
  roleArn?: string;
  creationDate: Date;
  lastModifiedDate: Date;
}

// Permissions et droits d'accès
export interface Permission {
  id: string;
  name: string;
  codename: string;
  contentType: string;
  description?: string;
}

export enum ActionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list'
}

// Configuration des modèles pour l'interface d'administration
export interface ModelField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'text' | 'select' | 'multiselect' | 'file' | 'image';
  label?: string;
  required?: boolean;
  readonly?: boolean;
  helpText?: string;
  choices?: Array<{ value: any; label: string }>;
  widget?: string;
  maxLength?: number;
  minLength?: number;
  defaultValue?: any;
  validation?: (value: any) => string | null;
}

export interface ModelAdmin {
  name: string;
  verbose_name?: string;
  verbose_name_plural?: string;
  fields: ModelField[];
  list_display: string[];
  list_filter: string[];
  search_fields: string[];
  ordering: string[];
  readonly_fields?: string[];
  fieldsets?: Array<{
    name?: string;
    fields: string[];
    classes?: string[];
  }>;
  list_per_page?: number;
  list_max_show_all?: number;
  actions?: ModelAction[];
  inlines?: InlineAdmin[];
  permissions?: {
    add?: boolean;
    change?: boolean;
    delete?: boolean;
    view?: boolean;
  };
}

export interface ModelAction {
  name: string;
  description: string;
  handler: (items: any[], admin: ModelAdmin) => Promise<void>;
  icon?: string;
  confirmationMessage?: string;
}

export interface InlineAdmin {
  model: string;
  fields: string[];
  extra?: number;
  max_num?: number;
  min_num?: number;
  can_delete?: boolean;
}

// Configuration globale de l'admin
export interface AdminConfig {
  site_title: string;
  site_header: string;
  site_url?: string;
  index_title: string;
  models: Record<string, ModelAdmin>;
  theme?: {
    primaryColor: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  security?: {
    requireMFA?: boolean;
    sessionTimeout?: number;
    allowedGroups?: string[];
  };
}

// Interface pour les données paginées
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Filtres et recherche
export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'between';
  value: any;
  label?: string;
}

export interface SearchQuery {
  q?: string;
  filters: FilterOption[];
  ordering?: string;
  page?: number;
  pageSize?: number;
}

// Événements et logs d'audit
export interface AuditLog {
  id: string;
  user: string;
  action: ActionType;
  model: string;
  objectId: string;
  objectRepr: string;
  changeMessage: string;
  timestamp: Date;
  ipAddress?: string;
}

// Interface pour les widgets personnalisés
export interface WidgetProps {
  field: ModelField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export type Widget = React.ComponentType<WidgetProps>;

// Context pour l'administration
export interface AdminContextType {
  user: CognitoUser | null;
  config: AdminConfig;
  permissions: Permission[];
  hasPermission: (action: ActionType, model: string) => boolean;
  navigate: (path: string) => void;
  showMessage: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}
