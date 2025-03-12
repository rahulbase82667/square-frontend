
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge 
      variant="outline"
      className={
        status === "Active" 
          ? "bg-green-100 text-green-800 hover:bg-green-100" 
          : status === "Draft"
            ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      }
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
