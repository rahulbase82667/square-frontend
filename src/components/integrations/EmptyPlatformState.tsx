
import { AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyPlatformStateProps {
  type: 'connected' | 'not_connected';
  onActionClick: () => void;
}

const EmptyPlatformState = ({ type, onActionClick }: EmptyPlatformStateProps) => {
  const isConnected = type === 'connected';
  
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      {isConnected ? (
        <Check className="h-12 w-12 text-green-500 mb-4" />
      ) : (
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      )}
      
      <h3 className="text-lg font-medium">
        {isConnected ? 'All Platforms Connected' : 'No Connected Platforms'}
      </h3>
      
      <p className="text-muted-foreground mt-2 max-w-md">
        {isConnected 
          ? "You've connected all available platforms. Great job!"
          : "You haven't connected any platforms yet. Connect a platform to start listing your products."
        }
      </p>
      
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onActionClick}
      >
        {isConnected ? 'View Connected Platforms' : 'View Available Platforms'}
      </Button>
    </div>
  );
};

export default EmptyPlatformState;
