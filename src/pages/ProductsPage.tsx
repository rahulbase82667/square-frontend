
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  QrCode, 
  Copy, 
  Trash2,
  Download
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toaster";
import PlatformBadge from "@/components/PlatformBadge";

// Mock data
const mockProducts = [
  {
    id: '1',
    name: 'Handmade Ceramic Mug',
    sku: 'MUG001',
    image: '/placeholder.svg',
    price: 24.99,
    inventory: 15,
    status: 'Active',
    platforms: ['etsy', 'facebook', 'square']
  },
  {
    id: '2',
    name: 'Vintage Style Wall Clock',
    sku: 'CLK002',
    image: '/placeholder.svg',
    price: 39.99,
    inventory: 8,
    status: 'Active',
    platforms: ['tiktok', 'square']
  },
  {
    id: '3',
    name: 'Organic Cotton T-shirt',
    sku: 'TSH003',
    image: '/placeholder.svg',
    price: 19.99,
    inventory: 32,
    status: 'Active',
    platforms: ['etsy', 'square', 'facebook']
  },
  {
    id: '4',
    name: 'Leather Wallet',
    sku: 'WAL004',
    image: '/placeholder.svg',
    price: 49.99,
    inventory: 12,
    status: 'Processing',
    platforms: ['tiktok', 'etsy']
  },
  {
    id: '5',
    name: 'Handcrafted Wooden Bowl',
    sku: 'BWL005',
    image: '/placeholder.svg',
    price: 34.99,
    inventory: 7,
    status: 'Active',
    platforms: ['etsy', 'square']
  },
  {
    id: '6',
    name: 'Macrame Plant Hanger',
    sku: 'PLT006',
    image: '/placeholder.svg',
    price: 18.99,
    inventory: 21,
    status: 'Draft',
    platforms: []
  },
  {
    id: '7',
    name: 'Hand-poured Scented Candle',
    sku: 'CND007',
    image: '/placeholder.svg',
    price: 16.99,
    inventory: 45,
    status: 'Active',
    platforms: ['etsy', 'facebook']
  }
];

const ProductsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState(mockProducts);
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product listings across all platforms.</p>
        </div>
        <Button asChild>
          <Link to="/upload" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" 
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              <span>Filters</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              <span>Export</span>
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Platforms</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
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
                            onClick={() => copyToClipboard(product.sku)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{product.inventory}</TableCell>
                      <TableCell>
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
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/products/${product.id}`} className="flex items-center gap-2">
                                <Edit2 className="h-4 w-4" />
                                <span>Edit Product</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => showQRCode(product.id)}>
                              <QrCode className="h-4 w-4 mr-2" />
                              <span>View QR Code</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete Product</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
