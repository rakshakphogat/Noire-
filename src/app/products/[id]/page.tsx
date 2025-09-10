"use client";

import { useCart } from "@/app/context/CartContext";
import { useProducts } from "@/app/context/ProductContexts";
import { Product } from "@/app/types/Product";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { formatPrice } from "@/lib/utils";
import {
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Truck,
  ArrowLeft,
  Star,
  Shield,
  RotateCcw,
  Award,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { getProductById, loading: productsLoading } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!productsLoading) {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedImage(foundProduct.images[0]);
        if (foundProduct.sizes.length > 0)
          setSelectedSize(foundProduct.sizes[0]);
        if (foundProduct.colors.length > 0)
          setSelectedColor(foundProduct.colors[0]);
        setError(null);
      } else {
        setError("Product not found");
      }
      setLoading(false);
    }
  }, [productId, productsLoading, getProductById]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    try {
      await addToCart(product._id, selectedColor, selectedSize, quantity);
    } catch (error) {
      console.error("Failed to add to cart", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl mb-4">
            <LoadingSpinner size="lg" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-2">
            Loading Product...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we fetch the product details
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-xl mb-4">
            <ShoppingCart className="text-white w-8 h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-2">
            Product Not Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The product you&apos;re looking for doesn&apos;t exist
          </p>
          <Button
            onClick={handleGoBack}
            className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            className="cursor-pointer bg-white/70 text-gray-200 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 border border-white/20 dark:border-gray-700/30 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>

        {/* Main Product Container */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={selectedImage}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.isFeatured && (
                  <div className="absolute top-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
                    <Star className="w-3 h-3 inline mr-1" />
                    FEATURED
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square overflow-hidden rounded-xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                        selectedImage === image
                          ? "border-purple-500 shadow-lg ring-2 ring-purple-500/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Badge className="capitalize bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 shadow-sm">
                    {product.category}
                  </Badge>
                  <span>•</span>
                  <Badge className="capitalize bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-0 shadow-sm">
                    {product.type}
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                    <span className="mr-3">Size</span>
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-sm" />
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 cursor-pointer rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
                          selectedSize === size
                            ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 shadow-lg ring-2 ring-purple-500/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                    <span className="mr-3">Color</span>
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full shadow-sm" />
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-6 py-3 border-2 cursor-pointer rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg capitalize ${
                          selectedColor === color
                            ? "border-pink-500 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 text-pink-700 dark:text-pink-300 shadow-lg ring-2 ring-pink-500/20"
                            : "border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-400 text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-4">
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white flex items-center">
                  <span className="mr-3">Quantity</span>
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-sm" />
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-4 border-2 cursor-pointer text-gray-300 border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-20 text-center font-bold text-2xl bg-gradient-to-r from-gray-900 to-purple-600 dark:from-white dark:to-purple-300 bg-clip-text text-transparent">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 border-2 text-gray-300 cursor-pointer border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-8 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding to Cart...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <div className="flex space-x-4">
                  <button className="flex-1 cursor-pointer border-2 border-gray-300 dark:border-gray-600 py-4 px-6 rounded-xl text-gray-700 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-500 flex items-center justify-center space-x-2 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                    <Share2 className="w-5 h-5" />
                    <span>Share Product</span>
                  </button>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {/* Free Shipping */}
                <div className="bg-gradient-to-br from-green-50/50 to-teal-50/50 dark:from-green-900/20 dark:to-teal-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-300">
                        Free Shipping
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Orders over $50
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quality Guarantee */}
                <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-blue-800 dark:text-blue-300">
                        Premium Quality
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Guaranteed excellence
                      </p>
                    </div>
                  </div>
                </div>

                {/* Easy Returns */}
                <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <RotateCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-purple-800 dark:text-purple-300">
                        Easy Returns
                      </h4>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        30-day policy
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Shopping */}
                <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-orange-800 dark:text-orange-300">
                        Secure Payment
                      </h4>
                      <p className="text-sm text-orange-600 dark:text-orange-400">
                        100% protected
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
