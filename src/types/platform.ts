
export interface PlatformCredentials {
  apiKey?: string;
  apiSecret?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'not_connected';
  lastSync?: string;
  requiredCredentials: (keyof PlatformCredentials)[];
}

