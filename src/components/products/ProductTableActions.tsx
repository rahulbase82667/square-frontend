
import { useToast } from "@/hooks/use-toast";
import { Copy, Edit2, QrCode, Trash2, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import axios from 'axios';

interface ProductTableActionsProps {
  productId: string;
  sku: string;
}

const ProductTableActions = ({ productId, sku }: ProductTableActionsProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The product SKU has been copied to your clipboard.",
    });
  };

  const showQRCode = (productId: string) => {
    toast({
      title: "QR Code",
      description: "QR code displayed for product: " + productId,
    });
  };

 

const deleteProduct = async (productId: string) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await axios.delete(`https://backend-square.onrender.com/api/catalog/object/${productId}`);

    if (response.data.success) {
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
      });
    } else {
      toast({
        title: "Error",
        description: response.data.message || "Failed to delete product.",
      });
    }
  } catch (error) {
    const errorMessage = error.response?.data?.errors?.[0]?.detail ||
                         error.response?.data?.message ||
                         "An unexpected error occurred.";

    console.error("Error deleting product:", error.response?.data || error.message);

    toast({
      title: "Error",
      description: errorMessage,
    });
  }
};



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`/products/${productId}`} className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            <span>Edit Product</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => showQRCode(productId)}>
          <QrCode className="h-4 w-4 mr-2" />
          <span>View QR Code</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => deleteProduct(productId)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span>Delete Product</span>
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductTableActions;
