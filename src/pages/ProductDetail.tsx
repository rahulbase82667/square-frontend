import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Edit, Trash } from "lucide-react";
import { formatGBP, formatUSD } from "@/utils/currencyUtils";
import StatusBadge from "@/components/products/StatusBadge";
import PlatformBadge from "@/components/PlatformBadge";
import { Product } from "@/types/product";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://backend-square.onrender.com/api/product/${id}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          throw new Error(data.message || "Failed to fetch product");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const createPaymentLink = async () => {
    if (!product) return;
  
    try {
      const payload = {
        productName: product.name,
        price: product.price, // Amount in decimal format (e.g., 25.99)
        currency: "GBP"
      };
  
      const response = await axios.post("https://backend-square.onrender.com/api/create-payment-link", payload);
  
      const { paymentLink } = response.data;
      
      setPaymentLink(paymentLink);
    } catch (err: any) {
      console.error("Error creating payment link:", err);
      alert("Failed to create payment link");
    }
  };

  if (loading) return <div className="text-center">Loading product...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div className="text-center">Product not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            <StatusBadge status={product.status} />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={createPaymentLink}>
            Generate Payment Link
          </Button>
          {paymentLink && (
            <Button variant="outline" onClick={() => window.open(paymentLink, "_blank")}>
              Open Payment Link
            </Button>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Image */}
          <div className="border rounded-md overflow-hidden">
            <img
              src={product.images?.[currentImageIndex] || product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-16 w-16 rounded border ${
                  idx === currentImageIndex ? "ring-2 ring-brand-blue" : ""
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* QR Code */}
          {paymentLink ? (
  <QRCodeCanvas value={paymentLink} size={150} />
) : paymentLink === "" ? (
  <div className="text-sm text-red-500">Failed to generate QR code</div>
) : null}





          {/* Product Info */}
          <div>
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-xl font-bold">
              {formatGBP(product.price)}{" "}
              <span className="text-sm text-muted-foreground">
                ({formatUSD(product.usdPrice || product.price * 1.27)})
              </span>
            </p>
            <p className="text-muted-foreground mt-2">{product.description}</p>
            <p className="text-muted-foreground mt-2">Category: {product.category}</p>
          </div>

          {/* Status */}
          <StatusBadge status={product.status} />

          {/* Platforms */}
          <div className="mt-4">
            <p className="font-medium">Available on:</p>
            <div className="flex gap-2">
              {product.platforms.map((platform, idx) => (
                <PlatformBadge key={idx} platformId={platform} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ArrowLeft, QrCode, Share2, Download, Edit, Trash } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import PlatformBadge from "@/components/PlatformBadge";
// import StatusBadge from "@/components/products/StatusBadge";
// import { formatGBP, formatUSD } from "@/utils/currencyUtils";
// import ProductEditDialog from "@/components/products/ProductEditDialog";
// import DeleteProductDialog from "@/components/products/DeleteProductDialog";
// import ShareProductDialog from "@/components/products/ShareProductDialog";
// import { Product } from "@/types/product";

// // Mock product data for initial implementation
// const mockProductData: Product = {
//   id: '1',
//   name: 'Handmade Ceramic Mug',
//   sku: 'MUG001',
//   image: '/placeholder.svg',
//   images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
//   price: 24.99,
//   usdPrice: 31.99,
//   inventory: 15,
//   status: 'Active',
//   platforms: ['etsy', 'facebook', 'square'],
//   description: `This handcrafted ceramic mug is perfect for your morning coffee or tea. Each piece is uniquely made with high-quality clay and glazed to perfection. The ergonomic handle makes it comfortable to hold.

// Features:
// - Handmade ceramic construction
// - 12oz capacity
// - Microwave and dishwasher safe
// - Available in multiple colors

// This handcrafted item features unique designs that capture attention. Perfect for gifts and personal use, it combines style and functionality. Made with high-quality materials ensuring durability and satisfaction.`,
//   category: 'Home & Kitchen',
//   dateAdded: '2023-11-15',
//   lastUpdated: '2023-12-02'
// };

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   // In a real application, you would fetch product data based on the ID
//   const [product, setProduct] = useState<Product>(mockProductData);
  
//   // Dialog state
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
//   const handleDownloadQR = () => {
//     // In a real app, this would generate and download a QR code
//     // For now we'll just show a toast
//     toast({
//       title: "QR Code Downloaded",
//       description: "The QR code has been saved to your downloads folder."
//     });
//   };

//   const handleProductUpdate = (updatedProduct: Product) => {
//     // Update the product state with the new data
//     setProduct(updatedProduct);
    
//     // In a real app, you would send this data to your API
//     // For now, we'll just update the local state
//   };

//   const handleShareClick = () => {
//     setShareDialogOpen(true);
//   };

//   const handleEditClick = () => {
//     setEditDialogOpen(true);
//   };

//   const handleDeleteClick = () => {
//     setDeleteDialogOpen(true);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button 
//           variant="ghost" 
//           size="icon" 
//           onClick={() => navigate(-1)}
//         >
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
//         <div>
//           <h1 className="text-2xl font-bold">{product.name}</h1>
//           <div className="flex items-center gap-2">
//             <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
//             <StatusBadge status={product.status} />
//           </div>
//         </div>
//         <div className="ml-auto flex items-center gap-2">
//           <Button 
//             variant="outline" 
//             className="gap-2"
//             onClick={handleShareClick}
//           >
//             <Share2 className="h-4 w-4" />
//             Share
//           </Button>
//           <Button 
//             variant="outline" 
//             className="gap-2"
//             onClick={handleEditClick}
//           >
//             <Edit className="h-4 w-4" />
//             Edit
//           </Button>
//           <Button 
//             variant="outline" 
//             className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
//             onClick={handleDeleteClick}
//           >
//             <Trash className="h-4 w-4" />
//             Delete
//           </Button>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex flex-col md:flex-row gap-6">
//                 <div className="md:w-1/2 space-y-4">
//                   <div className="aspect-square overflow-hidden rounded-md border">
//                     <img 
//                       src={product.images?.[currentImageIndex] || product.image} 
//                       alt={product.name} 
//                       className="h-full w-full object-cover"
//                     />
//                   </div>
//                   <div className="flex gap-2">
//                     {product.images?.map((img, idx) => (
//                       <button 
//                         key={idx}
//                         className={`h-16 w-16 overflow-hidden rounded border ${
//                           idx === currentImageIndex ? 'ring-2 ring-brand-blue ring-offset-2' : ''
//                         }`}
//                         onClick={() => setCurrentImageIndex(idx)}
//                       >
//                         <img 
//                           src={img} 
//                           alt={`Product thumbnail ${idx + 1}`} 
//                           className="h-full w-full object-cover"
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="md:w-1/2 space-y-4">
//                   <div>
//                     <h2 className="text-lg font-semibold">{product.name}</h2>
//                     <p className="text-xl font-bold mt-1">
//                       {formatGBP(product.price)}
//                       <span className="text-sm text-muted-foreground ml-2">
//                         ({formatUSD(product.usdPrice || product.price * 1.27)})
//                       </span>
//                     </p>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h3 className="font-medium">Category</h3>
//                     <p className="text-muted-foreground">{product.category}</p>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h3 className="font-medium">Inventory</h3>
//                     <p className="text-muted-foreground">{product.inventory} units available</p>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h3 className="font-medium">Listed on</h3>
//                     <div className="flex gap-2">
//                       {product.platforms.map((platform, idx) => (
//                         <PlatformBadge key={idx} platformId={platform} />
//                       ))}
//                     </div>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h3 className="font-medium">Added</h3>
//                     <p className="text-muted-foreground">{product.dateAdded}</p>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <h3 className="font-medium">Last Updated</h3>
//                     <p className="text-muted-foreground">{product.lastUpdated}</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle>Product Description</CardTitle>
//               <CardDescription>Optimized for search engines and marketplaces</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="prose max-w-none">
//                 {product.description?.split('\n\n').map((paragraph, idx) => (
//                   <p key={idx} className="mb-4">{paragraph}</p>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
        
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>QR Code</CardTitle>
//               <CardDescription>Use this for inventory tracking</CardDescription>
//             </CardHeader>
//             <CardContent className="flex flex-col items-center justify-center py-6">
//               <div className="border bg-white rounded-lg p-4 mb-4">
//                 <QrCode className="h-32 w-32 text-black" />
//               </div>
//               <Button onClick={handleDownloadQR} className="gap-2">
//                 <Download className="h-4 w-4" />
//                 Download QR Code
//               </Button>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardHeader>
//               <CardTitle>Platform Activity</CardTitle>
//               <CardDescription>Recent actions on this product</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Tabs defaultValue="activity">
//                 <TabsList className="mb-4">
//                   <TabsTrigger value="activity">Activity</TabsTrigger>
//                   <TabsTrigger value="analytics">Analytics</TabsTrigger>
//                 </TabsList>
//                 <TabsContent value="activity" className="space-y-4">
//                   <div className="flex flex-col gap-3">
//                     <div className="flex items-center gap-3 p-3 border rounded-md">
//                       <div className="p-2 bg-green-100 rounded-full">
//                         <PlatformBadge platformId="etsy" />
//                       </div>
//                       <div>
//                         <p className="font-medium">Listed on Etsy</p>
//                         <p className="text-xs text-muted-foreground">2 days ago</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3 p-3 border rounded-md">
//                       <div className="p-2 bg-blue-100 rounded-full">
//                         <PlatformBadge platformId="facebook" />
//                       </div>
//                       <div>
//                         <p className="font-medium">Listed on Facebook</p>
//                         <p className="text-xs text-muted-foreground">2 days ago</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-3 p-3 border rounded-md">
//                       <div className="p-2 bg-purple-100 rounded-full">
//                         <PlatformBadge platformId="square" />
//                       </div>
//                       <div>
//                         <p className="font-medium">Listed on Square</p>
//                         <p className="text-xs text-muted-foreground">2 days ago</p>
//                       </div>
//                     </div>
//                   </div>
//                 </TabsContent>
//                 <TabsContent value="analytics">
//                   <div className="flex flex-col items-center justify-center py-12 text-center">
//                     <p className="text-muted-foreground">
//                       Analytics data is still being collected for this product.
//                     </p>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
      
//       {/* Dialogs */}
//       <ProductEditDialog 
//         open={editDialogOpen}
//         onOpenChange={setEditDialogOpen}
//         product={product}
//         onSave={handleProductUpdate}
//       />
      
//       <DeleteProductDialog 
//         open={deleteDialogOpen}
//         onOpenChange={setDeleteDialogOpen}
//         productId={product.id}
//         productName={product.name}
//       />
      
//       <ShareProductDialog 
//         open={shareDialogOpen}
//         onOpenChange={setShareDialogOpen}
//         productId={product.id}
//         productName={product.name}
//       />
//     </div>
//   );
// };

// export default ProductDetail;

