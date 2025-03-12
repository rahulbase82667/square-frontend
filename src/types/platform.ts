
export interface PlatformCredentials {
  apiKey?: string;
  apiSecret?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'not_connected';
  lastSync?: string;
  requiredCredentials: (keyof PlatformCredentials)[];
  authUrl?: string; // OAuth authorization URL
  tokenUrl?: string; // OAuth token endpoint URL
  scopes?: string[]; // Required OAuth scopes
  redirectUri?: string; // OAuth redirect URI
  refreshCredentials?: boolean; // Whether platform supports token refresh
  webhookSupport?: boolean; // Whether platform supports webhooks for real-time updates
  inventorySync?: boolean; // Whether platform supports inventory syncing
}

export interface SyncResult {
  success: boolean;
  message: string;
  timestamp: string;
  details?: {
    itemsSynced?: number;
    itemsFailed?: number;
    inventoryUpdated?: number; // New field for inventory-specific updates
    errors?: string[];
  };
}

export interface PlatformSyncConfig {
  autoSync: boolean; // Whether to automatically sync on schedule
  syncInterval: number; // Sync interval in minutes
  syncDirection: 'import' | 'export' | 'bidirectional'; // Sync direction
  syncInventoryOnly?: boolean; // Whether to sync only inventory data
  inventoryPriority?: 'platform' | 'local' | 'newest'; // How to resolve inventory conflicts
  lastSyncStatus?: SyncResult; // Result of the last sync operation
}

export interface InventoryUpdate {
  productId: string;
  sku: string;
  quantity: number;
  platformId: string;
  timestamp: number;
}

