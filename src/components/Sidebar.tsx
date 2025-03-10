
import { 
  Sidebar as ShadcnSidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader 
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Upload, Share2, Package } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { title: "Dashboard", path: "/", icon: LayoutDashboard },
    { title: "Upload Product", path: "/upload", icon: Upload },
    { title: "Integrations", path: "/integrations", icon: Share2 },
    { title: "Products", path: "/products", icon: Package },
  ];

  return (
    <ShadcnSidebar className="border-r border-border">
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="bg-brand-blue text-white p-1 rounded">
            <Share2 size={20} />
          </div>
          <span className="font-bold text-xl">Reginald</span>
        </div>
        <SidebarTrigger className="ml-auto md:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className={isActive(item.path) ? "bg-brand-gray text-brand-blue font-medium" : ""}>
                <Link to={item.path} className="flex items-center gap-3 px-3 py-2">
                  <item.icon size={20} className={isActive(item.path) ? "text-brand-blue" : "text-gray-500"} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
