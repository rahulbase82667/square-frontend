
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, AlertCircle, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PlatformBadge from "@/components/PlatformBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { fetchPlatformInventory, saveLocalInventory } from "@/utils/inventorySync";
import { Platform, InventoryUpdate } from "@/types/platform";

interface InventorySyncManagerProps {
  product: { 
    id: string; 
    name: string; 
    sku: string;
    inventory: number;
    platforms: string[];
  };
  connectedPlatforms: Platform[];
}

const InventorySyncManager = ({ product, connectedPlatforms }: InventorySyncManagerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [localInventory, setLocalInventory] = useState(product.inventory);
  const [platformInventory, setPlatformInventory] = useState<Record<string, InventoryUpdate | null>>({});
  
  const platformsWithInventorySync = connectedPlatforms.filter(p => p.inventorySync);
  
  // Load inventory data from platforms
  const loadInventoryData = async () => {
    setIsLoading(true);
    
    try {
      const updatesPromises = platformsWithInventorySync.map(async platform => {
        if (product.platforms.includes(platform.id)) {
          const updates = await fetchPlatformInventory(platform, [product.id]);
          return { platformId: platform.id, update: updates[0] || null };
        }
        return { platformId: platform.id, update: null };
      });
      
      const results = await Promise.all(updatesPromises);
      
      const inventoryMap: Record<string, InventoryUpdate | null> = {};
      results.forEach(result => {
        inventoryMap[result.platformId] = result.update;
      });
      
      setPlatformInventory(inventoryMap);
      
      toast({
        title: "Inventory Loaded",
        description: "Current inventory quantities have been loaded from all platforms."
      });
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory data from platforms.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Load inventory data when component mounts
    if (platformsWithInventorySync.length > 0) {
      loadInventoryData();
    }
  }, []);
  
  const handleSaveLocalInventory = () => {
    saveLocalInventory(product.id, localInventory);
    toast({
      title: "Inventory Updated",
      description: "Local inventory has been updated. Sync with platforms to update them."
    });
  };
  
  const applyPlatformInventory = (platformId: string) => {
    const update = platformInventory[platformId];
    if (update) {
      setLocalInventory(update.quantity);
      saveLocalInventory(product.id, update.quantity);
      toast({
        title: "Inventory Updated",
        description: `Local inventory has been updated to match ${connectedPlatforms.find(p => p.id === platformId)?.name}.`
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Synchronization
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadInventoryData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {platformsWithInventorySync.length === 0 ? (
          <div className="text-center py-4">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">
              No platforms with inventory sync capability are connected.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => window.location.href = '/integrations'}
            >
              Manage Integrations
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="local-inventory">Local Inventory</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="local-inventory"
                  type="number"
                  min="0"
                  value={localInventory}
                  onChange={(e) => setLocalInventory(parseInt(e.target.value) || 0)}
                  className="w-32"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveLocalInventory}
                >
                  Update
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This is your local inventory count. Update here first, then sync with platforms.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Platform Inventory</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {platformsWithInventorySync
                    .filter(platform => product.platforms.includes(platform.id))
                    .map(platform => {
                      const update = platformInventory[platform.id];
                      return (
                        <TableRow key={platform.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <PlatformBadge platformId={platform.id} />
                              {platform.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {update ? update.quantity : 'Not available'}
                          </TableCell>
                          <TableCell>
                            {update 
                              ? new Date(update.timestamp).toLocaleString()
                              : 'Never'
                            }
                          </TableCell>
                          <TableCell>
                            {update && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => applyPlatformInventory(platform.id)}
                              >
                                Use This Value
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              
              {platformsWithInventorySync.filter(platform => 
                product.platforms.includes(platform.id)).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  This product isn't listed on any platforms with inventory sync capability.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Inventory quantities are automatically synchronized during product sync operations.
        </p>
      </CardFooter>
    </Card>
  );
};

export default InventorySyncManager;
