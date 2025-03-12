
export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  inventory: number;
  status: string;
  platforms: string[];
  description?: string;
  category?: string;
  dateAdded?: string;
  lastUpdated?: string;
}
