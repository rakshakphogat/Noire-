"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

interface AdminContextType {
  admin: AdminUser | null;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        setError(null);
      } else {
        setAdmin(null);
        if (response.status !== 401) {
          console.error("Auth check failed with status:", response.status);
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAdmin(null);
      setError("Authentication check failed");
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  // Initial auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle redirects based on auth state
  useEffect(() => {
    if (!isInitialized || loading) return;

    const isLoginPage = pathname === "/admin/login";
    const isAdminRoute = pathname.startsWith("/admin");

    if (!admin && isAdminRoute && !isLoginPage) {
      // Not authenticated and trying to access admin pages (except login)
      router.replace("/admin/login");
    } else if (admin && isLoginPage) {
      // Authenticated but on login page - redirect to dashboard
      router.replace("/admin");
    }
  }, [admin, pathname, router, isInitialized, loading]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdmin(data.admin);
        setError(null);
        setTimeout(() => {
          router.push("/admin");
        }, 100);

        return { success: true };
      } else {
        setError(data.error || "Login failed");
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        "Login failed. Please check your connection and try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // Clear the admin state
      setAdmin(null);
      router.replace("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout API fails, we should still clear local state and redirect
      setAdmin(null);
      router.replace("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  const value: AdminContextType = {
    admin,
    loading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!admin,
    clearError,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}
