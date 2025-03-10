
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, ExternalLink } from 'lucide-react';
import type { Platform } from '@/types/platform';
import { Textarea } from "@/components/ui/textarea";

interface PlatformOAuthConnectorProps {
  platform: Platform;
  onConnect: (platformId: string) => void;
}

export const PlatformOAuthConnector = ({ platform, onConnect }: PlatformOAuthConnectorProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // For demo purposes, this creates a random state to simulate the OAuth flow
  const generateState = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const initiateOAuth = () => {
    if (!platform.authUrl) {
      toast({
        title: "Configuration Error",
        description: `OAuth URLs for ${platform.name} are not configured.`,
        variant: "destructive",
      });
      return;
    }

    const state = generateState();
    // Store state in localStorage to verify later
    localStorage.setItem(`${platform.id}_oauth_state`, state);
    
    // Construct OAuth URL with required parameters
    const redirectUri = platform.redirectUri || `${window.location.origin}/oauth-callback`;
    const scope = platform.scopes?.join(' ') || '';
    
    const oauthUrl = new URL(platform.authUrl);
    oauthUrl.searchParams.append('client_id', 'DEMO_CLIENT_ID'); // Would be replaced with real client ID
    oauthUrl.searchParams.append('redirect_uri', redirectUri);
    oauthUrl.searchParams.append('response_type', 'code');
    oauthUrl.searchParams.append('state', state);
    
    if (scope) {
      oauthUrl.searchParams.append('scope', scope);
    }
    
    // Open OAuth authorization URL in a new window
    const oauthWindow = window.open(oauthUrl.toString(), '_blank', 'width=600,height=600');
    
    // For demo purposes since we can't complete the real OAuth flow
    setTimeout(() => {
      setIsDialogOpen(true);
    }, 2000);
  };

  const handleConnect = async () => {
    if (!manualToken) {
      toast({
        title: "Token Required",
        description: "Please enter the authorization token you received.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Simulate token validation
      localStorage.setItem(`${platform.id}_credentials`, JSON.stringify({
        accessToken: manualToken,
        refreshToken: 'demo_refresh_token',
        expiresAt: Date.now() + 3600000 // 1 hour from now
      }));
      
      onConnect(platform.id);
      
      toast({
        title: "Successfully Connected",
        description: `Connected to ${platform.name} successfully!`,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the platform. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={initiateOAuth}>
        <Plus className="h-4 w-4 mr-2" />
        Connect
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete {platform.name} Connection</DialogTitle>
            <DialogDescription>
              After authorizing with {platform.name}, enter the token you received to complete the connection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                In a real implementation, you would be redirected back to this application automatically. For demonstration purposes, please enter the token manually:
              </p>
              <Textarea
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste your authorization token here"
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Complete Connection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
