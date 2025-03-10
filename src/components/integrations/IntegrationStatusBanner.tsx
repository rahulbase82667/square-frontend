
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface IntegrationStatusBannerProps {
  isLoading: boolean;
  error?: string;
  success?: boolean;
}

const IntegrationStatusBanner = ({ isLoading, error, success }: IntegrationStatusBannerProps) => {
  if (!isLoading && !error && !success) return null;
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4 flex items-center">
        <XCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-4 flex items-center">
        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
        <p className="text-green-700 text-sm">Successfully connected to platforms.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4 flex items-center">
      <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
      <p className="text-blue-700 text-sm">Verifying connection status with platforms...</p>
    </div>
  );
};

export default IntegrationStatusBanner;
