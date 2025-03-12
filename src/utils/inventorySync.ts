
import { Platform, InventoryUpdate, SyncResult } from "@/types/platform";
import { getPlatformCredentials, validateCredentials } from "./platformAuth";
import { getPlatformSyncConfig, syncWithPlatform } from "./platformSync";
import { useToast } from "@/hooks/use-toast";

// Map to track the latest inventory updates for each product
const inventoryUpdatesMap = new Map<string, InventoryUpdate>();

// Get product inventory from local storage
export const getLocalInventory = (productId: string): number | null => {
  try {
    const inventory = localStorage.getItem(`inventory_${productId}`);
    return inventory ? parseInt(inventory, 10) : null;
  } catch (error) {
    console.error("Failed to retrieve local inventory:", error);
    return null;
  }
};

// Save product inventory to local storage
export const saveLocalInventory = (productId: string, quantity: number): void => {
  try {
    localStorage.setItem(`inventory_${productId}`, quantity.toString());
    
    // Also record this as an update
    const update: InventoryUpdate = {
      productId,
      sku: localStorage.getItem(`sku_${productId}`) || productId,
      quantity,
      platformId: 'local',
      timestamp: Date.now()
    };
    
    recordInventoryUpdate(update);
  } catch (error) {
    console.error("Failed to save local inventory:", error);
  }
};

// Record an inventory update
export const recordInventoryUpdate = (update: InventoryUpdate): void => {
  const key = `${update.productId}_${update.platformId}`;
  const existingUpdate = inventoryUpdatesMap.get(key);
  
  // Only update if this is newer than the existing update
  if (!existingUpdate || update.timestamp > existingUpdate.timestamp) {
    inventoryUpdatesMap.set(key, update);
    
    // Also store in localStorage for persistence
    try {
      const updates = JSON.parse(localStorage.getItem('inventory_updates') || '[]');
      const filteredUpdates = updates.filter((u: InventoryUpdate) => 
        !(u.productId === update.productId && u.platformId === update.platformId)
      );
      filteredUpdates.push(update);
      localStorage.setItem('inventory_updates', JSON.stringify(filteredUpdates));
    } catch (error) {
      console.error("Failed to store inventory update:", error);
    }
  }
};

// Get pending inventory updates (those that need to be synced)
export const getPendingInventoryUpdates = (platformId: string): InventoryUpdate[] => {
  try {
    const updates = JSON.parse(localStorage.getItem('inventory_updates') || '[]');
    // Get updates from this platform and 'local' that haven't been synced yet
    return updates.filter((update: InventoryUpdate) => 
      (update.platformId === 'local' || update.platformId === platformId)
    );
  } catch (error) {
    console.error("Failed to retrieve pending inventory updates:", error);
    return [];
  }
};

// Simulate fetching inventory from a platform
export const fetchPlatformInventory = async (platform: Platform, productIds?: string[]): Promise<InventoryUpdate[]> => {
  // In a real implementation, this would call the platform's API
  console.log(`Fetching inventory from ${platform.name} for products:`, productIds);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Simulate response with random inventory levels
  const updates: InventoryUpdate[] = (productIds || [
    'product1', 
    'product2', 
    'product3',
    'product4',
    'product5'
  ]).map(id => ({
    productId: id,
    sku: `SKU-${id}`,
    quantity: Math.floor(Math.random() * 50) + 1,
    platformId: platform.id,
    timestamp: Date.now() - Math.floor(Math.random() * 86400000) // Random time in the last day
  }));
  
  return updates;
};

// Push inventory updates to a platform
export const pushInventoryToPlatform = async (
  platform: Platform, 
  updates: InventoryUpdate[]
): Promise<SyncResult> => {
  // In a real implementation, this would call the platform's API
  console.log(`Pushing ${updates.length} inventory updates to ${platform.name}:`, updates);
  
  // Simulate API delay and occasional failures
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
  
  const success = Math.random() > 0.1; // 10% chance of failure
  
  if (!success) {
    return {
      success: false,
      message: `Failed to update inventory on ${platform.name}. Please try again.`,
      timestamp: new Date().toISOString(),
      details: {
        itemsSynced: 0,
        inventoryUpdated: 0,
        errors: ["API rate limit exceeded"]
      }
    };
  }
  
  // Simulate successful update
  return {
    success: true,
    message: `Successfully updated inventory on ${platform.name}`,
    timestamp: new Date().toISOString(),
    details: {
      itemsSynced: 0,
      inventoryUpdated: updates.length,
    }
  };
};

