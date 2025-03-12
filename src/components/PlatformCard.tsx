
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Settings, X, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlatformOAuthConnector } from './PlatformOAuthConnector';
import { useToast } from "@/hooks/use-toast";
import { clearPlatformCredentials } from "@/utils/platformAuth";
import { syncWithPlatform } from "@/utils/platformSync";
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
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

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
        onSync(platform.id); // Update UI with new last sync time
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
        
        {lastSyncResult && lastSyncResult.details && (
          <div className="mt-3 p-2 bg-gray-50 rounded-md text-xs">
            <p className="font-medium">Last Sync Results:</p>
            <div className="mt-1 space-y-1">
              <p>
                Items synced: {lastSyncResult.details.itemsSynced || 0}
                {lastSyncResult.details.itemsFailed ? ` (${lastSyncResult.details.itemsFailed} failed)` : ''}
              </p>
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
              
              <Button variant="ghost" size="sm" onClick={handleSync} disabled={isSyncing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
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
