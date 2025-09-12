"use client";

import {
  Search,
  ShoppingBag,
  User,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Menu,
  Home,
  Info,
  Shirt,
  HeadphonesIcon,
  MessageCircle,
  UserCog,
} from "lucide-react";
import { useProducts } from "../context/ProductContexts";
import { useCart } from "../context/CartContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/UserContext";
import { IUser } from "../types/User";

export default function Navbar() {
  const { search, setSearch, setSearchOpen, searchOpen } = useProducts();
  const { itemCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen, setSearchOpen]);

  const handleSearchClick = () => {
    router.push("/products");
    setTimeout(() => {
      setSearchOpen(true);
    }, 500);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearch("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleIconClick = () => {
    router.push("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  };

  const handleProfileUpdate = () => {
    router.push("/update-profile");
  };

  const handleMyOrders = () => {
    router.push("orders");
  };

  const getInitial = (user: IUser | null) => {
    if (!user) return "U";
    if ("firstName" in user && user.firstName)
      return user.firstName[0].toUpperCase();
  };

  const navigationItems = [
    { name: "HOME", path: "/", icon: Home },
    { name: "ABOUT", path: "/about-us", icon: Info },
    { name: "COLLECTIONS", path: "/products", icon: Shirt },
    { name: "SUPPORT", path: "/support", icon: HeadphonesIcon },
    { name: "CONTACT US", path: "/contact-us", icon: MessageCircle },
    { name: "ADMIN", path: "/admin", icon: UserCog },
  ];

  // Don't render theme button until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/20 dark:border-gray-700/30 shadow-sm">
      {/* Gradient overlay for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/10" />

      <div className="relative w-full px-4 sm:px-6 lg:px-8 py-3 lg:py-4 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Access navigation links and user options
              </SheetDescription>
              <div className="flex flex-col h-full py-6">
                {/* Logo in mobile menu */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">N</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    NOIRE&apos;
                  </span>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="w-full justify-start text-left h-12 font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl cursor-pointer"
                        onClick={() => {
                          router.push(item.path);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Button>
                    );
                  })}
                </div>

                {/* User info in mobile menu */}
                {isAuthenticated && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
                      <div className="truncate">
                        {user?.name || user?.email || "User"}
                      </div>
                      {user?.email && user.name && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.email}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-10 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl cursor-pointer"
                      onClick={() => {
                        handleProfileUpdate();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Update Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-10 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 rounded-xl cursor-pointer"
                      onClick={() => {
                        handleMyOrders();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Package className="mr-3 h-4 w-4" />
                      My Orders
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-10 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 rounded-xl cursor-pointer"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo Section */}
        <div className="flex items-center flex-1 lg:flex-none justify-center lg:justify-start">
          <div
            className="cursor-pointer flex items-center space-x-2 lg:space-x-3"
            onClick={handleIconClick}
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base lg:text-lg">
                N
              </span>
            </div>
            <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              NOIRE&apos;
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex flex-row gap-6 xl:gap-8">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              className="cursor-pointer relative font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 group text-sm xl:text-base"
              onClick={() => router.push(item.path)}
            >
              {item.name}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Search */}
          {!searchOpen ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open search"
              onClick={handleSearchClick}
              className="cursor-pointer relative text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl h-8 w-8 lg:h-10 lg:w-10"
            >
              <Search className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          ) : (
            <div
              className="hidden lg:flex items-center gap-2"
              ref={searchContainerRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search Products..."
                  className="w-72 pr-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {/* User Authentication */}
          {!isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUserClick}
              className="cursor-pointer relative text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 rounded-xl h-8 w-8 lg:h-10 lg:w-10 lg:inline-flex hidden"
            >
              <User className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
          ) : (
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm shadow-md">
                        {getInitial(user)}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl p-1"
                  sideOffset={8}
                >
                  <div className="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 mb-1">
                    <div className="truncate">
                      {user?.name || user?.email || "User"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {user?.email && user.name ? user.email : ""}
                    </div>
                  </div>
                  <DropdownMenuItem
                    onClick={handleProfileUpdate}
                    className="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700/50 focus:bg-blue-50 dark:focus:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg mx-1 my-0.5"
                  >
                    <Settings className="mr-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Update Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleMyOrders}
                    className="cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700/50 focus:bg-green-50 dark:focus:bg-gray-700/50 text-gray-900 dark:text-white rounded-lg mx-1 my-0.5"
                  >
                    <Package className="mr-3 h-4 w-4 text-green-600 dark:text-green-400" />
                    My Orders
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700 mx-1 my-1" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 rounded-lg mx-1 my-0.5"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Cart with item count */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCartClick}
              aria-label="Open Cart"
              className="cursor-pointer relative text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 rounded-xl h-8 w-8 lg:h-10 lg:w-10"
            >
              <ShoppingBag className="h-4 w-4 lg:h-5 lg:w-5" />
            </Button>
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 min-w-[1.25rem] h-5 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-gray-900 shadow-md animate-pulse">
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </div>

          {/* Mobile Login Button */}
          {!isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUserClick}
              className="cursor-pointer relative text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 rounded-xl h-8 w-8 lg:hidden"
            >
              <User className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="lg:hidden px-4 pb-3" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search Products..."
              className="w-full pr-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCloseSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </nav>
  );
}
