"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  UserPlus,
  TrendingUp,
  LucideIcon,
} from "lucide-react";
import AdminLayout from "@/app/component/admin/AdminLayout";
import { useAdminContext } from "@/app/context/AdminContext";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: string;
  status: string;
  avatar: string;
}

interface Stat {
  icon: LucideIcon;
  number: string;
  label: string;
  color: string;
}

export default function AdminCustomers() {
  const { admin, loading: authLoading, isAuthenticated } = useAdminContext();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || !admin) return;

      try {
        const res = await fetch("/api/admin/customers/stats", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success) {
          setStats([
            {
              icon: Users,
              number: data.stats.totalCustomers.toLocaleString(),
              label: "Total Customers",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: UserPlus,
              number: data.stats.newThisMonth.toLocaleString(),
              label: "New This Month",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: TrendingUp,
              number: `${data.stats.activeCustomersPercentage}%`,
              label: "Active Customers",
              color: "from-purple-500 to-pink-500",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setError("Failed to load customer statistics");
      }
    };

    if (!authLoading) {
      fetchStats();
    }
  }, [isAuthenticated, admin, authLoading]);

  useEffect(() => {
    async function fetchCustomers() {
      if (!isAuthenticated || !admin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/admin/customers", {
          credentials: "include",
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        } else {
          throw new Error("Failed to fetch customers");
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchCustomers();
    }
  }, [isAuthenticated, admin, authLoading]);

  // Show loading spinner while auth is being checked
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

  // Show error if not authenticated (though this should be handled by AdminContext redirects)
  if (!isAuthenticated || !admin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg font-medium">
              Access Denied
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You must be logged in to access customer management.
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show loading spinner while customer data is being fetched
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading customers...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg font-medium">
              Error Loading Customers
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

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="mb-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative background elements - matching AboutUs */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4">
          {/* Header - reduced margin */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-4">
              CUSTOMER MANAGEMENT
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-3" />
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Manage and analyze your customer base with comprehensive insights
              and powerful tools
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Stats Section - reduced margin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105"
                  >
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300 mx-auto`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filters and Search - reduced margin */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 w-full sm:w-80 h-12 text-base bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border-white/20 dark:border-gray-600/30 rounded-xl shadow-lg focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button className="mr-10 bg-gradient-to-r cursor-pointer from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Download className="h-5 w-5 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/40 dark:to-pink-900/40 backdrop-blur-sm">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Total Spent
                      </th>
                      {/* <th className="px-8 py-4 text-left text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Status
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20 dark:divide-gray-700/30">
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.id}
                        className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
                      >
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {customer.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-lg text-gray-900 dark:text-white">
                                {customer.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Joined{" "}
                                {new Date(customer.joinDate).toLocaleDateString(
                                  "en-US"
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                              <Mail className="h-4 w-4 text-purple-500" />
                              {customer.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Phone className="h-4 w-4 text-green-500" />
                              {customer.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              {customer.location}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-semibold text-lg text-gray-900 dark:text-white">
                              {customer.totalOrders}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="font-bold text-xl text-green-600 dark:text-green-400">
                            {customer.totalSpent}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
