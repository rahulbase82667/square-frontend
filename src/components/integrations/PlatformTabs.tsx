
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Platform } from "@/components/PlatformCard";
import PlatformsGrid from "./PlatformsGrid";
import EmptyPlatformState from "./EmptyPlatformState";

interface PlatformTabsProps {
  platforms: Platform[];
  activeTab: string;
  setActiveTab: (value: string) => void;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}

const PlatformTabs = ({ 
  platforms, 
  activeTab, 
  setActiveTab,
  onConnect,
  onDisconnect,
  onSync
}: PlatformTabsProps) => {
  const connectedPlatforms = platforms.filter(p => p.status === 'connected');
  const notConnectedPlatforms = platforms.filter(p => p.status === 'not_connected');
  
  const displayPlatforms = activeTab === 'all' 
    ? platforms 
    : activeTab === 'connected' 
      ? connectedPlatforms 
      : notConnectedPlatforms;

  return (
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
      
      {['all', 'connected', 'not_connected'].map((tabValue) => (
        <TabsContent key={tabValue} value={tabValue} className="mt-6">
          <PlatformsGrid
            platforms={displayPlatforms}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            onSync={onSync}
          />
          
          {displayPlatforms.length === 0 && (
            <EmptyPlatformState
              type={tabValue === 'connected' ? 'not_connected' : 'connected'}
              onActionClick={() => setActiveTab(tabValue === 'connected' ? 'not_connected' : 'connected')}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PlatformTabs;
