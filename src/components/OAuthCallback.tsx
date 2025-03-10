
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from 'lucide-react';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [platformName, setPlatformName] = useState<string>('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const platformId = searchParams.get('platform') || '';

    // For demo purposes, extract platformId from state
    // In a real implementation, this would come from the state parameter
    const parts = state?.split('_') || [];
    const extractedPlatformId = parts.length > 0 ? parts[0] : '';
    
    // Use either the explicit platform param or try to extract from state
    const finalPlatformId = platformId || extractedPlatformId;
    
    const findPlatformName = (id: string) => {
      // This is a simple demo implementation
      // In a real app, you would fetch this from your state or make an API call
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

    // Simulate exchanging the code for an access token
    // In a real implementation, this would be an API call to your backend
    setTimeout(() => {
      // Simulate successful token exchange
      if (code.length > 5) {
        setStatus('success');
        
        // Store the mock tokens in localStorage
        localStorage.setItem(`${finalPlatformId}_credentials`, JSON.stringify({
          accessToken: 'mock_access_token_' + Math.random().toString(36).substring(2),
          refreshToken: 'mock_refresh_token_' + Math.random().toString(36).substring(2),
          expiresAt: Date.now() + 3600000 // 1 hour from now
        }));
        
        toast({
          title: "Connection Successful",
          description: `Successfully connected to ${platformName}!`,
        });
      } else {
        setStatus('error');
        toast({
          title: "Authorization Failed",
          description: "Failed to exchange authorization code for an access token.",
          variant: "destructive",
        });
      }
    }, 2000);
  }, [searchParams, toast]);

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
