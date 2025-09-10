"use client";

import Image from "next/image";
import MainBanner from "./assets/MainBanner.jpg";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ProductCard from "./component/ProductCard";

import { Input } from "@/components/ui/input";
import { useProducts } from "./context/ProductContexts";
import { ArrowRight, Star, Truck, Shield, RefreshCw, Mail } from "lucide-react";
import FAQSection from "./component/FAQSection";

export default function Home() {
  const { loading, filteredProducts } = useProducts();
  const router = useRouter();

  const onClickHandle = () => {
    router.push("/products");
  };

  const features = [
    {
      icon: Star,
      title: "Premium Quality",
      description: "Crafted with the finest materials for lasting elegance",
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Complimentary worldwide delivery on orders over $100",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "Your transactions are protected with advanced encryption",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day hassle-free return policy for peace of mind",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-pink-200/20 to-blue-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10">
        <h1 className="sr-only">
          Modern Wardrobe - Premium Fashion Collection
        </h1>
        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 dark:border-gray-700/30 shadow-2xl w-full min-h-[60vh] sm:min-h-[70vh] lg:h-[80vh] mt-6 sm:mt-8 lg:mt-10 overflow-hidden rounded-3xl">
            {/* Text Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 text-center lg:text-left order-2 lg:order-1">
              <div className="max-w-lg">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 lg:mb-8 leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Redefining the Modern Wardrobe
                </h1>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Discover timeless elegance meets contemporary style. Crafted
                  for those who dare to stand out.
                </p>
                <Button
                  onClick={onClickHandle}
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Explore All Products
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 relative aspect-[16/9] lg:aspect-[4/3] order-1 lg:order-2">
              <Image
                src={MainBanner}
                alt="Fashion Collection"
                fill
                priority
                loading="eager"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:scale-105"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Latest Collections Section */}
        <div className="mt-20 sm:mt-24 lg:mt-32">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-4">
              LATEST COLLECTIONS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6" />
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our curated selection of premium fashion pieces, designed
              to elevate your style and make every moment unforgettable.
            </p>
          </div>

          {/* Loading and Empty States */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Loading our amazing products...
              </p>
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No Products Found
              </p>
            </div>
          )}

          {/* Products Grid */}
          <div className="px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8 max-w-[2000px] mx-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <FAQSection />

        {/* Newsletter Section */}
        <div className="mt-20 sm:mt-24 lg:mt-32 pb-16 sm:pb-20 lg:pb-24">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-600/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-4">
                Subscribe and get an Exciting Offer
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join our exclusive community and be the first to access new
                collections, special discounts, and styling tips.
              </p>

              {/* Newsletter Form */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                <Input
                  aria-label="Email address"
                  className="w-full sm:flex-1 p-4 text-base bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-500/20 text-white"
                  placeholder="Enter your email address"
                  type="email"
                />
                <Button className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4">
                * No spam, unsubscribe at any time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
