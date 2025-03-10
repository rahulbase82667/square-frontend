
import { Platform } from "@/components/PlatformCard";
import PlatformCard from "@/components/PlatformCard";

interface PlatformsGridProps {
  platforms: Platform[];
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}

const PlatformsGrid = ({ platforms, onConnect, onDisconnect, onSync }: PlatformsGridProps) => {
  if (platforms.length === 0) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {platforms.map(platform => (
        <PlatformCard 
          key={platform.id}
          platform={platform}
          onConnect={onConnect}
          onDisconnect={onDisconnect}
          onSync={onSync}
        />
      ))}
    </div>
  );
};

export default PlatformsGrid;
