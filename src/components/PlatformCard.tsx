import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Settings, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlatformConnector } from './PlatformConnector';
import type { Platform } from '../types/platform';

interface PlatformCardProps {
  platform: Platform;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}

const PlatformCard = ({ platform, onConnect, onDisconnect, onSync }: PlatformCardProps) => {
  const [isConnecting, setIsConnecting] = useState(false);

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
            <Button variant="ghost" size="icon" onClick={() => onSync(platform.id)}>
              <RefreshCw className="h-4 w-4" />
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
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      localStorage.removeItem(`${platform.id}_credentials`);
                      onDisconnect(platform.id);
                    }}
                  >
                    Yes, Disconnect
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={() => onSync(platform.id)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>
          </>
        ) : (
          <PlatformConnector
            platformId={platform.id}
            platformName={platform.name}
            onConnect={onConnect}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default PlatformCard;
