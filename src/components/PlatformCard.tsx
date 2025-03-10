
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, RefreshCw, ExternalLink, Settings } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkSquareConnection, syncProductToSquare } from "@/utils/squareApi";

export interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'not_connected';
  lastSync?: string;
}

interface PlatformCardProps {
  platform: Platform;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}

const PlatformCard = ({ platform, onConnect, onDisconnect, onSync }: PlatformCardProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleConnectClick = async () => {
    setIsConnecting(true);
    
    try {
      if (platform.id === 'square') {
        // Test the connection with the Square API
        const isConnected = await checkSquareConnection();
        if (isConnected) {
          onConnect(platform.id);
        } else {
          throw new Error("Could not connect to Square API");
        }
      } else {
        // For other platforms, just simulate connection
        setTimeout(() => {
          onConnect(platform.id);
        }, 1000);
      }
    } catch (error) {
      console.error(`Failed to connect to ${platform.name}:`, error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    
    if (platform.id === 'square') {
      try {
        // For demonstration purposes, sync a sample product
        // In a real application, you would fetch products from your database
        await syncProductToSquare({
          name: "Sample Product",
          description: "This is a sample product synced from EasyHub",
          price: 19.99,
          sku: "SAMPLE-001",
          inventory: 25
        });
        
        onSync(platform.id);
      } catch (error) {
        console.error("Failed to sync with Square:", error);
      } finally {
        setIsSyncing(false);
      }
    } else {
      // For other platforms, just simulate syncing
      setTimeout(() => {
        onSync(platform.id);
        setIsSyncing(false);
      }, 1500);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{platform.icon}</div>
            <div>
              <CardTitle>{platform.name}</CardTitle>
              {platform.status === 'connected' && (
                <div className="flex items-center mt-1">
                  <Badge className="bg-green-100 text-green-800 text-xs">Connected</Badge>
                  {platform.lastSync && (
                    <span className="text-xs text-muted-foreground ml-2">
                      Last sync: {platform.lastSync}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {platform.status === 'connected' && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSyncClick}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="sr-only">Sync</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{platform.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t">
        {platform.status === 'connected' ? (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                  <X className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Disconnect {platform.name}?</DialogTitle>
                  <DialogDescription>
                    This will remove the connection and stop syncing products with {platform.name}.
                    Your existing listings on {platform.name} will not be affected.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => onDisconnect(platform.id)}>
                    Yes, Disconnect
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </>
        ) : (
          <>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={isConnecting}>
                  {isConnecting ? (
                    "Connecting..."
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect to {platform.name}</DialogTitle>
                  <DialogDescription>
                    {platform.id === 'square' ? (
                      <>Your Square API credentials have been configured.</>
                    ) : (
                      <>Enter your {platform.name} API credentials to connect your account.</>
                    )}
                    This will allow EasyHub to manage your product listings.
                  </DialogDescription>
                </DialogHeader>
                {platform.id !== 'square' && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input id="api-key" placeholder="Enter API key" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api-secret">API Secret</Label>
                      <Input id="api-secret" type="password" placeholder="Enter API secret" />
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={handleConnectClick}>
                    Connect Platform
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="link" size="sm" className="text-muted-foreground">
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PlatformCard;
