
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Platform, PlatformSyncConfig } from "@/types/platform";
import { getPlatformSyncConfig, savePlatformSyncConfig, startAutoSync, stopAutoSync } from "@/utils/platformSync";

interface PlatformSyncSettingsProps {
  platform: Platform;
}

const PlatformSyncSettings = ({ platform }: PlatformSyncSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [syncConfig, setSyncConfig] = useState<PlatformSyncConfig>({
    autoSync: false,
    syncInterval: 60,
    syncDirection: 'bidirectional',
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load existing config when dialog opens
    if (isOpen) {
      const config = getPlatformSyncConfig(platform.id);
      setSyncConfig(config);
    }
  }, [isOpen, platform.id]);

  const handleSave = () => {
    try {
      savePlatformSyncConfig(platform.id, syncConfig);
      
      // Start or stop auto sync based on config
      if (syncConfig.autoSync) {
        startAutoSync(platform);
        toast({
          title: "Auto-Sync Enabled",
          description: `Products will sync with ${platform.name} every ${syncConfig.syncInterval} minutes.`,
        });
      } else {
        stopAutoSync(platform.id);
        toast({
          title: "Auto-Sync Disabled",
          description: `Auto synchronization with ${platform.name} has been disabled.`,
        });
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving sync config:', error);
      toast({
        title: "Error",
        description: "Failed to save synchronization settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Sync Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{platform.name} Synchronization Settings</DialogTitle>
          <DialogDescription>
            Configure how your products sync with {platform.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-sync">Automatic Synchronization</Label>
              <p className="text-sm text-muted-foreground">
                Enable to automatically sync products on a schedule
              </p>
            </div>
            <Switch
              id="auto-sync"
              checked={syncConfig.autoSync}
              onCheckedChange={(checked) => setSyncConfig({...syncConfig, autoSync: checked})}
            />
          </div>
          
          {syncConfig.autoSync && (
            <div className="space-y-2">
              <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
              <Input
                id="sync-interval"
                type="number"
                min="15"
                value={syncConfig.syncInterval}
                onChange={(e) => setSyncConfig({...syncConfig, syncInterval: parseInt(e.target.value) || 60})}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 15 minutes to avoid API rate limits
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Synchronization Direction</Label>
            <RadioGroup
              value={syncConfig.syncDirection}
              onValueChange={(value: 'import' | 'export' | 'bidirectional') => 
                setSyncConfig({...syncConfig, syncDirection: value})
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bidirectional" id="bidirectional" />
                <Label htmlFor="bidirectional">Two-way (Import & Export)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="import" id="import" />
                <Label htmlFor="import">Import Only (From {platform.name} to this app)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="export" id="export" />
                <Label htmlFor="export">Export Only (From this app to {platform.name})</Label>
              </div>
            </RadioGroup>
          </div>
          
          {platform.webhookSupport && (
            <div className="space-y-2">
              <Label>Webhook Integration</Label>
              <p className="text-sm text-muted-foreground">
                {platform.name} supports real-time updates via webhooks. This allows immediate syncing when products change.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Configure Webhook
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlatformSyncSettings;
