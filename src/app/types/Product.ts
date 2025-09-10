export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  type: string;
  sizes: string[];
  colors: string[];
  images: string[];
  isFeatured: boolean;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (
    productId: string,
    color: string,
    size: string,
    quantity?: number
  ) => Promise<void>;
  cartLoading?: boolean;
}

export type ProductsContextType = {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  selectedCategory: string;
  selectedType: string;
  sortBy: string;
  searchOpen: boolean;
  search: string;
  setSearch: (search: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedType: (type: string) => void;
  setSortBy: (sort: string) => void;
  setSearchOpen: (open: boolean) => void;
  clearFilters: () => void;
  getProductById: (id: string) => Product | undefined;
};
