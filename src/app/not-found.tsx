"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 flex items-center justify-center p-4 px-4 sm:px-6 lg:px-8 py-8">
        <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 w-fit shadow-xl">
              <Package className="h-12 w-12 text-white" />
            </div>
            <CardTitle className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              404
            </CardTitle>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-2">
              Page Not Found
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved, deleted, or never existed.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search Section */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Looking for something specific?
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Search our products..."
                  className="flex-1 text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl"
                />
                <Button className="bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Search
                </Button>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/" passHref className="block">
                <Button
                  className="w-full cursor-pointer h-auto p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  size="lg"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Home className="h-6 w-6" />
                    <span>Back to Home</span>
                  </div>
                </Button>
              </Link>

              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full h-auto cursor-pointer p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <div className="flex flex-col text-gray-400 items-center space-y-2">
                  <ArrowLeft className="h-6 w-6" />
                  <span>Go Back</span>
                </div>
              </Button>
            </div>

            {/* Popular Pages */}
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm p-6 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-lg">
              <h4 className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Popular Pages
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/products"
                  className="text-blue-700 dark:text-blue-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  • All Products
                </Link>
                <Link
                  href="/about-us"
                  className="text-blue-700 dark:text-blue-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
                >
                  • About Us
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center pt-4 border-t border-white/20 dark:border-gray-700/30">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Still need help? Our customer support team is here for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact-us">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 text-gray-500 cursor-pointer"
                  >
                    Contact Support
                  </Button>
                </Link>
                <Link href="/support">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 text-gray-500 cursor-pointer"
                  >
                    Help Center
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
