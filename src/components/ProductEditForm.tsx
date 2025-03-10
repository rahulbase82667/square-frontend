import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import IntegrationPlatformSelector from "@/components/IntegrationPlatformSelector";
import ImageUploader from "@/components/ImageUploader";
import { getGBPToUSDRate, formatGBP, formatUSD } from "@/utils/currencyUtils";

interface ProductData {
  id: string;
  name: string;
  sku: string;
  price: number;
  usdPrice?: number;
  inventory: number;
  status: string;
  platforms: string[];
  description: string;
  category: string;
  images: string[];
}

interface ProductEditFormProps {
  product: ProductData;
  onSave: (updatedProduct: ProductData) => void;
  onCancel: () => void;
}

const ProductEditForm = ({ product, onSave, onCancel }: ProductEditFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [priceGBP, setPriceGBP] = useState(product.price.toString());
  const [priceUSD, setPriceUSD] = useState("0");
  const [inventory, setInventory] = useState(product.inventory.toString());
  const [status, setStatus] = useState(product.status);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(product.platforms);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [images] = useState(product.images);

  useEffect(() => {
    const updateUSDPrice = async () => {
      const rate = await getGBPToUSDRate();
      const gbpAmount = parseFloat(priceGBP) || 0;
      const usdAmount = gbpAmount * rate;
      setPriceUSD(usdAmount.toFixed(2));
    };
    
    updateUSDPrice();
  }, [priceGBP]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !sku || !priceGBP || !category) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform to list on",
        variant: "destructive",
      });
      return;
    }
    
    const updatedProduct: ProductData = {
      ...product,
      name,
      sku,
      price: parseFloat(priceGBP),
      usdPrice: parseFloat(priceUSD),
      inventory: parseInt(inventory),
      status,
      platforms: selectedPlatforms,
      description,
      category,
      images,
    };
    
    onSave(updatedProduct);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Handmade Ceramic Mug"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  value={sku} 
                  onChange={(e) => setSku(e.target.value)} 
                  placeholder="e.g. MUG001"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price (GBP)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">£</span>
                  </div>
                  <Input 
                    id="price" 
                    type="number" 
                    value={priceGBP} 
                    onChange={(e) => setPriceGBP(e.target.value)} 
                    className="pl-7" 
                    min="0" 
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  USD: {formatUSD(parseFloat(priceUSD))}
                </p>
              </div>
              
              <div>
                <Label htmlFor="inventory">Inventory</Label>
                <Input 
                  id="inventory" 
                  type="number" 
                  value={inventory} 
                  onChange={(e) => setInventory(e.target.value)} 
                  min="0" 
                  step="1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home & Kitchen">Home & Kitchen</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Art & Collectibles">Art & Collectibles</SelectItem>
                    <SelectItem value="Craft Supplies">Craft Supplies</SelectItem>
                    <SelectItem value="Toys & Games">Toys & Games</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Product Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Describe your product in detail"
                  className="min-h-[200px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Platforms</Label>
                <IntegrationPlatformSelector
                  selectedPlatforms={selectedPlatforms}
                  setSelectedPlatforms={setSelectedPlatforms}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <Label>Product Images</Label>
          <div className="mt-2">
            <ImageUploader />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProductEditForm;
