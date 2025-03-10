
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
import type { Platform, PlatformCredentials } from '@/types/platform';

interface PlatformConnectorProps {
  platform: Platform;
  onConnect: (platformId: string) => void;
}

export const PlatformConnector = ({ platform, onConnect }: PlatformConnectorProps) => {
  const [credentials, setCredentials] = useState<PlatformCredentials>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    const missingCredentials = platform.requiredCredentials.filter(
      cred => !credentials[cred]
    );

    if (missingCredentials.length > 0) {
      toast({
        title: "Missing Credentials",
        description: `Please enter all required credentials: ${missingCredentials.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Store credentials securely in localStorage for demo purposes
      localStorage.setItem(`${platform.id}_credentials`, JSON.stringify(credentials));
      
      onConnect(platform.id);
      
      toast({
        title: "Successfully Connected",
        description: `Connected to ${platform.name} successfully!`,
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
          <DialogTitle>Connect to {platform.name}</DialogTitle>
          <DialogDescription>
            Enter your {platform.name} API credentials to connect your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {platform.requiredCredentials.map((credentialType) => (
            <div key={credentialType} className="space-y-2">
              <Label htmlFor={credentialType}>
                {credentialType.split(/(?=[A-Z])/).join(' ').toLowerCase()}
              </Label>
              <Input
                id={credentialType}
                type={credentialType.toLowerCase().includes('secret') ? 'password' : 'text'}
                placeholder={`Enter ${credentialType.split(/(?=[A-Z])/).join(' ').toLowerCase()}`}
                value={credentials[credentialType] || ''}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  [credentialType]: e.target.value
                }))}
              />
            </div>
          ))}
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

