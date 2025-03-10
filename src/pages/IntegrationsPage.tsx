
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Check, 
  X, 
  Plus, 
  RefreshCw, 
  ExternalLink, 
  Settings,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'not_connected';
  lastSync?: string;
}

const availablePlatforms: Platform[] = [
  { 
    id: 'etsy',
    name: 'Etsy',
    description: 'Sell handmade and vintage goods on the Etsy marketplace.',
    icon: '🏪',
    status: 'connected',
    lastSync: '2 hours ago'
  },
  { 
    id: 'tiktok',
    name: 'TikTok Shop',
    description: 'Sell directly to TikTok users through the integrated shopping feature.',
    icon: '📱',
    status: 'connected',
    lastSync: '1 day ago'
  },
  { 
    id: 'facebook',
    name: 'Facebook Marketplace',
    description: 'List products on Facebook\'s marketplace for local and shipping sales.',
    icon: '👥',
    status: 'connected',
    lastSync: '3 hours ago'
  },
  { 
    id: 'square',
    name: 'Square',
    description: 'Sync inventory with your Square point-of-sale system and online store.',
    icon: '🔲',
    status: 'connected',
    lastSync: '5 hours ago'
  },
  { 
    id: 'instagram',
    name: 'Instagram Shop',
    description: 'Enable shopping features on your Instagram business profile.',
    icon: '📸',
    status: 'not_connected'
  },
  { 
    id: 'amazon',
    name: 'Amazon',
    description: 'List products on Amazon\'s marketplace for global reach.',
    icon: '📦',
    status: 'not_connected'
  },
  { 
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync with your Shopify store to manage inventory across channels.',
    icon: '🛒',
    status: 'not_connected'
  },
  { 
    id: 'ebay',
    name: 'eBay',
    description: 'List products on eBay\'s auction and fixed-price marketplace.',
    icon: '🏷️',
    status: 'not_connected'
  },
];

const IntegrationsPage = () => {
  const { toast } = useToast();
  const [platforms, setPlatforms] = useState<Platform[]>(availablePlatforms);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const connectedPlatforms = platforms.filter(p => p.status === 'connected');
  const notConnectedPlatforms = platforms.filter(p => p.status === 'not_connected');
  
  const handleDisconnect = (platformId: string) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, status: 'not_connected', lastSync: undefined }
          : platform
      )
    );
    
    toast({
      title: "Platform Disconnected",
      description: `The platform has been disconnected successfully.`,
    });
  };
  
  const handleConnect = (platformId: string) => {
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, status: 'connected', lastSync: 'Just now' }
          : platform
      )
    );
    
    toast({
      title: "Platform Connected",
      description: `The platform has been connected successfully.`,
    });
  };
  
  const handleSync = (platformId: string) => {
    toast({
      title: "Synchronizing",
      description: `Synchronizing data with the platform...`,
    });
    
    // Simulate sync
    setTimeout(() => {
      setPlatforms(prev => 
        prev.map(platform => 
          platform.id === platformId 
            ? { ...platform, lastSync: 'Just now' }
            : platform
        )
      );
      
      toast({
        title: "Sync Complete",
        description: `Data has been synchronized successfully.`,
      });
    }, 1500);
  };
  
  const displayPlatforms = activeTab === 'all' 
    ? platforms 
    : activeTab === 'connected' 
      ? connectedPlatforms 
      : notConnectedPlatforms;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Integrations</h1>
        <p className="text-muted-foreground">Connect your product listings to multiple e-commerce platforms.</p>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">
              All Platforms
              <Badge variant="secondary" className="ml-2">{platforms.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="connected">
              Connected
              <Badge variant="secondary" className="ml-2">{connectedPlatforms.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="not_connected">
              Available
              <Badge variant="secondary" className="ml-2">{notConnectedPlatforms.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPlatforms.map(platform => (
              <PlatformCard 
                key={platform.id}
                platform={platform}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onSync={handleSync}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="connected" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPlatforms.map(platform => (
              <PlatformCard 
                key={platform.id}
                platform={platform}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onSync={handleSync}
              />
            ))}
            
            {displayPlatforms.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Connected Platforms</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  You haven't connected any platforms yet. Connect a platform to start listing your products.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('not_connected')}
                >
                  View Available Platforms
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="not_connected" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPlatforms.map(platform => (
              <PlatformCard 
                key={platform.id}
                platform={platform}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onSync={handleSync}
              />
            ))}
            
            {displayPlatforms.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Check className="h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium">All Platforms Connected</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  You've connected all available platforms. Great job!
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('connected')}
                >
                  View Connected Platforms
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface PlatformCardProps {
  platform: Platform;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}

const PlatformCard = ({ platform, onConnect, onDisconnect, onSync }: PlatformCardProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnectClick = () => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      onConnect(platform.id);
      setIsConnecting(false);
    }, 1000);
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
                    Enter your {platform.name} API credentials to connect your account.
                    This will allow EasyHub to manage your product listings.
                  </DialogDescription>
                </DialogHeader>
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
                <DialogFooter>
                  <Button variant="outline" onClick={() => handleConnectClick()}>
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

export default IntegrationsPage;
