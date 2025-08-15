/**
 * Constantes pour l'interface d'administration Hendrix
 */

// Routes de l'administration
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  USERS: '/admin/user',
  GROUPS: '/admin/group',
  TODOS: '/admin/todo',
  AUDIT_LOGS: '/admin/auditlog',
  REPORTS: '/admin/reports',
  SECURITY: '/admin/security',
  SETTINGS: '/admin/settings',
  TEST: '/admin/test',
} as const;

// Configuration par défaut
export const DEFAULT_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 25,
    MAX_PAGE_SIZE: 100,
    MAX_SHOW_ALL: 200,
  },
  SEARCH: {
    MIN_SEARCH_LENGTH: 2,
    DEBOUNCE_DELAY: 300,
  },
  SESSION: {
    DEFAULT_TIMEOUT: 3600, // 1 heure
    WARNING_BEFORE_EXPIRY: 300, // 5 minutes
  },
  AUDIT: {
    MAX_LOG_AGE_DAYS: 90,
    BATCH_SIZE: 1000,
  },
} as const;

// Messages de validation
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Ce champ est requis',
  EMAIL_INVALID: 'Adresse email invalide',
  PASSWORD_TOO_SHORT: 'Le mot de passe doit contenir au moins 8 caractères',
  PASSWORD_REQUIREMENTS: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
  USERNAME_INVALID: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et tirets',
  MAX_LENGTH: (max: number) => `Maximum ${max} caractères`,
  MIN_LENGTH: (min: number) => `Minimum ${min} caractères`,
} as const;

// Status et états
export const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  IDLE: 'idle',
} as const;

// Types d'actions pour l'audit
export const AUDIT_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  LOGIN: 'login',
  LOGOUT: 'logout',
  EXPORT: 'export',
  IMPORT: 'import',
} as const;

// Groupes Cognito par défaut
export const COGNITO_GROUPS = {
  ADMINISTRATORS: 'Administrators',
  STAFF: 'Staff',
  MODERATORS: 'Moderators',
} as const;

// Permissions par défaut pour les groupes
export const DEFAULT_PERMISSIONS = {
  [COGNITO_GROUPS.ADMINISTRATORS]: {
    // Accès complet à tout
    '*': ['create', 'read', 'update', 'delete', 'list'],
  },
  [COGNITO_GROUPS.STAFF]: {
    // Accès limité
    'Todo': ['create', 'read', 'update', 'list'],
    'AuditLog': ['read', 'list'],
  },
  [COGNITO_GROUPS.MODERATORS]: {
    // Permissions de modération
    'Todo': ['read', 'update', 'list'],
    'User': ['read', 'list'],
    'AuditLog': ['read', 'list'],
  },
} as const;

// Configuration des icônes par type de modèle
export const MODEL_ICONS = {
  Todo: 'CheckSquare',
  User: 'Users',
  Group: 'UserCheck',
  AuditLog: 'FileText',
  Report: 'BarChart3',
  Setting: 'Settings',
  Security: 'Shield',
} as const;

// Configuration des couleurs par statut
export const STATUS_COLORS = {
  [STATUS.SUCCESS]: 'green',
  [STATUS.ERROR]: 'red',
  [STATUS.WARNING]: 'yellow',
  [STATUS.LOADING]: 'blue',
  [STATUS.IDLE]: 'gray',
} as const;

// Formats de date
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm',
} as const;

// Configuration des exports
export const EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  XLSX: 'xlsx',
} as const;

// Limites de fichiers
export const FILE_LIMITS = {
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_FILES: 5,
} as const;
