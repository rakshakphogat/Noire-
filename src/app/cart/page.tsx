"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  MapPin,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { IAddress } from "../types/Order";
import { toast } from "sonner";

export default function CartPage() {
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    totalPrice,
    itemCount,
    clearCart,
  } = useCart();

  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState<IAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch("/api/users/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);

        // Select default address if available
        const defaultAddress = data.addresses?.find(
          (addr: IAddress) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      const response = await fetch("/api/users/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddress),
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);

        // Select the newly added address if it's set as default
        if (newAddress.isDefault) {
          const addedAddress = data.addresses?.find(
            (addr: IAddress) =>
              addr.firstName === newAddress.firstName &&
              addr.lastName === newAddress.lastName &&
              addr.address === newAddress.address
          );
          if (addedAddress) {
            setSelectedAddress(addedAddress);
          }
        }

        // Reset form
        setNewAddress({
          firstName: "",
          lastName: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          phone: "",
          isDefault: false,
        });
        setShowAddressForm(false);

        toast.success("Address added successfully");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add address");
      }
    } catch (error) {
      toast.error("Couldn't save address");
      console.error("Failed to add address", error);
    }
  };

  const handleQuantityUpdate = async (
    productId: string,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    setIsUpdating(productId);
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setIsUpdating(productId);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Failed to remove item", error);
    } finally {
      setIsUpdating(null);
    }
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

  if (itemCount === 0 || !cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-12 shadow-2xl max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-4">
                Your cart is empty
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link
                href="/products"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2 cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.subtotal || totalPrice;
  const shipping = cart.shipping || (subtotal > 50 ? 0 : 10);
  const tax = cart.tax || subtotal * 0.08;
  const total = cart.total || subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-4">
            Shopping Cart
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">
            {itemCount} items in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="space-y-8">
                  {cart.items.map((item) => (
                    <div
                      key={item._id || item.productId}
                      className="flex space-x-6 border-b border-gray-200/50 dark:border-gray-700/50 pb-8 last:border-b-0 last:pb-0"
                    >
                      <div className="flex-shrink-0">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300" />
                          <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-xl">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              <Link
                                href={`/products/${item.productId}`}
                                className="hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text hover:text-transparent transition-all duration-300 cursor-pointer"
                              >
                                {item.name}
                              </Link>
                            </h3>

                            {/* Product Variants */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {item.color && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50">
                                  Color: {item.color}
                                </span>
                              )}
                              {item.size && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                                  Size: {item.size}
                                </span>
                              )}
                            </div>

                            <p className="text-2xl  font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formatPrice(item.price)}
                            </p>
                          </div>

                          <Button
                            onClick={() => handleRemoveItem(item.productId)}
                            disabled={isUpdating === item.productId}
                            className="text-red-500 cursor-pointer hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all duration-300"
                          >
                            {isUpdating === item.productId ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center space-x-4">
                            <Button
                              onClick={() =>
                                handleQuantityUpdate(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                isUpdating === item.productId
                              }
                              className="w-10 h-10 cursor-pointer text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-all duration-300"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>

                            <span className="w-16 text-center font-semibold text-lg text-gray-100">
                              {isUpdating === item.productId ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                item.quantity
                              )}
                            </span>

                            <Button
                              onClick={() =>
                                handleQuantityUpdate(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="w-10 h-10 text-gray-300 cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Total:{" "}
                            </span>
                            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <Button
                    onClick={clearCart}
                    className="text-red-600 cursor-pointer hover:text-red-800 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-all duration-300"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Address Selection */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    Delivery Address
                  </h2>
                  {!showAddressForm && (
                    <Button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Add New Address
                    </Button>
                  )}
                </div>

                {loadingAddresses ? (
                  <div className="text-center py-8">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <>
                    {/* Existing Addresses */}
                    {addresses.length > 0 && (
                      <div className="space-y-4 mb-6">
                        {addresses.map((address, index) => (
                          <div
                            key={address._id || index}
                            className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                              selectedAddress?._id === address._id
                                ? "border-purple-300 dark:border-purple-600 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 shadow-lg"
                                : "border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
                            }`}
                            onClick={() => setSelectedAddress(address)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {address.firstName} {address.lastName}
                                  </p>
                                  {address.isDefault && (
                                    <span className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full font-medium border border-green-200/50 dark:border-green-700/50">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">
                                  {address.address}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">
                                  {address.city}, {address.state}{" "}
                                  {address.postalCode}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-1">
                                  {address.country}
                                </p>
                                {address.phone && (
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Phone: {address.phone}
                                  </p>
                                )}
                              </div>
                              {selectedAddress?._id === address._id && (
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Address Form */}
                    {showAddressForm && (
                      <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/50 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
                          Add New Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            type="text"
                            placeholder="First Name"
                            value={newAddress.firstName}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                firstName: e.target.value,
                              })
                            }
                            className="bg-white/80 text-gray-300 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/20"
                          />
                          <Input
                            type="text"
                            placeholder="Last Name"
                            value={newAddress.lastName}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                lastName: e.target.value,
                              })
                            }
                            className="bg-white/80 text-gray-300 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/20"
                          />
                          <Input
                            type="text"
                            placeholder="Address"
                            value={newAddress.address}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                address: e.target.value,
                              })
                            }
                            className="bg-white/80 text-gray-300 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/20 md:col-span-2"
                          />
                          <Input
                            type="text"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                city: e.target.value,
                              })
                            }
                            className="bg-white/80 text-gray-300 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/20"
                          />
                          <Input
                            type="text"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                state: e.target.value,
                              })
                            }
                            className="bg-white/80 text-gray-300 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/20"
                          />
                          <Input
                            type="text"
                            placeholder="Postal Code"
                            value={newAddress.postalCode}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                postalCode: e.target.value,
                              })
                            }
                            className="bg-white/80 text-gray-300 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/20"
                          />
                          <Input
                            type="text"
                            placeholder="Country"
                            value={newAddress.country}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                country: e.target.value,
                              })
                            }
                            className="bg-white/80 text-gray-300 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/20"
                          />
                          <Input
                            type="text"
                            placeholder="Phone"
                            value={newAddress.phone}
                            onChange={(e) =>
                              setNewAddress({
                                ...newAddress,
                                phone: e.target.value,
                              })
                            }
                            className="bg-white/80 text-gray-300 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/30 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500/20 md:col-span-2"
                          />
                          <div className="md:col-span-2 flex items-center space-x-3">
                            <Checkbox
                              checked={newAddress.isDefault}
                              onCheckedChange={(checked) =>
                                setNewAddress({
                                  ...newAddress,
                                  isDefault: checked === true,
                                })
                              }
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                            />
                            <Label
                              htmlFor="isDefault"
                              className="text-gray-700 dark:text-gray-300"
                            >
                              Set as default address
                            </Label>
                          </div>
                        </div>
                        <div className="flex space-x-4 mt-6">
                          <Button
                            onClick={handleAddAddress}
                            className="bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            Add Address
                          </Button>
                          <Button
                            onClick={() => setShowAddressForm(false)}
                            className="border border-gray-300 text-gray-300 cursor-pointer dark:border-gray-600 px-6 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {addresses.length === 0 && !showAddressForm && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No addresses found. Add your first delivery address.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-2xl sticky top-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent mb-8">
                Order Summary
              </h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Shipping
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        Free
                      </span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Tax</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(tax)}
                  </span>
                </div>

                <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/30 dark:to-cyan-900/30 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 rounded-2xl">
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                    Add {formatPrice(50 - subtotal)} more for free shipping!
                  </p>
                </div>
              )}

              {/* Selected Address Summary */}
              {selectedAddress && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 rounded-2xl">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                    Delivering to:
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                    {selectedAddress.firstName} {selectedAddress.lastName}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    {selectedAddress.address}, {selectedAddress.city}
                  </p>
                </div>
              )}

              <Link
                href="/checkout"
                className={`w-full py-4 px-6 rounded-xl font-semibold mt-8 flex items-center justify-center space-x-2 transition-all duration-300 ${
                  selectedAddress
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                onClick={(e) => {
                  if (!selectedAddress) {
                    e.preventDefault();
                  }
                }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {!selectedAddress && (
                <p className="text-xs text-red-600 dark:text-red-400 text-center mt-3">
                  Please select a delivery address to continue
                </p>
              )}

              <Link
                href="/products"
                className="w-full border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-4 px-6 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-white/70 dark:hover:bg-gray-800/70 mt-4 flex items-center justify-center transition-all duration-300 cursor-pointer"
              >
                Continue Shopping
              </Link>

              <div className="mt-8 text-center">
                <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs font-medium">
                    Secure checkout with SSL encryption
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
