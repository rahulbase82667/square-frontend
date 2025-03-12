
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
}

const DeleteProductDialog = ({ 
  open, 
  onOpenChange, 
  productId,
  productName
}: DeleteProductDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = () => {
    // In a real app, you would delete the product from your API here
    // For now, we'll just show a toast and navigate back to products
    
    toast({
      title: "Product Deleted",
      description: `${productName} has been successfully deleted.`,
    });
    
    navigate("/products");
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the product "{productName}". 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductDialog;
