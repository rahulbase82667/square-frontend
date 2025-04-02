
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Settings, X, ExternalLink, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlatformOAuthConnector } from './PlatformOAuthConnector';
import { useToast } from "@/hooks/use-toast";
import { clearPlatformCredentials } from "@/utils/platformAuth";
import { syncWithPlatform } from "@/utils/platformSync";
import { syncInventory } from "@/utils/inventorySync";
import PlatformSyncSettings from './PlatformSyncSettings';
import type { Platform, SyncResult } from '../types/platform';

interface PlatformCardProps {
  platform: Platform;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}

const PlatformCard = ({ platform, onConnect, onDisconnect, onSync }: PlatformCardProps) => {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInventorySyncing, setIsInventorySyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    const handleOAuthSuccess = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        console.log(`OAuth success for platform: ${event.data.platformId}`);
        

        onSync(event.data.platformId);
        window.location.reload(); 
      }
    };
  
    window.addEventListener('message', handleOAuthSuccess);
  
    return () => {
      window.removeEventListener('message', handleOAuthSuccess);
    };
  }, []);
  
  

  const handleDisconnect = () => {
    clearPlatformCredentials(platform.id);
    onDisconnect(platform.id);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    toast({
      title: "Synchronizing",
      description: `Starting synchronization with ${platform.name}...`,
    });
    
    try {
      const result = await syncWithPlatform(platform);
      setLastSyncResult(result);
      
      if (result.success) {
        toast({
          title: "Sync Complete",
          description: result.message,
        });
        onSync(platform.id); 
      } else {
        toast({
          title: "Sync Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  const handleInventorySync = async () => {
    if (!platform.inventorySync) {
      toast({
        title: "Not Supported",
        description: `${platform.name} does not support inventory synchronization.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsInventorySyncing(true);
    toast({
      title: "Syncing Inventory",
      description: `Updating inventory with ${platform.name}...`,
    });
    
    try {
      const result = await syncInventory(platform);
      
      if (result.success) {
        toast({
          title: "Inventory Sync Complete",
          description: `Updated ${result.details?.inventoryUpdated || 0} items with ${platform.name}.`,
        });
        onSync(platform.id); 
      } else {
        toast({
          title: "Inventory Sync Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Inventory sync error:', error);
      toast({
        title: "Sync Error",
        description: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsInventorySyncing(false);
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
            <Button variant="ghost" size="icon" onClick={handleSync} disabled={isSyncing}>
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="sr-only">Sync</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{platform.description}</p>
        
        {platform.inventorySync && (
          <div className="mt-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Package className="h-3 w-3 mr-1" /> Inventory Sync
            </Badge>
          </div>
        )}
        
        {lastSyncResult && lastSyncResult.details && (
          <div className="mt-3 p-2 bg-gray-50 rounded-md text-xs">
            <p className="font-medium">Last Sync Results:</p>
            <div className="mt-1 space-y-1">
              <p>
                Items synced: {lastSyncResult.details.itemsSynced || 0}
                {lastSyncResult.details.itemsFailed ? ` (${lastSyncResult.details.itemsFailed} failed)` : ''}
              </p>
              {lastSyncResult.details.inventoryUpdated !== undefined && (
                <p>
                  Inventory items updated: {lastSyncResult.details.inventoryUpdated}
                </p>
              )}
              {lastSyncResult.details.errors && lastSyncResult.details.errors.length > 0 && (
                <div>
                  <p className="text-red-600">Errors:</p>
                  <ul className="list-disc list-inside pl-2">
                    {lastSyncResult.details.errors.map((error, index) => (
                      <li key={index} className="text-red-600">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
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
                  <Button 
                    variant="outline" 
                    onClick={handleDisconnect}
                  >
                    Yes, Disconnect
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <div className="flex space-x-2">
              <PlatformSyncSettings platform={platform} />
              
              {platform.inventorySync && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleInventorySync} 
                  disabled={isInventorySyncing}
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <Package className={`h-4 w-4 mr-2 ${isInventorySyncing ? 'animate-spin' : ''}`} />
                  {isInventorySyncing ? 'Syncing...' : 'Sync Inventory'}
                </Button>
              )}
              
              <Button variant="ghost" size="sm" onClick={handleSync} disabled={isSyncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync All'}
              </Button>
            </div>
          </>
        ) : (
          <PlatformOAuthConnector
            platform={platform}
            onConnect={onConnect}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default PlatformCard;
