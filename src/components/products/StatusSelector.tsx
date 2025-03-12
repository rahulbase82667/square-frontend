
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface StatusSelectorProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

const StatusSelector = ({ currentStatus, onStatusChange }: StatusSelectorProps) => {
  return (
    <Select defaultValue={currentStatus} onValueChange={onStatusChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Active">Active</SelectItem>
        <SelectItem value="Inactive">Inactive</SelectItem>
        <SelectItem value="Draft">Draft</SelectItem>
        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelector;
