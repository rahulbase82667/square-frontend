
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from 'lucide-react';
import { exchangeCodeForToken } from '@/utils/platformAuth';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [platformName, setPlatformName] = useState<string>('');
  const [platformId, setPlatformId] = useState<string>('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const platformParam = searchParams.get('platform') || '';
    
    // In a real implementation, we would validate the state parameter
    // to protect against CSRF attacks
    
    // Extract platform ID from state or use the explicit platform param
    const parts = state?.split('_') || [];
    const extractedPlatformId = parts.length > 0 ? parts[0] : '';
    const finalPlatformId = platformParam || extractedPlatformId;
    
    setPlatformId(finalPlatformId);
    
    const findPlatformName = (id: string) => {
      // This is a simple demo implementation
      const platformMap: Record<string, string> = {
        'etsy': 'Etsy',
        'tiktok': 'TikTok Shop',
        'facebook': 'Facebook Marketplace',
        'square': 'Square',
        'instagram': 'Instagram Shop',
        'amazon': 'Amazon',
        'shopify': 'Shopify',
        'ebay': 'eBay'
      };
      return platformMap[id] || 'Platform';
    };

    setPlatformName(findPlatformName(finalPlatformId));

    if (error) {
      setStatus('error');
      toast({
        title: "Authorization Failed",
        description: `Error: ${error}`,
        variant: "destructive",
      });
      return;
    }

    if (!code) {
      setStatus('error');
      toast({
        title: "Missing Authorization Code",
        description: "No authorization code was received from the provider.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would be a server-side API call
    // For demo purposes, we're simulating the token exchange
    const mockPlatform = {
      id: finalPlatformId,
      name: findPlatformName(finalPlatformId),
      tokenUrl: 'https://api.example.com/oauth/token',
      description: '',
      icon: '',
      status: 'not_connected' as const,
      requiredCredentials: ['accessToken', 'refreshToken'],
    };

    const processOAuth = async () => {
      try {
        await exchangeCodeForToken(mockPlatform, code);
        setStatus('success');
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${platformName}!`,
        });
      } catch (error) {
        setStatus('error');
        toast({
          title: "Authorization Failed",
          description: "Failed to exchange authorization code for an access token.",
          variant: "destructive",
        });
      }
    };

    processOAuth();
  }, [searchParams, toast, platformName]);

  const handleContinue = () => {
    navigate('/integrations');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px] max-w-full">
        <CardHeader className="text-center">
          <CardTitle>{status === 'processing' ? 'Connecting...' : status === 'success' ? 'Connection Successful' : 'Connection Failed'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center pt-6 pb-8">
          {status === 'processing' ? (
            <div className="animate-pulse text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-blue-400"></div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Completing connection to {platformName}...
              </p>
            </div>
          ) : status === 'success' ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">
                Successfully connected to {platformName}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">
                Failed to connect to {platformName}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleContinue} disabled={status === 'processing'}>
            {status === 'success' ? 'Continue to Integrations' : status === 'error' ? 'Try Again' : 'Please wait...'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OAuthCallback;
