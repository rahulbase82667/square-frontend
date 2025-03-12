
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Mail, Facebook, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productId: string;
}

const ShareProductDialog = ({ 
  open, 
  onOpenChange, 
  productName,
  productId 
}: ShareProductDialogProps) => {
  const { toast } = useToast();
  const shareUrl = `https://yourstore.com/products/${productId}`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied",
      description: "The product link has been copied to your clipboard.",
    });
  };
  
  const shareViaEmail = () => {
    window.open(`mailto:?subject=Check out this product: ${productName}&body=I thought you might be interested in this: ${shareUrl}`);
  };
  
  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };
  
  const shareViaTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=Check out ${productName}&url=${encodeURIComponent(shareUrl)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Product</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="shareLink">Product Link</Label>
            <div className="flex gap-2">
              <Input 
                id="shareLink"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={copyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 pt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={shareViaEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200" 
              onClick={shareViaFacebook}
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-sky-50 text-sky-600 hover:bg-sky-100 border-sky-200" 
              onClick={shareViaTwitter}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProductDialog;
