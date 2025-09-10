"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { Product, ProductsContextType } from "../types/Product";

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error("Couldn't fetch data" + `${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered: Product[] = [...products];
    if (search.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedType && selectedType !== "all") {
      filtered = filtered.filter(
        (product) => product.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    switch (sortBy) {
      case "high to low":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "low to high":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "relevant":
      default:
        filtered = [...filtered].sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 1;
        });
        break;
    }
    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, selectedType, search]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedType("");
    setSortBy("relevant");
    setSearch("");
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find((product) => product._id === id);
  };

  return (
    <ProductsContext.Provider
      value={{
        search,
        setSearch,
        products,
        filteredProducts,
        loading,
        selectedCategory,
        selectedType,
        sortBy,
        setSelectedCategory,
        setSelectedType,
        setSortBy,
        clearFilters,
        setSearchOpen,
        searchOpen,
        getProductById,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("Products Provider does not contain this context");
  }
  return context;
};
