
import { AlertCircle } from "lucide-react";

interface IntegrationStatusBannerProps {
  isLoading: boolean;
}

const IntegrationStatusBanner = ({ isLoading }: IntegrationStatusBannerProps) => {
  if (!isLoading) return null;
  
  return (
    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
      <p className="text-blue-700 text-sm">Verifying connection status with platforms...</p>
    </div>
  );
};

export default IntegrationStatusBanner;
