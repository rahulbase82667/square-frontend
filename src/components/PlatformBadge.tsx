
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlatformBadgeProps {
  platformId: string;
}

const platformData: Record<string, { name: string, emoji: string }> = {
  'etsy': { name: 'Etsy', emoji: '🏪' },
  'tiktok': { name: 'TikTok Shop', emoji: '📱' },
  'facebook': { name: 'Facebook', emoji: '👥' },
  'square': { name: 'Square', emoji: '🔲' },
  'instagram': { name: 'Instagram', emoji: '📸' },
  'amazon': { name: 'Amazon', emoji: '📦' },
  'shopify': { name: 'Shopify', emoji: '🛒' },
  'ebay': { name: 'eBay', emoji: '🏷️' },
};

const PlatformBadge = ({ platformId }: PlatformBadgeProps) => {
  const platform = platformData[platformId] || { name: platformId, emoji: '🔗' };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="w-7 h-7 p-0 flex items-center justify-center">
            {platform.emoji}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{platform.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PlatformBadge;
