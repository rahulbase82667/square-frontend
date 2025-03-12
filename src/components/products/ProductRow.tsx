
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import PlatformBadge from "@/components/PlatformBadge";
import StatusBadge from "./StatusBadge";
import ProductTableActions from "./ProductTableActions";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  inventory: number;
  status: string;
  platforms: string[];
}

interface ProductRowProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const ProductRow = ({ product, onSelect }: ProductRowProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The product SKU has been copied to your clipboard.",
    });
  };

  return (
    <TableRow 
      key={product.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onSelect(product)}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 rounded-md">
            <AvatarImage src={product.image} alt={product.name} />
            <AvatarFallback className="rounded-md bg-brand-lightBlue text-brand-blue">
              {product.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{product.name}</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span>{product.sku}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(product.sku);
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
      <TableCell className="text-right">{product.inventory}</TableCell>
      <TableCell>
        <StatusBadge status={product.status} />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          {product.platforms.slice(0, 3).map((platform, idx) => (
            <PlatformBadge key={idx} platformId={platform} />
          ))}
          {product.platforms.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{product.platforms.length - 3}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        <ProductTableActions productId={product.id} sku={product.sku} />
      </TableCell>
    </TableRow>
  );
};

export default ProductRow;
