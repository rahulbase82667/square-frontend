
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// Mock data
const recentProducts = [
  {
    id: '1',
    name: 'Handmade Ceramic Mug',
    image: '/placeholder.svg',
    timestamp: '1h ago',
    status: 'Active',
    platforms: ['Etsy', 'Facebook']
  },
  {
    id: '2',
    name: 'Vintage Style Wall Clock',
    image: '/placeholder.svg',
    timestamp: '3h ago',
    status: 'Processing',
    platforms: ['TikTok', 'Square']
  },
  {
    id: '3',
    name: 'Organic Cotton T-shirt',
    image: '/placeholder.svg',
    timestamp: 'Yesterday',
    status: 'Active',
    platforms: ['Etsy', 'Square', 'Facebook']
  },
  {
    id: '4',
    name: 'Leather Wallet',
    image: '/placeholder.svg',
    timestamp: '2 days ago',
    status: 'Active',
    platforms: ['TikTok', 'Etsy']
  }
];

const RecentProductsList = () => {
  return (
    <div className="space-y-4">
      {recentProducts.map(product => (
        <Link 
          to={`/products/${product.id}`} 
          key={product.id}
          className="flex items-center gap-4 p-3 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarImage src={product.image} alt={product.name} />
            <AvatarFallback className="rounded-md bg-brand-lightBlue text-brand-blue">
              {product.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{product.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant={product.status === "Active" ? "default" : "secondary"}
                className={`text-xs ${product.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
              >
                {product.status}
              </Badge>
              <span className="text-xs text-muted-foreground">{product.timestamp}</span>
            </div>
          </div>
          
          <div className="flex gap-1">
            {product.platforms.slice(0, 2).map((platform, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
            {product.platforms.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{product.platforms.length - 2}
              </Badge>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentProductsList;
