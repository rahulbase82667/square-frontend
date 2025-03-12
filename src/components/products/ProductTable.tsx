
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import ProductRow from "./ProductRow";

interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  inventory: number;
  status: string;
  platforms: string[];
}

interface ProductTableProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const ProductTable = ({ products, onSelectProduct }: ProductTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Inventory</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Platforms</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <ProductRow 
                key={product.id} 
                product={product} 
                onSelect={onSelectProduct} 
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductTable;
