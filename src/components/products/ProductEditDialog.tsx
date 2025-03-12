
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import StatusSelector from "./StatusSelector";

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSave: (updatedProduct: Product) => void;
}

const ProductEditDialog = ({ open, onOpenChange, product, onSave }: ProductEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Product>({ ...product });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({ ...prev, status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the product with the new data
    onSave(formData);
    
    // Close the dialog
    onOpenChange(false);
    
    // Show success toast
    toast({
      title: "Product Updated",
      description: "Your product has been successfully updated.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleNumberChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input 
                  id="inventory" 
                  name="inventory" 
                  type="number" 
                  min="0" 
                  value={formData.inventory} 
                  onChange={handleNumberChange} 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <StatusSelector 
                  currentStatus={formData.status} 
                  onStatusChange={handleStatusChange} 
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description || ''} 
                onChange={handleChange} 
                className="min-h-[100px]" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
