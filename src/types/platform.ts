
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
}
