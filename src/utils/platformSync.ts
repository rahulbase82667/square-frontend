
import { Platform, SyncResult, PlatformSyncConfig } from "@/types/platform";
import { getPlatformCredentials, refreshAccessToken, validateCredentials } from "./platformAuth";
import { toast } from "@/hooks/use-toast";

// Simulate platform-specific API calls for different platforms
const platformApiHandlers: Record<string, {
  importProducts: () => Promise<SyncResult>;
  exportProducts: () => Promise<SyncResult>;
  setupWebhook?: () => Promise<boolean>;
}> = {
  etsy: {
    importProducts: async () => {
      // Simulate Etsy API call to fetch products
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        success: true,
        message: "Successfully imported products from Etsy",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: Math.floor(Math.random() * 20) + 10,
          itemsFailed: Math.floor(Math.random() * 3),
        }
      };
    },
    exportProducts: async () => {
      // Simulate Etsy API call to update products
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        success: true,
        message: "Successfully exported products to Etsy",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: Math.floor(Math.random() * 15) + 5,
        }
      };
    }
  },
  tiktok: {
    importProducts: async () => {
      // Simulate TikTok API call to fetch products
      await new Promise(resolve => setTimeout(resolve, 1200));
      return {
        success: true,
        message: "Successfully imported products from TikTok Shop",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: Math.floor(Math.random() * 10) + 5,
        }
      };
    },
    exportProducts: async () => {
      // Simulate TikTok API call to update products
      await new Promise(resolve => setTimeout(resolve, 1800));
      return {
        success: Math.random() > 0.2, // 20% chance of failure to demonstrate error handling
        message: Math.random() > 0.2 ? 
          "Successfully exported products to TikTok Shop" : 
          "Some products failed to export to TikTok Shop",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: Math.floor(Math.random() * 12) + 3,
          itemsFailed: Math.random() > 0.2 ? 0 : Math.floor(Math.random() * 5) + 1,
          errors: Math.random() > 0.2 ? [] : ["API rate limit exceeded", "Invalid product data format"]
        }
      };
    },
    setupWebhook: async () => {
      // Simulate setting up a webhook for real-time updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    }
  },
  square: {
    importProducts: async () => {
      // Simulate Square API call to fetch products
      await new Promise(resolve => setTimeout(resolve, 1300));
      return {
        success: true,
        message: "Successfully imported products from Square",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: Math.floor(Math.random() * 25) + 15,
        }
      };
    },
    exportProducts: async () => {
      // Simulate Square API call to update products
      await new Promise(resolve => setTimeout(resolve, 1700));
      return {
        success: true,
        message: "Successfully exported products to Square",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: Math.floor(Math.random() * 20) + 10,
        }
      };
    },
    setupWebhook: async () => {
      // Simulate setting up a webhook for real-time updates
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    }
  },
  instagram: {
    importProducts: async () => {
      // Simulate Instagram API call to fetch products
      await new Promise(resolve => setTimeout(resolve, 1600));
      return {
        success: true,
        message: "Successfully imported products from Instagram Shop",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: Math.floor(Math.random() * 15) + 5,
        }
      };
    },
    exportProducts: async () => {
      // Simulate Instagram API call to update products
      await new Promise(resolve => setTimeout(resolve, 2200));
      return {
        success: Math.random() > 0.1, // 10% chance of failure to demonstrate error handling
        message: Math.random() > 0.1 ? 
          "Successfully exported products to Instagram Shop" : 
          "Some products failed to export to Instagram Shop",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: Math.floor(Math.random() * 10) + 2,
          itemsFailed: Math.random() > 0.1 ? 0 : Math.floor(Math.random() * 3) + 1,
          errors: Math.random() > 0.1 ? [] : ["Media upload failed", "Product catalog not configured"]
        }
      };
    }
  }
};

// Get platform sync configuration from localStorage
export const getPlatformSyncConfig = (platformId: string): PlatformSyncConfig => {
  try {
    const config = localStorage.getItem(`${platformId}_sync_config`);
    return config ? JSON.parse(config) : {
      autoSync: false,
      syncInterval: 60, // Default to hourly
      syncDirection: 'bidirectional'
    };
  } catch (error) {
    console.error("Failed to retrieve platform sync config:", error);
    return {
      autoSync: false,
      syncInterval: 60,
      syncDirection: 'bidirectional'
    };
  }
};

