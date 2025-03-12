
import { Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchAndFilterBar = ({ searchTerm, setSearchTerm }: SearchAndFilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10" 
        />
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        <Filter size={16} />
        <span>Filters</span>
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Download size={16} />
        <span>Export</span>
      </Button>
    </div>
  );
};

export default SearchAndFilterBar;
