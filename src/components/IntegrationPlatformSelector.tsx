
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface IntegrationPlatform {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
}

interface IntegrationPlatformSelectorProps {
  selectedPlatforms: string[];
  setSelectedPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
}

// Mock data for available platforms
const availablePlatforms: IntegrationPlatform[] = [
  { id: 'etsy', name: 'Etsy', icon: '🏪', connected: true },
  { id: 'tiktok', name: 'TikTok Shop', icon: '📱', connected: true },
  { id: 'facebook', name: 'Facebook Marketplace', icon: '👥', connected: true },
  { id: 'square', name: 'Square', icon: '🔲', connected: true },
  { id: 'instagram', name: 'Instagram Shop', icon: '📸', connected: false },
];

const IntegrationPlatformSelector = ({
  selectedPlatforms,
  setSelectedPlatforms
}: IntegrationPlatformSelectorProps) => {
  
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
          <li key={platform.id} className={`flex items-center space-x-3 p-2 rounded-md ${platform.connected ? 'bg-white' : 'bg-gray-50'}`}>
            <Checkbox
              id={`platform-${platform.id}`}
              checked={selectedPlatforms.includes(platform.id)}
              onCheckedChange={() => platform.connected && handlePlatformToggle(platform.id)}
              disabled={!platform.connected}
            />
            <Label
              htmlFor={`platform-${platform.id}`}
              className={`flex items-center gap-2 text-sm cursor-pointer flex-1 ${!platform.connected && 'text-muted-foreground'}`}
            >
              <span className="text-lg">{platform.icon}</span>
              <span>{platform.name}</span>
            </Label>
            {!platform.connected && (
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
