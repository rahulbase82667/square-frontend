
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Upload, X, Plus, Sparkles, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import IntegrationPlatformSelector from "@/components/IntegrationPlatformSelector";
import ImageUploader from "@/components/ImageUploader";

const ProductUpload = () => {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const handleOptimizeDescription = () => {
    setIsOptimizing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setDescription(prev => 
        prev + "\n\nThis handcrafted item features unique designs that capture attention. Perfect for gifts and personal use, it combines style and functionality. Made with high-quality materials ensuring durability and satisfaction. #HandmadeGifts #UniqueDesigns #QualityCrafts"
      );
      setIsOptimizing(false);
      
      toast({
        title: "Description Optimized",
        description: "AI has enhanced your description for better search visibility.",
      });
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Product Submitted",
      description: "Your product is being processed and will be distributed to selected platforms.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload New Product</h1>
        <p className="text-muted-foreground">Fill in the details to add a new product.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Basic details about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="Enter product name" required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU/Item Number</Label>
                    <Input id="sku" placeholder="Unique identifier" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" min="0" step="0.01" placeholder="0.00" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="home">Home & Living</SelectItem>
                        <SelectItem value="art">Art & Collectibles</SelectItem>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Available</Label>
                    <Input id="quantity" type="number" min="0" placeholder="0" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description">Product Description</Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleOptimizeDescription}
                      disabled={isOptimizing}
                      className="flex items-center gap-1"
                    >
                      {isOptimizing ? (
                        "Optimizing..."
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Optimize with AI</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your product in detail" 
                    className="min-h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    AI optimization enhances your description for better SEO and marketplace visibility.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Add multiple high-quality images of your product</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution</CardTitle>
                <CardDescription>Select platforms to list your product</CardDescription>
              </CardHeader>
              <CardContent>
                <IntegrationPlatformSelector 
                  selectedPlatforms={selectedPlatforms}
                  setSelectedPlatforms={setSelectedPlatforms}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Will be generated automatically</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-lg h-32 w-32 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground text-center px-4">
                    QR code will appear here after submission
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  A unique QR code is generated for each product for easy tracking and customer access
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Submit Product</Button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;
