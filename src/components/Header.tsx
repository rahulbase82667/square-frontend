
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, HelpCircle, LogOut } from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { signOut } = useClerk();
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(() => {
      navigate("/login");
    });
  };

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold hidden md:block">Reginald</h1>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <HelpCircle size={20} className="text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell size={20} className="text-gray-500" />
        </Button>
        
        {isSignedIn ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut size={20} className="text-gray-500" />
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => navigate("/login")}>Sign In</Button>
        )}
      </div>
    </header>
  );
};

export default Header;
