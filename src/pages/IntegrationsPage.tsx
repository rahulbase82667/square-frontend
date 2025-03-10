import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkSquareConnection } from "@/utils/squareApi";
import { Platform } from "@/components/PlatformCard";
import IntegrationStatusBanner from "@/components/integrations/IntegrationStatusBanner";
import PlatformTabs from "@/components/integrations/PlatformTabs";

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

  return (
    <div className="space-y-6">
      <IntegrationStatusBanner isLoading={isLoading} />
      
      <div>
        <h1 className="text-2xl font-bold">Platform Integrations</h1>
        <p className="text-muted-foreground">Connect your product listings to multiple e-commerce platforms.</p>
      </div>
      
      <PlatformTabs
        platforms={platforms}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onSync={handleSync}
      />
    </div>
  );
};

export default IntegrationsPage;
