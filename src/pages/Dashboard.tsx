
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, ArrowUpRight, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import RecentProductsList from "@/components/RecentProductsList";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your product dashboard.</p>
        </div>
        <Button asChild>
          <Link to="/upload" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Upload Product</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">36</div>
              <div className="p-2 bg-green-100 rounded-full">
                <Package className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <ArrowUpRight className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">4</div>
              <div className="p-2 bg-blue-100 rounded-full">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Recently uploaded or modified products</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentProductsList />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>Recent activity across your integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Activity indicators */}
              <div className="flex items-center gap-4 p-3 border rounded-md">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Etsy</p>
                  <p className="text-sm text-muted-foreground">Product "Summer T-shirt" is selling well</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">2h ago</div>
              </div>
              
              <div className="flex items-center gap-4 p-3 border rounded-md">
                <div className="p-2 bg-blue-100 rounded-full">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">TikTok Shop</p>
                  <p className="text-sm text-muted-foreground">3 new orders for "Vintage Earrings"</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">5h ago</div>
              </div>
              
              <div className="flex items-center gap-4 p-3 border rounded-md">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Square</p>
                  <p className="text-sm text-muted-foreground">Inventory update completed</p>
                </div>
                <div className="ml-auto text-xs text-muted-foreground">Yesterday</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
