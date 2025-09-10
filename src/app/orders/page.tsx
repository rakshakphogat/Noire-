"use client";

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  Package,
  Calendar,
  Eye,
  ArrowRight,
  Filter,
  Search,
  ShoppingBag,
  Star,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  PackageCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IOrder } from "../types/Order";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig = {
  pending: {
    color: "from-yellow-500 to-orange-500",
    bgColor:
      "from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/30 dark:to-orange-900/30",
    borderColor: "border-yellow-200/50 dark:border-yellow-700/50",
    textColor: "text-yellow-700 dark:text-yellow-300",
    icon: Clock,
  },
  confirmed: {
    color: "from-blue-500 to-cyan-500",
    bgColor:
      "from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30",
    borderColor: "border-blue-200/50 dark:border-blue-700/50",
    textColor: "text-blue-700 dark:text-blue-300",
    icon: CheckCircle,
  },
  processing: {
    color: "from-purple-500 to-pink-500",
    bgColor:
      "from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30",
    borderColor: "border-purple-200/50 dark:border-purple-700/50",
    textColor: "text-purple-700 dark:text-purple-300",
    icon: Package,
  },
  shipped: {
    color: "from-indigo-500 to-purple-500",
    bgColor:
      "from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30",
    borderColor: "border-indigo-200/50 dark:border-indigo-700/50",
    textColor: "text-indigo-700 dark:text-indigo-300",
    icon: Truck,
  },
  delivered: {
    color: "from-green-500 to-emerald-500",
    bgColor:
      "from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30",
    borderColor: "border-green-200/50 dark:border-green-700/50",
    textColor: "text-green-700 dark:text-green-300",
    icon: PackageCheck,
  },
  cancelled: {
    color: "from-red-500 to-pink-500",
    bgColor:
      "from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30",
    borderColor: "border-red-200/50 dark:border-red-700/50",
    textColor: "text-red-700 dark:text-red-300",
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  const sortedOrders = filteredOrders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative z-10">
          <LoadingSpinner size="lg" />
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-6">
            MY ORDERS
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            Track and manage your orders
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search by order ID or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
              >
                <SelectTrigger className="w-full py-6 cursor-pointer text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl transition-all duration-300 shadow-lg">
                  <SelectValue placeholder="All Orders" />
                </SelectTrigger>

                <SelectContent className="bg-white/95 text-gray-400 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl z-50">
                  <SelectItem className="cursor-pointer" value="all">
                    All Orders
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="pending">
                    Pending
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="confirmed">
                    Confirmed
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="shipped">
                    Shipped
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="delivered">
                    Delivered
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {error ? (
          <div className="text-center py-16">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-12 shadow-2xl max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Error Loading Orders
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
              <Button
                onClick={fetchOrders}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : sortedOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-12 shadow-2xl max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-4">
                {orders.length === 0 ? "No Orders Yet" : "No Orders Found"}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start shopping to see your orders here."
                  : "No orders match your current filters. Try adjusting your search or filter criteria."}
              </p>
              <Link
                href="/products"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedOrders.map((order) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order._id}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-6 sm:mb-0">
                        <div className="flex items-center space-x-4 mb-4">
                          <div
                            className={`w-12 h-12 bg-gradient-to-br ${statusInfo.color} rounded-2xl flex items-center justify-center`}
                          >
                            <StatusIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <div className="flex items-center space-x-6 mt-2">
                              <div className="text-gray-600 dark:text-gray-300 flex items-center">
                                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2">
                                  <Calendar className="w-3 h-3 text-white" />
                                </div>
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                              <div
                                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${statusInfo.bgColor} border ${statusInfo.borderColor} ${statusInfo.textColor}`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}{" "}
                          items
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
                        Items
                      </h3>
                      <Link
                        href={`/orders/${order._id}`}
                        className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium inline-flex items-center space-x-2 bg-purple-50/50 dark:bg-purple-900/30 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                              {item.name}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Qty: {item.quantity}
                              </p>
                              <p className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {order.items.length > 2 && (
                        <div className="text-center">
                          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800/50 dark:to-purple-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              +{order.items.length - 2} more items
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-8 py-6 bg-gradient-to-r from-gray-50/50 to-purple-50/30 dark:from-gray-800/50 dark:to-purple-900/20 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        {order.status === "delivered" && (
                          <Button className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium bg-yellow-50/50 dark:bg-yellow-900/30 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/50 px-4 py-2 rounded-xl transition-all duration-300 inline-flex items-center space-x-2">
                            <Star className="w-4 h-4" />
                            <span>Rate & Review</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Info */}
        {sortedOrders.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg max-w-sm mx-auto">
              <p className="text-gray-600 dark:text-gray-300">
                Showing{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {sortedOrders.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {orders.length}
                </span>{" "}
                orders
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
