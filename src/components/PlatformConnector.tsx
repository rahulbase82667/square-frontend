
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus } from 'lucide-react';

interface PlatformConnectorProps {
  platformId: string;
  platformName: string;
  onConnect: (platformId: string) => void;
}

export const PlatformConnector = ({ platformId, platformName, onConnect }: PlatformConnectorProps) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both API key and secret",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Store credentials securely in localStorage for demo purposes
      // In a production app, these should be handled by a backend
      localStorage.setItem(`${platformId}_credentials`, JSON.stringify({
        apiKey,
        apiSecret
      }));
      
      onConnect(platformId);
      
      toast({
        title: "Successfully Connected",
        description: `Connected to ${platformName} successfully!`,
      });
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect to {platformName}</DialogTitle>
          <DialogDescription>
            Enter your {platformName} API credentials to connect your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              placeholder="Enter API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-secret">API Secret</Label>
            <Input
              id="api-secret"
              type="password"
              placeholder="Enter API secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Platform"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

