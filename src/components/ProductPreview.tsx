
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PlatformBadge from "@/components/PlatformBadge";
import { Product } from "@/types/product";
import StatusBadge from "@/components/products/StatusBadge";

interface ProductPreviewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductPreview = ({ product, isOpen, onClose }: ProductPreviewProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="aspect-square overflow-hidden rounded-lg border">
              <Avatar className="h-full w-full rounded-lg">
                <AvatarImage src={product.image} alt={product.name} className="object-cover" />
                <AvatarFallback className="text-4xl">
                  {product.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground">SKU: {product.sku}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <StatusBadge status={product.status} />
            </div>
            
            <div>
              <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{product.inventory} units in stock</p>
            </div>
            
            <div>
              <p className="font-medium mb-2">Listed on</p>
              <div className="flex flex-wrap gap-2">
                {product.platforms.map((platform, idx) => (
                  <PlatformBadge key={idx} platformId={platform} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreview;
