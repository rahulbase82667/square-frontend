
import { Platform, PlatformCredentials } from "@/types/platform";
import { toast } from "@/hooks/use-toast";

// Store platform credentials in localStorage with encryption
export const storePlatformCredentials = (platformId: string, credentials: PlatformCredentials): void => {
  try {
    // In a production environment, this should use proper encryption
    // For demo purposes, we're just storing in localStorage
    localStorage.setItem(`${platformId}_credentials`, JSON.stringify(credentials));
  } catch (error) {
    console.error("Failed to store platform credentials:", error);
    throw new Error("Failed to store credentials");
  }
};

// Retrieve platform credentials from localStorage
export const getPlatformCredentials = (platformId: string): PlatformCredentials | null => {
  try {
    const credentials = localStorage.getItem(`${platformId}_credentials`);
    return credentials ? JSON.parse(credentials) : null;
  } catch (error) {
    console.error("Failed to retrieve platform credentials:", error);
    return null;
  }
};

// Clear platform credentials from localStorage
export const clearPlatformCredentials = (platformId: string): void => {
  try {
    localStorage.removeItem(`${platformId}_credentials`);
  } catch (error) {
    console.error("Failed to clear platform credentials:", error);
  }
};

// Initialize OAuth flow
export const initializeOAuth = (platform: Platform): void => {
  if (!platform.authUrl) {
    toast({
      title: "Configuration Error",
      description: `OAuth URLs for ${platform.name} are not configured.`,
      variant: "destructive",
    });
    return;
  }

  // Generate a random state to protect against CSRF attacks
  const state = Math.random().toString(36).substring(2, 15) + '_' + platform.id;
  localStorage.setItem(`${platform.id}_oauth_state`, state);
  
  // Construct OAuth URL with required parameters
  const redirectUri = platform.redirectUri || `${window.location.origin}/oauth-callback`;
  const scope = platform.scopes?.join(' ') || '';
  
  const oauthUrl = new URL(platform.authUrl);
  oauthUrl.searchParams.append('client_id', import.meta.env.VITE_OAUTH_CLIENT_ID || 'DEMO_CLIENT_ID');
  oauthUrl.searchParams.append('redirect_uri', redirectUri);
  oauthUrl.searchParams.append('response_type', 'code');
  oauthUrl.searchParams.append('state', state);
  oauthUrl.searchParams.append('platform', platform.id);
  
  if (scope) {
    oauthUrl.searchParams.append('scope', scope);
  }
  
  // Open OAuth authorization URL in a new window
  window.open(oauthUrl.toString(), '_blank', 'width=600,height=600');
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (
  platform: Platform,
  code: string
): Promise<PlatformCredentials> => {
  if (!platform.tokenUrl) {
    throw new Error(`Token URL for ${platform.name} is not configured`);
  }

  try {
    // In a real application, this would be a server-side API call to protect client secrets
    // For demo purposes, we're simulating the token exchange
    // In production, NEVER expose client secrets in frontend code
    
    // Simulate a successful token exchange
    const credentials: PlatformCredentials = {
      accessToken: `mock_access_token_${platform.id}_${Math.random().toString(36).substring(2)}`,
      refreshToken: `mock_refresh_token_${platform.id}_${Math.random().toString(36).substring(2)}`,
      expiresAt: Date.now() + 3600000, // 1 hour from now
    };
    
    storePlatformCredentials(platform.id, credentials);
    return credentials;
  } catch (error) {
    console.error("Token exchange error:", error);
    throw new Error("Failed to exchange code for token");
  }
};

// Refresh access token when it's about to expire
export const refreshAccessToken = async (
  platform: Platform
): Promise<PlatformCredentials | null> => {
  const credentials = getPlatformCredentials(platform.id);
  
  if (!credentials || !credentials.refreshToken) {
    return null;
  }
  
  try {
    // In a real application, this would be a server-side API call
    // For demo purposes, we're simulating the token refresh
    
    // Simulate a successful token refresh
    const refreshedCredentials: PlatformCredentials = {
      ...credentials,
      accessToken: `refreshed_access_token_${platform.id}_${Math.random().toString(36).substring(2)}`,
      expiresAt: Date.now() + 3600000, // 1 hour from now
    };
    
    storePlatformCredentials(platform.id, refreshedCredentials);
    return refreshedCredentials;
  } catch (error) {
    console.error("Token refresh error:", error);
    return null;
  }
};

// Validate if the stored credentials are valid and not expired
export const validateCredentials = (platformId: string): boolean => {
  const credentials = getPlatformCredentials(platformId);
  
  if (!credentials || !credentials.accessToken) {
    return false;
  }
  
  // Check if token is expired
  if (credentials.expiresAt && credentials.expiresAt < Date.now()) {
    return false;
  }
  
  return true;
};