// Resolve inventory conflicts according to the specified strategy
export const resolveInventoryConflict = (
  localUpdate: InventoryUpdate | null, 
  platformUpdate: InventoryUpdate | null,
  strategy: 'platform' | 'local' | 'newest' = 'newest'
): InventoryUpdate | null => {
  if (!localUpdate) return platformUpdate;
  if (!platformUpdate) return localUpdate;
  
  switch (strategy) {
    case 'platform':
      return platformUpdate;
    case 'local':
      return localUpdate;
    case 'newest':
    default:
      return localUpdate.timestamp > platformUpdate.timestamp ? localUpdate : platformUpdate;
  }
};

// Synchronize inventory between local and platform
export const syncInventory = async (platform: Platform): Promise<SyncResult> => {
  if (!platform.inventorySync) {
    return {
      success: false,
      message: `Inventory sync is not supported for ${platform.name}`,
      timestamp: new Date().toISOString()
    };
  }
  
  if (!validateCredentials(platform.id)) {
    return {
      success: false,
      message: `Authentication required for ${platform.name}`,
      timestamp: new Date().toISOString()
    };
  }
  
  const config = getPlatformSyncConfig(platform.id);
  const direction = config.syncDirection;
  const strategy = config.inventoryPriority || 'newest';
  
  try {
    let localToRemoteUpdates: InventoryUpdate[] = [];
    let remoteToLocalUpdates: InventoryUpdate[] = [];
    
    // Get local product IDs (in a real app, this would come from your database)
    const localProductIds = ['product1', 'product2', 'product3', 'product4', 'product5'];
    
    // Step 1: Fetch platform inventory if we need to import
    if (direction === 'import' || direction === 'bidirectional') {
      const platformUpdates = await fetchPlatformInventory(platform, localProductIds);
      
      platformUpdates.forEach(platformUpdate => {
        // Record the update
        recordInventoryUpdate(platformUpdate);
        
        // Get the latest local update for comparison
        const localUpdate = Array.from(inventoryUpdatesMap.values())
          .find(u => u.productId === platformUpdate.productId && u.platformId === 'local');
        
        // Resolve any conflicts
        const resolvedUpdate = resolveInventoryConflict(localUpdate, platformUpdate, strategy);
        
        if (resolvedUpdate && resolvedUpdate.platformId === platform.id) {
          // Platform inventory should be used, update local
          remoteToLocalUpdates.push(resolvedUpdate);
          saveLocalInventory(resolvedUpdate.productId, resolvedUpdate.quantity);
        }
      });
    }
    
    // Step 2: Push local inventory to platform if we need to export
    if (direction === 'export' || direction === 'bidirectional') {
      // Get all local updates that need to be synced
      localProductIds.forEach(productId => {
        const quantity = getLocalInventory(productId);
        if (quantity !== null) {
          localToRemoteUpdates.push({
            productId,
            sku: localStorage.getItem(`sku_${productId}`) || productId,
            quantity,
            platformId: 'local',
            timestamp: Date.now()
          });
        }
      });
      
      // Only push if we have updates
      if (localToRemoteUpdates.length > 0) {
        await pushInventoryToPlatform(platform, localToRemoteUpdates);
      }
    }
    
    return {
      success: true,
      message: `Inventory sync with ${platform.name} completed successfully`,
      timestamp: new Date().toISOString(),
      details: {
        inventoryUpdated: remoteToLocalUpdates.length + localToRemoteUpdates.length,
      }
    };
  } catch (error) {
    console.error(`Error synchronizing inventory with ${platform.name}:`, error);
    return {
      success: false,
      message: `Failed to sync inventory with ${platform.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    };
  }
};

// Update the platform sync configuration specifically for inventory settings
export const updateInventorySyncConfig = (
  platformId: string, 
  config: {
    syncInventoryOnly?: boolean;
    inventoryPriority?: 'platform' | 'local' | 'newest';
  }
): void => {
  try {
    // Get existing config
    const existingConfig = getPlatformSyncConfig(platformId);
    
    // Update with new inventory settings
    const updatedConfig = {
      ...existingConfig,
      ...config
    };
    
    // Save back to localStorage
    localStorage.setItem(`${platformId}_sync_config`, JSON.stringify(updatedConfig));
  } catch (error) {
    console.error("Failed to update inventory sync config:", error);
  }
};

