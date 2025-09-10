"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  CheckCircle,
  Package,
  MapPin,
  CreditCard,
  ArrowRight,
  Download,
  Truck,
  Clock,
  PackageCheck,
  Star,
  Shield,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IOrder, IOrderItem } from "@/app/types/Order";

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
    color: "from-green-500 to-emerald-500",
    bgColor:
      "from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30",
    borderColor: "border-green-200/50 dark:border-green-700/50",
    textColor: "text-green-700 dark:text-green-300",
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
};

const paymentStatusConfig = {
  pending: {
    color: "from-yellow-500 to-orange-500",
    bgColor:
      "from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/30 dark:to-orange-900/30",
    textColor: "text-yellow-700 dark:text-yellow-300",
  },
  paid: {
    color: "from-green-500 to-emerald-500",
    bgColor:
      "from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30",
    textColor: "text-green-700 dark:text-green-300",
  },
  unpaid: {
    color: "from-red-500 to-pink-500",
    bgColor:
      "from-red-50/80 to-pink-50/80 dark:from-red-900/30 dark:to-pink-900/30",
    textColor: "text-red-700 dark:text-red-300",
  },
};

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          if (response.ok) {
            const data = await response.json();
            setOrder(data.order);
          } else {
            setError("Order not found");
          }
        } catch (error) {
          console.error("Failed to fetch order:", error);
          setError("Failed to load order details");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const handleDownloadInvoice = async () => {
    if (!orderId) {
      console.error("Order ID is missing");
      return;
    }

    try {
      setDownloading(true);
      const response = await fetch(`/api/orders/${orderId}/invoice`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      // Check if the response is actually a PDF
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        throw new Error("Invalid response format - expected PDF");
      }
      const blob = await response.blob();
      // Create object URL
      const url = window.URL.createObjectURL(blob);
      // Create temporary anchor element for download
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      link.style.display = "none";
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Clean up object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      alert(`Failed to download invoice: ${errorMessage}`);
    } finally {
      setDownloading(false);
    }
  };

  const getEstimatedDelivery = () => {
    if (!order) return null;

    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + (order.shipping === 0 ? 5 : 7));

    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 text-center">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-12 shadow-2xl max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Order Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {error || "The order you're looking for doesn't exist."}
            </p>
            <Link
              href="/orders"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
            >
              <span>View All Orders</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
  const paymentInfo =
    paymentStatusConfig[
      order.paymentStatus as keyof typeof paymentStatusConfig
    ];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Thank you for your purchase
            </p>
            <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 rounded-2xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order ID:{" "}
                <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">
                  {order._id}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-6">
                  Order Status
                </h2>

                <div
                  className={`flex items-center justify-between p-6 bg-gradient-to-r ${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-2xl shadow-lg`}
                >
                  <div className="flex items-center space-x-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${statusInfo.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <StatusIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                        Order Placed
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full font-semibold bg-gradient-to-r ${statusInfo.bgColor} border ${statusInfo.borderColor} ${statusInfo.textColor} mb-2`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment:{" "}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${paymentInfo.bgColor} ${paymentInfo.textColor}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>

                {order.status === "confirmed" && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-2xl shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Truck className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800 dark:text-blue-300 text-lg mb-1">
                          Estimated Delivery: {getEstimatedDelivery()}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          We&apos;ll send you tracking information once your
                          order ships
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-8">
                  Order Items
                </h2>

                <div className="space-y-8">
                  {order.items.map((item: IOrderItem, index: number) => (
                    <div
                      key={index}
                      className="flex space-x-6 border-b border-gray-200/50 dark:border-gray-700/50 pb-8 last:border-b-0 last:pb-0"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          {item.name}
                        </h3>

                        {/* Color and Size Display */}
                        <div className="flex items-center space-x-4 mb-3">
                          {item.color && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Color:
                              </span>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-sm"
                                  style={{
                                    backgroundColor: item.color.toLowerCase(),
                                  }}
                                  title={item.color}
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                  {item.color}
                                </span>
                              </div>
                            </div>
                          )}

                          {item.size && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Size:
                              </span>
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
                                {item.size}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                          Quantity:{" "}
                          <span className="font-semibold">{item.quantity}</span>
                        </p>
                        <p className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {formatPrice(item.price)} × {item.quantity} ={" "}
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  Shipping Address
                </h2>

                <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-2xl p-6">
                  <div className="text-gray-700 dark:text-gray-300 space-y-2">
                    <p className="font-bold text-xl text-gray-900 dark:text-white">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                    <p className="text-lg">{order.shippingAddress.address}</p>
                    <p className="text-lg">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-lg">{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="flex items-center mt-3">
                        <Phone className="w-4 h-4 mr-2" />
                        {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  Payment Method
                </h2>

                <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 rounded-2xl p-6">
                  <div className="text-gray-700 dark:text-gray-300">
                    <p className="font-bold text-xl text-gray-900 dark:text-white mb-3">
                      {order.paymentMethod.name}
                    </p>
                    <p className="text-lg">
                      Payment Status:{" "}
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-full font-semibold bg-gradient-to-r ${paymentInfo.bgColor} ${paymentInfo.textColor}`}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl p-8 sticky top-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-8">
                Order Summary
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal (
                    {order.items.reduce(
                      (sum: number, item: IOrderItem) => sum + item.quantity,
                      0
                    )}{" "}
                    items)
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Shipping
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {order.shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        Free
                      </span>
                    ) : (
                      formatPrice(order.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(order.tax)}
                  </span>
                </div>

                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                  className={`w-full cursor-pointer py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 ${
                    downloading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  } text-white`}
                >
                  <Download
                    className={`w-5 h-5 ${downloading ? "animate-spin" : ""}`}
                  />
                  <span>
                    {downloading ? "Generating PDF..." : "Download Invoice"}
                  </span>
                </Button>

                <Link
                  href="/orders"
                  className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 py-4 px-6 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-800/70 hover:border-gray-400/50 dark:hover:border-gray-500/50 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View All Orders
                </Link>

                <Link
                  href="/products"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-8 text-center">
                <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 rounded-2xl p-4">
                  <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="font-semibold">Secure Purchase</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Your order is protected with SSL encryption
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Need help?{" "}
                  <Link
                    href="/support"
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
                  >
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Success Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Free Shipping
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enjoy complimentary shipping on orders over $50
            </p>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Quality Guarantee
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              30-day return policy for your peace of mind
            </p>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Rate Your Experience
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your feedback to help us improve
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
