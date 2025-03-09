
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, QrCode, Share2, Download, Edit, Trash } from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import PlatformBadge from "@/components/PlatformBadge";

// Mock product data (in a real app this would come from an API)
const mockProductData = {
  id: '1',
  name: 'Handmade Ceramic Mug',
  sku: 'MUG001',
  images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  price: 24.99,
  inventory: 15,
  status: 'Active',
  platforms: ['etsy', 'facebook', 'square'],
  description: `This handcrafted ceramic mug is perfect for your morning coffee or tea. Each piece is uniquely made with high-quality clay and glazed to perfection. The ergonomic handle makes it comfortable to hold.

Features:
- Handmade ceramic construction
- 12oz capacity
- Microwave and dishwasher safe
- Available in multiple colors

This handcrafted item features unique designs that capture attention. Perfect for gifts and personal use, it combines style and functionality. Made with high-quality materials ensuring durability and satisfaction. #HandmadeGifts #UniqueDesigns #QualityCrafts`,
  category: 'Home & Kitchen',
  dateAdded: '2023-11-15',
  lastUpdated: '2023-12-02'
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product] = useState(mockProductData);
  
  const handleDownloadQR = () => {
    toast({
      title: "QR Code Downloaded",
      description: "The QR code has been saved to your downloads folder."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            <Badge 
              variant="outline"
              className={
                product.status === "Active" 
                  ? "bg-green-100 text-green-800 hover:bg-green-100" 
                  : product.status === "Draft"
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }
            >
              {product.status}
            </Badge>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 gap-2">
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2 space-y-4">
                  <div className="aspect-square overflow-hidden rounded-md border">
                    <img 
                      src={product.images[currentImageIndex]} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    {product.images.map((img, idx) => (
                      <button 
                        key={idx}
                        className={`h-16 w-16 overflow-hidden rounded border ${
                          idx === currentImageIndex ? 'ring-2 ring-brand-blue ring-offset-2' : ''
                        }`}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img 
                          src={img} 
                          alt={`Product thumbnail ${idx + 1}`} 
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-1/2 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-xl font-bold mt-1">${product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Category</h3>
                    <p className="text-muted-foreground">{product.category}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Inventory</h3>
                    <p className="text-muted-foreground">{product.inventory} units available</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Listed on</h3>
                    <div className="flex gap-2">
                      {product.platforms.map((platform, idx) => (
                        <PlatformBadge key={idx} platformId={platform} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Added</h3>
                    <p className="text-muted-foreground">{product.dateAdded}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Last Updated</h3>
                    <p className="text-muted-foreground">{product.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
              <CardDescription>Optimized for search engines and marketplaces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {product.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Use this for inventory tracking</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="border bg-white rounded-lg p-4 mb-4">
                <QrCode className="h-32 w-32 text-black" />
              </div>
              <Button onClick={handleDownloadQR} className="gap-2">
                <Download className="h-4 w-4" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>Recent actions on this product</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="activity">
                <TabsList className="mb-4">
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <div className="p-2 bg-green-100 rounded-full">
                        <PlatformBadge platformId="etsy" />
                      </div>
                      <div>
                        <p className="font-medium">Listed on Etsy</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <PlatformBadge platformId="facebook" />
                      </div>
                      <div>
                        <p className="font-medium">Listed on Facebook</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <PlatformBadge platformId="square" />
                      </div>
                      <div>
                        <p className="font-medium">Listed on Square</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="analytics">
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">
                      Analytics data is still being collected for this product.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
