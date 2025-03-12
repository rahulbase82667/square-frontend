
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateCredentials } from "@/utils/platformAuth";
import { Badge } from "@/components/ui/badge";
import { Platform } from "@/types/platform";

interface IntegrationPlatformSelectorProps {
  selectedPlatforms: string[];
  setSelectedPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
}

const IntegrationPlatformSelector = ({
  selectedPlatforms,
  setSelectedPlatforms
}: IntegrationPlatformSelectorProps) => {
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([
    { 
      id: 'etsy', 
      name: 'Etsy', 
      icon: '🏪', 
      status: 'not_connected',
      description: 'Marketplace for handmade items',
      requiredCredentials: ['accessToken', 'refreshToken'],
      inventorySync: true
    },
    { 
      id: 'tiktok', 
      name: 'TikTok Shop', 
      icon: '📱', 
      status: 'not_connected',
      description: 'Social commerce platform',
      requiredCredentials: ['accessToken', 'refreshToken'],
      inventorySync: true
    },
    { 
      id: 'facebook', 
      name: 'Facebook Marketplace', 
      icon: '👥', 
      status: 'not_connected',
      description: 'Social marketplace platform',
      requiredCredentials: ['accessToken', 'refreshToken'],
      inventorySync: false
    },
    { 
      id: 'square', 
      name: 'Square', 
      icon: '🔲', 
      status: 'not_connected',
      description: 'Point of sale and online payments',
      requiredCredentials: ['accessToken', 'refreshToken'],
      inventorySync: true
    },
    { 
      id: 'instagram', 
      name: 'Instagram Shop', 
      icon: '📸', 
      status: 'not_connected',
      description: 'Social commerce platform',
      requiredCredentials: ['accessToken', 'refreshToken'],
      inventorySync: false
    },
  ]);
  
  // Check for connected platforms
  useEffect(() => {
    const updatedPlatforms = availablePlatforms.map(platform => {
      const isConnected = validateCredentials(platform.id);
      return {
        ...platform,
        status: isConnected ? 'connected' as const : 'not_connected' as const
      };
    });
    
    setAvailablePlatforms(updatedPlatforms);
  }, []);
  
  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };
  
  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {availablePlatforms.map(platform => (
          <li key={platform.id} className={`flex items-center space-x-3 p-2 rounded-md ${platform.status === 'connected' ? 'bg-white' : 'bg-gray-50'}`}>
            <Checkbox
              id={`platform-${platform.id}`}
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={() => platform.status === 'connected' && handlePlatformToggle(platform.id)}
              disabled={platform.status !== 'connected'}
            />
            <Label
              htmlFor={`platform-${platform.id}`}
              className={`flex items-center gap-2 text-sm cursor-pointer flex-1 ${platform.status !== 'connected' && 'text-muted-foreground'}`}
            >
              <span className="text-lg">{platform.icon}</span>
              <span>{platform.name}</span>
              {platform.inventorySync && (
                <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700 border-blue-200 text-xs py-0">
                  <Package className="h-2.5 w-2.5 mr-1" /> Inventory
                </Badge>
              )}
            </Label>
            {platform.status !== 'connected' && (
              <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                Not Connected
              </span>
            )}
          </li>
        ))}
      </ul>
      
      <div className="text-xs text-center">
        <Link to="/integrations" className="flex items-center justify-center gap-1 text-brand-blue hover:underline mt-3">
          <span>Manage integrations</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};

export default IntegrationPlatformSelector;
