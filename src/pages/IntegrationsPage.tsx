
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PlatformCard from "@/components/PlatformCard";
import type { Platform } from "../types/platform";

const availablePlatforms: Platform[] = [
  { 
    id: 'etsy',
    name: 'Etsy',
    description: 'Sell handmade and vintage goods on the Etsy marketplace.',
    icon: '🏪',
    status: 'connected',
    lastSync: '2 hours ago',
    requiredCredentials: ['accessToken', 'refreshToken'],
    authUrl: 'https://www.etsy.com/oauth/connect',
    tokenUrl: 'https://api.etsy.com/v3/public/oauth/token',
    scopes: ['listings_r', 'listings_w', 'transactions_r'],
    redirectUri: `${window.location.origin}/oauth-callback`
  },
  { 
    id: 'tiktok',
    name: 'TikTok Shop',
    description: 'Sell directly to TikTok users through the integrated shopping feature.',
    icon: '📱',
    status: 'connected',
    lastSync: '1 day ago',
    requiredCredentials: ['accessToken', 'refreshToken'],
    authUrl: 'https://auth.tiktok-shops.com/oauth/authorize',
    tokenUrl: 'https://auth.tiktok-shops.com/api/v2/token',
    scopes: ['product.read', 'product.write', 'order.read'],
    redirectUri: `${window.location.origin}/oauth-callback`
  },
  { 
    id: 'facebook',
    name: 'Facebook Marketplace',
    description: 'List products on Facebook\'s marketplace for local and shipping sales.',
    icon: '👥',
    status: 'connected',
    lastSync: '3 hours ago',
    requiredCredentials: ['accessToken', 'refreshToken'],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['catalog_management', 'business_management'],
    redirectUri: `${window.location.origin}/oauth-callback`
  },
  { 
    id: 'square',
    name: 'Square',
    description: 'Sync inventory with your Square point-of-sale system and online store.',
    icon: '🔲',
    status: 'connected',
    lastSync: '5 hours ago',
    requiredCredentials: ['accessToken', 'refreshToken'],
    authUrl: 'https://connect.squareupsandbox.com/oauth2/authorize',
    tokenUrl: 'https://connect.squareupsandbox.com/oauth2/token',
    scopes: ['ITEMS_READ', 'ITEMS_WRITE', 'INVENTORY_READ', 'INVENTORY_WRITE'],
    redirectUri: `${window.location.origin}/oauth-callback`
  },
  { 
    id: 'instagram',
    name: 'Instagram Shop',
    description: 'Enable shopping features on your Instagram business profile.',
    icon: '📸',
    status: 'not_connected',
    requiredCredentials: ['accessToken', 'refreshToken'],
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scopes: ['user_profile', 'user_media'],
    redirectUri: `${window.location.origin}/oauth-callback`
  },
  { 
    id: 'amazon',
    name: 'Amazon',
    description: 'List products on Amazon\'s marketplace for global reach.',
    icon: '📦',
    status: 'not_connected',
    requiredCredentials: ['accessToken', 'refreshToken'],
    authUrl: 'https://sellercentral.amazon.com/apps/authorize/consent',
    tokenUrl: 'https://api.amazon.com/auth/o2/token',
    scopes: ['product_listing', 'order_read'],
    redirectUri: `${window.location.origin}/oauth-callback`
  },
  { 
    id: 'shopify',
    name: 'Shopify',
    description: 'Sync with your Shopify store to manage inventory across channels.',
    icon: '🛒',
    status: 'not_connected',
    requiredCredentials: ['accessToken', 'refreshToken'],
    authUrl: 'https://accounts.shopify.com/oauth/authorize',
    tokenUrl: 'https://accounts.shopify.com/oauth/token',
    scopes: ['read_products', 'write_products', 'read_orders'],
    redirectUri: `${window.location.origin}/oauth-callback`
  },
  { 
    id: 'ebay',
    name: 'eBay',
    description: 'List products on eBay\'s auction and fixed-price marketplace.',
    icon: '🏷️',
    status: 'not_connected',
    requiredCredentials: ['accessToken', 'refreshToken'],
    authUrl: 'https://auth.ebay.com/oauth2/authorize',
    tokenUrl: 'https://api.ebay.com/identity/v1/oauth2/token',
    scopes: ['https://api.ebay.com/oauth/api_scope/sell.inventory', 'https://api.ebay.com/oauth/api_scope/sell.account'],
    redirectUri: `${window.location.origin}/oauth-callback`
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
  };
  
  const handleSync = (platformId: string) => {
    const credentials = localStorage.getItem(`${platformId}_credentials`);
    if (!credentials) {
      toast({
        title: "Sync Failed",
        description: "Platform credentials not found. Please reconnect the platform.",
        variant: "destructive",
      });
      return;
    }

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

export default IntegrationsPage;
