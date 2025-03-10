
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PlatformCard, { Platform } from "@/components/PlatformCard";
import { checkSquareConnection } from "@/utils/squareApi";

const initialPlatforms: Platform[] = [
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
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const verifySquareConnection = async () => {
      try {
        setIsLoading(true);
        const isConnected = await checkSquareConnection();
        
        setPlatforms(prev => 
          prev.map(platform => 
            platform.id === 'square' 
              ? { ...platform, status: isConnected ? 'connected' : 'not_connected' } 
              : platform
          )
        );
        
        if (isConnected) {
          toast({
            title: "Square Connection Verified",
            description: "Your Square integration is active and working correctly.",
          });
        } else {
          toast({
            title: "Square Connection Issue",
            description: "There was a problem connecting to Square. Please check your API credentials.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to verify Square connection:", error);
        toast({
          title: "Connection Error",
          description: "Could not verify Square connection status.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    verifySquareConnection();
  }, [toast]);
  
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
      title: "Synchronization Complete",
      description: `Products have been synchronized with ${platforms.find(p => p.id === platformId)?.name}.`,
    });
    
    setPlatforms(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, lastSync: 'Just now' }
          : platform
      )
    );
  };
  
  const displayPlatforms = activeTab === 'all' 
    ? platforms 
    : activeTab === 'connected' 
      ? connectedPlatforms 
      : notConnectedPlatforms;
  
  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
          <p className="text-blue-700 text-sm">Verifying connection status with platforms...</p>
        </div>
      )}
      
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

export default IntegrationsPage;
