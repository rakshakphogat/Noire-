"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Download,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Phone,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/app/component/admin/AdminLayout";
import OrderDetailsModal from "@/app/component/admin/OrderDetailsModal";
import { IOrder } from "@/app/types/Order";
import { useAdminContext } from "@/app/context/AdminContext";
import { useRouter } from "next/navigation";

export default function OrdersManagement() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, admin } = useAdminContext();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {});

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: IOrder["status"]
  ) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? ({
                  ...(order.toObject?.() ?? order),
                  status: newStatus,
                  updatedAt: new Date().toISOString(),
                } as IOrder)
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handlePaymentStatusUpdate = async (
    orderId: string,
    newPaymentStatus: IOrder["paymentStatus"]
  ) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPaymentStatus }),
      });

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? ({
                  ...(order.toObject?.() ?? order),
                  paymentStatus: newPaymentStatus,
                  updatedAt: new Date().toISOString(),
                } as IOrder)
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "processing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "refunded":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return Clock;
      case "confirmed":
        return CheckCircle;
      case "processing":
        return Package;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    const matchesPaymentStatus =
      selectedPaymentStatus === "all" ||
      order.paymentStatus === selectedPaymentStatus;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.total, 0),
  };

  const handleViewOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleExportOrders = () => {
    const csvData = filteredOrders.map((order) => ({
      OrderNumber: order._id,
      Customer: order.shippingAddress.firstName,
      Total: order.total,
      Status: order.status,
      PaymentStatus: order.paymentStatus,
      CreatedAt: new Date(order.createdAt).toLocaleDateString(),
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Verifying access...
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !admin) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="relative z-10 flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Loading orders...
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-2">
                Orders Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Manage and track all customer orders
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mt-2" />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => fetchOrders()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-gray-400 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button
                onClick={handleExportOrders}
                variant="outline"
                size="sm"
                className="flex text-gray-400 cursor-pointer items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-700"
                disabled={filteredOrders.length === 0}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Orders Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              {
                label: "Total",
                value: orderStats.total,
                color: "text-gray-900 dark:text-white",
                icon: Package,
              },
              {
                label: "Pending",
                value: orderStats.pending,
                color: "text-yellow-600",
                icon: Clock,
              },
              {
                label: "Processing",
                value: orderStats.processing,
                color: "text-orange-600",
                icon: Package,
              },
              {
                label: "Shipped",
                value: orderStats.shipped,
                color: "text-purple-600",
                icon: Truck,
              },
              {
                label: "Delivered",
                value: orderStats.delivered,
                color: "text-green-600",
                icon: CheckCircle,
              },
              {
                label: "Cancelled",
                value: orderStats.cancelled,
                color: "text-red-600",
                icon: XCircle,
              },
              {
                label: "Revenue",
                value: `₹${orderStats.totalRevenue.toLocaleString()}`,
                color: "text-green-600",
                icon: DollarSign,
                isRevenue: true,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                      <Icon
                        className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                      {stat.isRevenue ? stat.value : stat.value}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by order number, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full cursor-text text-gray-900 dark:text-gray-200 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:ring-2 focus:border-white rounded-xl transition-all duration-300 shadow-lg focus:ring-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full sm:w-48 cursor-pointer text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:ring-2 focus:border-white rounded-xl transition-all duration-300 shadow-lg focus:ring-white">
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl z-50">
                    <SelectItem
                      value="all"
                      className="cursor-pointer text-gray-900 dark:text-white"
                    >
                      All Status
                    </SelectItem>
                    <SelectItem
                      value="pending"
                      className="cursor-pointer text-gray-900 dark:text-white"
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="confirmed"
                      className="cursor-pointer text-gray-900 dark:text-white"
                    >
                      Confirmed
                    </SelectItem>
                    <SelectItem
                      value="processing"
                      className="cursor-pointer text-gray-900 dark:text-white"
                    >
                      Processing
                    </SelectItem>
                    <SelectItem
                      value="shipped"
                      className="cursor-pointer text-gray-900 dark:text-white"
                    >
                      Shipped
                    </SelectItem>
                    <SelectItem
                      value="delivered"
                      className="cursor-pointer text-gray-900 dark:text-white"
                    >
                      Delivered
                    </SelectItem>
                    <SelectItem
                      value="cancelled"
                      className="cursor-pointer text-gray-900 dark:text-white"
                    >
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedPaymentStatus}
                  onValueChange={setSelectedPaymentStatus}
                >
                  <SelectTrigger className="w-full sm:w-48 cursor-pointer text-gray-300 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 focus:ring-2 focus:border-white rounded-xl transition-all duration-300 shadow-lg focus:ring-white">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl z-50">
                    <SelectItem
                      value="all"
                      className="cursor-pointer text-white"
                    >
                      All Payments
                    </SelectItem>
                    <SelectItem
                      value="pending"
                      className="cursor-pointer text-white"
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      value="paid"
                      className="cursor-pointer text-white"
                    >
                      Paid
                    </SelectItem>
                    <SelectItem
                      value="failed"
                      className="cursor-pointer text-white"
                    >
                      Failed
                    </SelectItem>
                    <SelectItem
                      value="refunded"
                      className="cursor-pointer text-white"
                    >
                      Refunded
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50/80 to-purple-50/80 dark:from-gray-700/80 dark:to-gray-600/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Order
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Date
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-gray-600/50">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <Package className="w-12 h-12 text-gray-400" />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No orders found
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300">
                                {searchTerm ||
                                selectedStatus !== "all" ||
                                selectedPaymentStatus !== "all"
                                  ? "Try adjusting your search or filter criteria."
                                  : "Orders will appear here once customers start placing them."}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <tr
                            key={order._id}
                            className="hover:bg-gray-50/50  dark:hover:bg-gray-700/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  #{order._id}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {order.shippingAddress?.firstName}{" "}
                                    {order.shippingAddress?.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                    <Mail className="w-3 h-3" />
                                    <span>{order?.email}</span>
                                  </div>
                                  {order.shippingAddress.phone && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                                      <Phone className="w-3 h-3" />
                                      <span>{order.shippingAddress.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Package className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {order.items.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                  )}{" "}
                                  items
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {order.items
                                  .slice(0, 2)
                                  .map((item) => item.name)
                                  .join(", ")}
                                {order.items.length > 2 &&
                                  ` +${order.items.length - 2} more`}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900 dark:text-white">
                                ₹{order.total.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                via {order.paymentMethod.name}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={`${getStatusColor(
                                  order.status
                                )} flex items-center gap-1 w-fit`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={`${getPaymentStatusColor(
                                  order.paymentStatus
                                )} w-fit`}
                              >
                                {order.paymentStatus.charAt(0).toUpperCase() +
                                  order.paymentStatus.slice(1)}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(order.createdAt).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  onClick={() => handleViewOrder(order)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20"
                                >
                                  <Eye className="w-4 h-4 text-blue-600" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48 bg-white/95 text-white dark:bg-gray-800/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-2xl rounded-xl z-50"
                                  >
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(
                                          order._id,
                                          "confirmed"
                                        )
                                      }
                                      disabled={order.status === "confirmed"}
                                      className="flex items-center space-x-2 cursor-pointer data-[disabled]:cursor-not-allowed"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      <span>Confirm Order</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(
                                          order._id,
                                          "processing"
                                        )
                                      }
                                      disabled={order.status === "processing"}
                                      className="flex items-center space-x-2 cursor-pointer data-[disabled]:cursor-not-allowed"
                                    >
                                      <Package className="w-4 h-4" />
                                      <span>Mark Processing</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(order._id, "shipped")
                                      }
                                      disabled={order.status === "shipped"}
                                      className="flex items-center space-x-2 cursor-pointer data-[disabled]:cursor-not-allowed"
                                    >
                                      <Truck className="w-4 h-4" />
                                      <span>Mark Shipped</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(
                                          order._id,
                                          "delivered"
                                        )
                                      }
                                      disabled={order.status === "delivered"}
                                      className="flex items-center space-x-2 cursor-pointer data-[disabled]:cursor-not-allowed"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      <span>Mark Delivered</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handlePaymentStatusUpdate(
                                          order._id,
                                          "paid"
                                        )
                                      }
                                      disabled={order.paymentStatus === "paid"}
                                      className="flex items-center space-x-2 cursor-pointer data-[disabled]:cursor-not-allowed"
                                    >
                                      <DollarSign className="w-4 h-4" />
                                      <span>Mark Paid</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <TrendingUp className="w-5 h-5" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Today&apos;s Orders
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {
                        orders.filter(
                          (o) =>
                            new Date(o.createdAt).toDateString() ===
                            new Date().toDateString()
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Pending Actions
                    </span>
                    <span className="font-semibold text-orange-600">
                      {
                        orders.filter(
                          (o) =>
                            o.status === "pending" || o.status === "confirmed"
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Success Rate
                    </span>
                    <span className="font-semibold text-green-600">
                      {orders.length > 0
                        ? Math.round(
                            (orders.filter((o) => o.status === "delivered")
                              .length /
                              orders.length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                  <Clock className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .slice(0, 3)
                    .map((order, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600 dark:text-gray-300 truncate">
                          #{order._id}
                        </span>
                        <Badge
                          className={`${getStatusColor(order.status)} text-xs`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  {orders.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                  <Package className="w-5 h-5" />
                  <span>Action Required</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Awaiting Confirmation
                    </span>
                    <span className="font-semibold text-yellow-600">
                      {orders.filter((o) => o.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Ready to Ship
                    </span>
                    <span className="font-semibold text-blue-600">
                      {orders.filter((o) => o.status === "processing").length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Payment Issues
                    </span>
                    {/* <span className="font-semibold text-red-600">
                      {
                        orders.filter((o) => o.paymentStatus === "failed")
                          .length
                      }
                    </span> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Order Management Summary
              </CardTitle>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Total Orders Processed
                  </h3>
                  <p className="text-3xl font-bold text-blue-600">
                    {orderStats.total}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Revenue Generated
                  </h3>
                  <p className="text-3xl font-bold text-green-600">
                    ₹{orderStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Successful Deliveries
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {orderStats.delivered}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={isDetailsModalOpen}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedOrder(null);
            }}
            onStatusUpdate={handleStatusUpdate}
            onPaymentStatusUpdate={handlePaymentStatusUpdate}
          />
        )}
      </div>
    </AdminLayout>
  );
}
