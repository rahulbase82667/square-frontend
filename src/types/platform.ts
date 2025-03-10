
export interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'not_connected';
  lastSync?: string;
}
