"use client";

import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminLayout from "../component/admin/AdminLayout";
import { getStatusColor, IOrder } from "../types/Order";
import { useAdminContext } from "../context/AdminContext";
import { useRouter } from "next/navigation";

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function AdminDashboard() {
  const { admin, loading: authLoading, isAuthenticated } = useAdminContext();
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !admin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [statsResponse, ordersResponse] = await Promise.all([
          fetch("/api/admin/dashboard/stats", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/admin/dashboard/recent-orders", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        } else {
          throw new Error("Failed to fetch stats");
        }

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders(ordersData);
        } else {
          throw new Error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (!authLoading) {
      fetchDashboardData();
    }
  }, [isAuthenticated, admin, authLoading]);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
      iconBg: "bg-blue-100 dark:bg-blue-800/30",
      textColor: "text-blue-600 dark:text-blue-400",
      isPositive: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/10",
      iconBg: "bg-green-100 dark:bg-green-800/30",
      textColor: "text-green-600 dark:text-green-400",
      isPositive: true,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
      iconBg: "bg-purple-100 dark:bg-purple-800/30",
      textColor: "text-purple-600 dark:text-purple-400",
      isPositive: true,
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/10",
      iconBg: "bg-orange-100 dark:bg-orange-800/30",
      textColor: "text-orange-600 dark:text-orange-400",
      isPositive: true,
    },
  ];

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !admin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg font-medium">
              Access Denied
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You must be logged in to access the admin dashboard.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg font-medium">
              Error Loading Dashboard
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
            <Button
              onClick={() => router.refresh()}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 mt-10 mx-10 mb-10">
        {/* Header Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                Dashboard Overview
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Welcome back! Here&apos;s your store performance at a glance.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className={`${card.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${card.textColor}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {card.title}
                    </p>
                    <p className={`text-3xl font-bold ${card.textColor}`}>
                      {card.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Orders Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-yellow-100 dark:bg-yellow-800/30 w-12 h-12 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This Week
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Orders
                </p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.pendingOrders}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Awaiting your attention
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-green-100 dark:bg-green-800/30 w-12 h-12 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This Month
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed Orders
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.completedOrders}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Successfully delivered
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-0 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="bg-purple-100 dark:bg-purple-800/30 w-12 h-12 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Overall
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalOrders > 0
                    ? Math.round(
                        (stats.completedOrders / stats.totalOrders) * 100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Order completion rate
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Latest customer orders and their status
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/orders")}
                className="border-purple-200 cursor-pointer text-purple-700 hover:bg-purple-900 dark:border-purple-700 dark:text-purple-300"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order._id}
                    className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-700/30 dark:to-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-600/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {order.items.map((item) => (
                            <span key={item.productId} className="mr-2">
                              {item.name} (×{item.quantity})
                            </span>
                          ))}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          ₹{order.total}
                        </p>
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                    No recent orders found
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                    Orders will appear here when customers start shopping
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