// Save platform sync configuration to localStorage
export const savePlatformSyncConfig = (platformId: string, config: PlatformSyncConfig): void => {
  try {
    localStorage.setItem(`${platformId}_sync_config`, JSON.stringify(config));
  } catch (error) {
    console.error("Failed to save platform sync config:", error);
  }
};

// Generic function to perform synchronization with a platform
export const syncWithPlatform = async (
  platform: Platform,
  direction: 'import' | 'export' | 'bidirectional' = 'bidirectional'
): Promise<SyncResult> => {
  // Ensure we have valid credentials
  if (!validateCredentials(platform.id)) {
    // Try to refresh token if possible
    if (platform.refreshCredentials) {
      const refreshed = await refreshAccessToken(platform);
      if (!refreshed) {
        return {
          success: false,
          message: `Authentication expired for ${platform.name}. Please reconnect.`,
          timestamp: new Date().toISOString()
        };
      }
    } else {
      return {
        success: false,
        message: `Authentication expired for ${platform.name}. Please reconnect.`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Get the API handler for this platform
  const apiHandler = platformApiHandlers[platform.id];
  if (!apiHandler) {
    return {
      success: false,
      message: `No API handler configured for ${platform.name}`,
      timestamp: new Date().toISOString()
    };
  }

  try {
    let importResult: SyncResult | undefined;
    let exportResult: SyncResult | undefined;

    // Import products if direction is import or bidirectional
    if (direction === 'import' || direction === 'bidirectional') {
      importResult = await apiHandler.importProducts();
      if (!importResult.success) {
        return importResult;
      }
    }

    // Export products if direction is export or bidirectional
    if (direction === 'export' || direction === 'bidirectional') {
      exportResult = await apiHandler.exportProducts();
      if (!exportResult.success) {
        return exportResult;
      }
    }

    // Combine results or return the appropriate one
    if (importResult && exportResult) {
      return {
        success: true,
        message: "Two-way synchronization completed successfully",
        timestamp: new Date().toISOString(),
        details: {
          itemsSynced: (importResult.details?.itemsSynced || 0) + (exportResult.details?.itemsSynced || 0),
          itemsFailed: (importResult.details?.itemsFailed || 0) + (exportResult.details?.itemsFailed || 0),
          errors: [...(importResult.details?.errors || []), ...(exportResult.details?.errors || [])]
        }
      };
    } else if (importResult) {
      return importResult;
    } else if (exportResult) {
      return exportResult;
    }

    // Default success response if we somehow get here
    return {
      success: true,
      message: "Synchronization completed",
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error syncing with ${platform.name}:`, error);
    return {
      success: false,
      message: `Failed to sync with ${platform.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    };
  }
};

// Set up a webhook for platforms that support real-time updates
export const setupPlatformWebhook = async (platform: Platform): Promise<boolean> => {
  if (!platform.webhookSupport) {
    return false;
  }

  const apiHandler = platformApiHandlers[platform.id];
  if (!apiHandler || !apiHandler.setupWebhook) {
    return false;
  }

  try {
    return await apiHandler.setupWebhook();
  } catch (error) {
    console.error(`Error setting up webhook for ${platform.name}:`, error);
    return false;
  }
};

// Scheduler for automatic synchronization
let syncIntervals: Record<string, number> = {};

export const startAutoSync = (platform: Platform): void => {
  const config = getPlatformSyncConfig(platform.id);
  
  if (!config.autoSync) {
    return;
  }
  
  // Clear any existing interval
  stopAutoSync(platform.id);
  
  // Set up a new interval
  const intervalId = window.setInterval(async () => {
    const result = await syncWithPlatform(platform, config.syncDirection);
    
    // Update the last sync status
    const updatedConfig = {
      ...config,
      lastSyncStatus: result
    };
    savePlatformSyncConfig(platform.id, updatedConfig);
    
    // Notify user of the sync result
    if (result.success) {
      toast({
        title: "Auto-Sync Completed",
        description: result.message,
      });
    } else {
      toast({
        title: "Auto-Sync Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  }, config.syncInterval * 60 * 1000);
  
  syncIntervals[platform.id] = intervalId;
};

export const stopAutoSync = (platformId: string): void => {
  if (syncIntervals[platformId]) {
    clearInterval(syncIntervals[platformId]);
    delete syncIntervals[platformId];
  }
};
