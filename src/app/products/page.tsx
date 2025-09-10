"use client";

import ProductCard from "../component/ProductCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "../context/ProductContexts";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
  Package,
  TrendingUp,
  Star,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Products() {
  const {
    products,
    filteredProducts,
    loading,
    selectedCategory,
    selectedType,
    sortBy,
    search,
    setSearch,
    setSelectedCategory,
    setSelectedType,
    setSortBy,
    clearFilters,
  } = useProducts();

  const { itemCount, addToCart, totalPrice, loading: cartLoading } = useCart();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(search);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const router = useRouter();

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(localSearch);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [localSearch, setSearch]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleAddToCart = async (
    productId: string,
    color: string,
    size: string,
    quantity: number = 1
  ) => {
    try {
      await addToCart(productId, color, size, quantity);
    } catch (error) {
      console.error("Failed to add to cart: ", error);
    }
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  const handleClearAllFilters = () => {
    clearFilters();
    setLocalSearch("");
  };

  const activeFiltersCount = [
    selectedCategory !== "all" ? 1 : 0,
    selectedType !== "all" ? 1 : 0,
    search ? 1 : 0,
    sortBy !== "relevant" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const FilterSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
          FILTERS
        </h2>
        {activeFiltersCount > 0 && (
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0 shadow-sm"
          >
            {activeFiltersCount} active
          </Badge>
        )}
      </div>

      {/* Categories filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm sm:text-base flex items-center text-gray-700 dark:text-gray-300">
          <Grid className="w-4 h-4 mr-2 text-purple-500" />
          CATEGORIES
        </h3>
        <Select
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          <SelectTrigger className="w-full cursor-pointer text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl transition-all duration-300 shadow-lg">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl z-50">
            <SelectItem
              value="all"
              className="hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer rounded-lg transition-colors"
            >
              <div className="flex items-center text-gray-300">
                <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                All Categories
              </div>
            </SelectItem>
            <SelectItem
              value="men"
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer rounded-lg transition-colors text-gray-300"
            >
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-blue-500" />
                Men&apos;s Fashion
              </div>
            </SelectItem>
            <SelectItem
              value="women"
              className="hover:bg-pink-50 dark:hover:bg-pink-900/20 cursor-pointer rounded-lg transition-colors text-gray-300"
            >
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-pink-500" />
                Women&apos;s Fashion
              </div>
            </SelectItem>
            <SelectItem
              value="kids"
              className="hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer rounded-lg transition-colors text-gray-300"
            >
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-green-500" />
                Kids&apos; Fashion
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm sm:text-base flex items-center text-gray-700 dark:text-gray-300">
          <List className="w-4 h-4 mr-2 text-purple-500" />
          PRODUCT TYPE
        </h3>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="text-gray-300 cursor-pointer w-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl transition-all duration-300 shadow-lg">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl z-50">
            <SelectItem
              value="all"
              className="hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer rounded-lg transition-colors"
            >
              <div className="flex items-center text-gray-300">
                <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                All Types
              </div>
            </SelectItem>
            <SelectItem
              value="tops"
              className="hover:bg-orange-50 text-gray-300 dark:hover:bg-orange-900/20 cursor-pointer rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-orange-500" />
                Tops & Shirts
              </div>
            </SelectItem>
            <SelectItem
              value="bottoms"
              className="hover:bg-teal-50 text-gray-300 dark:hover:bg-teal-900/20 cursor-pointer rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-teal-500" />
                Bottoms & Pants
              </div>
            </SelectItem>
            <SelectItem
              value="outerwear"
              className="hover:bg-indigo-50 text-gray-300 dark:hover:bg-indigo-900/20 cursor-pointer rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Package className="w-4 h-4 mr-2 text-indigo-500" />
                Outerwear & Jackets
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center text-gray-700 dark:text-gray-300">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            ACTIVE FILTERS
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 transition-all duration-300 border-0 shadow-sm"
              >
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="ml-1 hover:text-blue-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedType !== "all" && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 hover:from-green-200 hover:to-green-300 transition-all duration-300 border-0 shadow-sm"
              >
                Type: {selectedType}
                <button
                  onClick={() => setSelectedType("all")}
                  className="ml-1 hover:text-green-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {search && (
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 hover:from-purple-200 hover:to-purple-300 transition-all duration-300 border-0 shadow-sm"
              >
                Search: &quot;{search}&quot;
                <button
                  onClick={() => setLocalSearch("")}
                  className="ml-1 hover:text-purple-900 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={handleClearAllFilters}
        className="w-full cursor-pointer bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
      >
        <X className="w-4 h-4 mr-2" />
        Clear All Filters
      </Button>

      {/* Cart Summary in Sidebar */}
      {itemCount > 0 && (
        <div className="p-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg">
          <h3 className="font-semibold mb-3 text-sm sm:text-base flex items-center text-gray-700 dark:text-gray-300">
            <ShoppingCart className="w-4 h-4 mr-2 text-purple-600" />
            Cart Summary
          </h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Items:</span>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0"
              >
                {itemCount}
              </Badge>
            </div>
            <div className="flex justify-between font-semibold text-base">
              <span className="text-gray-700 dark:text-gray-300">Total:</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
          <Button
            className="w-full mt-3 cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
            size="sm"
            onClick={() => {
              handleCartClick();
              setMobileFiltersOpen(false);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Cart
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-6">
            ALL PRODUCTS
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4" />
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover {filteredProducts.length} amazing products crafted with
            excellence and style
          </p>
        </div>

        {/* Action Bar */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                {/* View Toggle */}
                <div className="hidden sm:flex items-center bg-white/50 dark:bg-gray-700/50 rounded-xl p-1 border border-white/30 dark:border-gray-600/30 backdrop-blur-sm">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 cursor-pointer rounded-lg transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 cursor-pointer rounded-lg transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full cursor-pointer sm:w-48 bg-white/50 dark:bg-gray-700/50 border border-white/30 dark:border-gray-600/30 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-600 dark:text-gray-300 rounded-xl backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by: Relevant" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl z-50">
                    <SelectItem
                      value="relevant"
                      className="hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-center text-gray-300">
                        <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                        Most Relevant
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="high to low"
                      className="hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-center text-gray-300">
                        <TrendingUp className="w-4 h-4 mr-2 text-red-500" />
                        Price: High to Low
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="low to high"
                      className="hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-center text-gray-300">
                        <TrendingUp className="w-4 h-4 mr-2 text-green-500 transform rotate-180" />
                        Price: Low to High
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Cart Button */}
                <Button
                  variant="outline"
                  className="relative text-gray-300 w-full sm:w-auto cursor-pointer bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 border border-white/30 dark:border-gray-600/30 hover:border-purple-300 dark:hover:border-purple-500 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
                  onClick={handleCartClick}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {itemCount > 0 && (
                    <Badge className="ml-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md border-0">
                      {itemCount}
                    </Badge>
                  )}
                </Button>

                {/* Mobile Filter Button */}
                <Sheet
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto lg:hidden cursor-pointer bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 border border-white/30 dark:border-gray-600/30 hover:border-purple-300 dark:hover:border-purple-500 backdrop-blur-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl relative"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge className="ml-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] sm:w-[350px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/30"
                  >
                    <SheetHeader>
                      <SheetTitle className="flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-purple-600" />
                        Filters & Search
                      </SheetTitle>
                      <SheetDescription className="sr-only">
                        Product filters and search options
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSection />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl mb-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-2">
              Loading Products...
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Please wait while we fetch the latest products
            </p>
          </div>
        )}

        {/* No Products State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl shadow-xl mb-4">
              <Package className="text-white w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-2">
              No Products Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back soon for new arrivals!
            </p>
          </div>
        )}

        {/* Main content container */}
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Desktop Sidebar - Filters */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-8 rounded-3xl shadow-2xl">
                <FilterSection />
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* No Search Results */}
              {!loading && filteredProducts.length === 0 && search && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl mb-4">
                    <Search className="text-white w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-2">
                    No products found for &quot;{search}&quot;
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Try adjusting your search terms or filters to find what
                    you&apos;re looking for
                  </p>
                  <Button
                    onClick={handleClearAllFilters}
                    className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear all filters
                  </Button>
                </div>
              )}

              {/* Products Display */}
              {!loading && filteredProducts.length > 0 && (
                <>
                  <div
                    className={`grid gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {filteredProducts.map((product) => {
                      return (
                        <div
                          key={product._id}
                          className="transform hover:-translate-y-2 transition-all duration-300 hover:scale-105"
                        >
                          <ProductCard
                            product={product}
                            onAddToCart={handleAddToCart}
                            cartLoading={cartLoading}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Results Footer */}
                  <div className="text-center mt-16 mb-8">
                    <div className="inline-flex items-center space-x-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20 dark:border-gray-700/30 shadow-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Showing{" "}
                          <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {filteredProducts.length}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {products.length}
                          </span>{" "}
                          products
                        </span>
                      </div>
                      {activeFiltersCount > 0 && (
                        <>
                          <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0 shadow-sm"
                          >
                            {activeFiltersCount} filter
                            {activeFiltersCount > 1 ? "s" : ""} active
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
