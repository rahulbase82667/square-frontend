
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, ExternalLink } from 'lucide-react';
import type { Platform } from '@/types/platform';
import { Textarea } from "@/components/ui/textarea";
import { initializeOAuth, storePlatformCredentials } from '@/utils/platformAuth';

interface PlatformOAuthConnectorProps {
  platform: Platform;
  onConnect: (platformId: string) => void;
}

export const PlatformOAuthConnector = ({ platform, onConnect }: PlatformOAuthConnectorProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  

  const handleInitiateOAuth = () => {
    try {
      initializeOAuth(platform);
      
      // For demo purposes only - in a real app, this would be handled by the OAuth callback
      setTimeout(() => {
        setIsDialogOpen(true);
      }, 2000);
    } catch (error) {
      console.error('OAuth initialization error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to initiate the OAuth flow. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConnect = async () => {
    if (!manualToken) {
      toast({
        title: "Token Required",
        description: "Please enter the authorization token you received.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Simulate token validation
      storePlatformCredentials(platform.id, {
        accessToken: manualToken,
        refreshToken: 'demo_refresh_token',
        expiresAt: Date.now() + 3600000 // 1 hour from now
      });
      
      onConnect(platform.id);
      
      toast({
        title: "Successfully Connected",
        description: `Connected to ${platform.name} successfully!`,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the platform. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleInitiateOAuth}>
        <Plus className="h-4 w-4 mr-2" />
        Connect
      </Button>
      
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete {platform.name} Connection</DialogTitle>
            <DialogDescription>
              After authorizing with {platform.name}, enter the token you received to complete the connection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                In a real implementation, you would be redirected back to this application automatically. For demonstration purposes, please enter the token manually:
              </p>
              <Textarea
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="Paste your authorization token here"
                className="h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Complete Connection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  );
};



// import { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { Plus } from 'lucide-react';
// import type { Platform } from '@/types/platform';
// import { initializeOAuth, storePlatformCredentials } from '@/utils/platformAuth';

// interface PlatformOAuthConnectorProps {
//   platform: Platform;
//   onConnect: (platformId: string) => void;
// }

// export const PlatformOAuthConnector = ({ platform, onConnect }: PlatformOAuthConnectorProps) => {
//   const [isConnecting, setIsConnecting] = useState(false);
//   const { toast } = useToast();

//   // ✅ Initiate OAuth connection
//   const handleInitiateOAuth = async () => {
//     setIsConnecting(true);
//     try {
//       await initializeOAuth(platform);

//       // ✅ Simulate OAuth callback success (Remove in production)
//       setTimeout(async () => {
//         storePlatformCredentials(platform.id, {
//           accessToken: 'demo_access_token',
//           refreshToken: 'demo_refresh_token',
//           expiresAt: Date.now() + 3600000 // 1 hour from now
//         });

//         // ✅ Update platform state
//         platform.status = 'connected';
//         onConnect(platform.id);

//         toast({
//           title: "Successfully Connected",
//           description: `Connected to ${platform.name} successfully!`,
//         });
//       }, 2000);
//     } catch (error) {
//       console.error('OAuth initialization error:', error);
//       toast({
//         title: "Connection Error",
//         description: "Failed to initiate the OAuth flow. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   return (
//     <>
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={handleInitiateOAuth}
//         disabled={isConnecting}
//       >
//         {isConnecting ? (
//           <>
//             <Plus className="h-4 w-4 mr-2 animate-spin" />
//             Connecting...
//           </>
//         ) : (
//           <>
//             <Plus className="h-4 w-4 mr-2" />
//             Connect
//           </>
//         )}
//       </Button>
//     </>
//   );
// };

