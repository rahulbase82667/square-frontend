
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, HelpCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold hidden md:block">EasyHub</h1>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <HelpCircle size={20} className="text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell size={20} className="text-gray-500" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
