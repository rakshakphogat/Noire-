"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Shield,
  CheckCircle,
  AlertCircle,
  Edit,
  User,
  Phone,
  Home,
  Truck,
  Star,
} from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { PaymentMethod, IAddress, OrderData } from "../types/Order";
import { toast } from "sonner";
import StripeCheckoutForm from "../component/StripeCheckoutForm";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    loading: cartLoading,
    totalPrice,
    itemCount,
    clearCart,
  } = useCart();

  // Address and Payment States
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [paymentMethods] = useState<PaymentMethod[]>([
    { id: "cod", type: "cod", name: "Cash on Delivery" },
    { id: "stripe", type: "stripe", name: "Credit/Debit Card" },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);

  // Loading and Error States
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Checkout Flow States
  const [currentStep, setCurrentStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Stripe Payment States
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [showStripeForm, setShowStripeForm] = useState(false);

  // Effects
  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (!cartLoading && (!cart?.items?.length || itemCount === 0)) {
      router.push("/cart");
    }
  }, [cart, cartLoading, itemCount, router]);

  // Reset error when step changes
  useEffect(() => {
    setError(null);
  }, [currentStep]);

  // Reset Stripe form when payment method changes
  useEffect(() => {
    if (selectedPaymentMethod?.type !== "stripe") {
      setShowStripeForm(false);
      setClientSecret(null);
      setPaymentIntentId(null);
    }
  }, [selectedPaymentMethod]);

  // Address Functions
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch("/api/users/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
        const defaultAddress = data.addresses?.find(
          (addr: IAddress) => addr.isDefault
        );
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      } else {
        throw new Error("Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
      setError("Failed to load addresses");
      toast.error("Failed to load addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Calculation Functions
  const calculateTotals = () => {
    const subtotal = cart?.subtotal || totalPrice;
    const shipping = cart?.shipping || (subtotal > 50 ? 0 : 10);
    const tax = cart?.tax || subtotal * 0.08;
    const total = cart?.total || subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  };

  // Stripe Payment Functions
  const createStripePaymentIntent = async (
    amount: number,
    metadata: Record<string, string> = {}
  ) => {
    setStripeLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100,
          currency: "usd",
          metadata,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setShowStripeForm(true);
      return data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initialize payment";
      toast.error(errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setStripeLoading(false);
    }
  };

  const confirmStripePayment = async (orderId: string) => {
    if (!paymentIntentId) {
      throw new Error("No payment intent ID available");
    }

    try {
      const response = await fetch("/api/stripe/confirm-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
          orderId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to confirm payment");
      }

      const data = await response.json();
      toast.success("Payment confirmed successfully!");
      return data;
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Failed to confirm payment");
      throw error;
    }
  };

  const handleStripePaymentSuccess = async () => {
    setProcessingPayment(true);
    try {
      if (currentOrderId) {
        await confirmStripePayment(currentOrderId);
        setOrderPlaced(true);
        clearCart();
        setTimeout(() => {
          router.push(`/orders/${currentOrderId}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      setError("Payment succeeded but order confirmation failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleStripePaymentError = (error: string) => {
    setError(error);
    setProcessingPayment(false);
    setShowStripeForm(false);
    toast.error(error);
  };

  // Order Management Functions
  const createOrder = async () => {
    const { subtotal, shipping, tax, total } = calculateTotals();

    const orderData: OrderData = {
      items: cart?.items || [],
      address: selectedAddress!,
      paymentMethod: selectedPaymentMethod!,
      subtotal,
      shipping,
      tax,
      total,
      paymentStatus: "pending",
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to place order");
    }

    return response.json();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      const errorMsg = "Please complete all required information";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setProcessingPayment(true);
    setError(null);

    try {
      const result = await createOrder();
      setCurrentOrderId(result.orderId);

      console.log("RESULT.ORDERID", result.orderId);

      if (selectedPaymentMethod.type === "stripe") {
        const { total } = calculateTotals();
        await createStripePaymentIntent(total, {
          orderId: result.orderId,
        });
      } else {
        setOrderPlaced(true);
        toast.success(
          "Order placed successfully! Payment will be collected on delivery."
        );
        clearCart();
        setTimeout(() => {
          router.push(`/orders/${result.orderId}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to place order", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      if (selectedPaymentMethod?.type !== "stripe") {
        setProcessingPayment(false);
      }
    }
  };

  // Step Navigation Functions
  const goToNextStep = () => {
    if (currentStep === 1 && selectedAddress) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedPaymentMethod) {
      if (selectedPaymentMethod.type === "stripe") {
        handlePlaceOrder();
      } else {
        setCurrentStep(3);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowStripeForm(false);
      setError(null);
    }
  };

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl mb-4">
            <LoadingSpinner size="lg" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading checkout...
          </h3>
        </div>
      </div>
    );
  }

  // Order placed state
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden flex items-center justify-center">
        <div className="text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/30">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your purchase. You will be redirected to your orders
            page.
          </p>
          <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, shipping, tax, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/30 rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-200/30 to-purple-200/40 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
              <Package className="text-white w-4 h-4" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Checkout
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {itemCount} item{itemCount !== 1 ? "s" : ""} ready for checkout
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            {[
              { step: 1, name: "Address", icon: MapPin },
              { step: 2, name: "Payment", icon: CreditCard },
              {
                step: 3,
                name:
                  selectedPaymentMethod?.type === "stripe"
                    ? "Complete"
                    : "Review",
                icon:
                  selectedPaymentMethod?.type === "stripe"
                    ? CheckCircle
                    : Package,
              },
            ].map(({ step, name, icon: Icon }, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 ${
                      currentStep >= step
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110"
                        : "bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="ml-3">
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        currentStep >= step
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      Step {step}
                    </span>
                    <p
                      className={`text-xs transition-colors duration-300 ${
                        currentStep >= step
                          ? "text-gray-600 dark:text-gray-300"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {name}
                    </p>
                  </div>
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 mx-4 h-1 rounded-full transition-all duration-500 ${
                      currentStep > step
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Global Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-700 rounded-2xl flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium mb-1">
                    Error
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Step 1: Address Selection */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md mr-3">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    Delivery Address
                  </h2>
                  {currentStep > 1 && selectedAddress && (
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="ghost"
                      className="text-blue-600 cursor-pointer hover:text-blue-800 text-sm bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Change
                    </Button>
                  )}
                </div>

                {currentStep === 1 ? (
                  loadingAddresses ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                        <LoadingSpinner />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mt-3">
                        Loading addresses...
                      </p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No addresses found. Please add an address to continue.
                      </p>
                      <Button
                        onClick={() => router.push("/profile/addresses")}
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address, index) => (
                        <div
                          key={address._id || index}
                          className={`border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            selectedAddress?._id === address._id
                              ? "border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md dark:from-blue-900/20 dark:to-purple-900/20"
                              : "border-gray-200 hover:border-gray-300 bg-white/50 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-gray-500"
                          }`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="flex items-center space-x-2">
                                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {address.firstName} {address.lastName}
                                  </p>
                                </div>
                                {address.isDefault && (
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                    <Star className="w-3 h-3 mr-1" />
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-start space-x-2">
                                  <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <div>
                                    <p className="text-gray-700 dark:text-gray-300">
                                      {address.address}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                      {address.city}, {address.state}{" "}
                                      {address.postalCode}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                      {address.country}
                                    </p>
                                  </div>
                                </div>
                                {address.phone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                      {address.phone}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 space-y-3">
                        {currentStep > 1 && (
                          <Button
                            onClick={goToPreviousStep}
                            variant="outline"
                            className="w-full py-3 rounded-2xl"
                          >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous Step
                          </Button>
                        )}
                        <Button
                          onClick={goToNextStep}
                          disabled={!selectedAddress}
                          className={`w-full cursor-pointer py-4 rounded-2xl font-semibold transition-all duration-300 p-6 ${
                            selectedAddress
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                          }`}
                        >
                          <Truck className="w-5 h-5 mr-2" />
                          Continue to Payment
                        </Button>
                      </div>
                    </div>
                  )
                ) : (
                  selectedAddress && (
                    <div className="border border-green-200 rounded-2xl p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:border-green-700 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800 dark:text-green-200">
                            {selectedAddress.firstName}{" "}
                            {selectedAddress.lastName}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            {selectedAddress.address}
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            {selectedAddress.city}, {selectedAddress.state}{" "}
                            {selectedAddress.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Step 2: Payment Method */}
            {currentStep >= 2 && (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md mr-3">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      Payment Method
                    </h2>
                    {currentStep > 2 && selectedPaymentMethod && (
                      <Button
                        onClick={() => setCurrentStep(2)}
                        variant="ghost"
                        className="cursor-pointer text-purple-600 hover:text-purple-800 text-sm bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-300"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Change
                      </Button>
                    )}
                  </div>

                  {currentStep === 2 ? (
                    <div className="space-y-6">
                      {/* Payment Method Selection */}
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              selectedPaymentMethod?.id === method.id
                                ? "border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-md dark:border-purple-600 dark:from-purple-900/20 dark:to-pink-900/20"
                                : "border-gray-200 hover:border-gray-300 bg-white/50 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-gray-500"
                            }`}
                            onClick={() => setSelectedPaymentMethod(method)}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                                  selectedPaymentMethod?.id === method.id
                                    ? "border-purple-500 bg-purple-500"
                                    : "border-gray-300 dark:border-gray-500"
                                }`}
                              >
                                {selectedPaymentMethod?.id === method.id && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                              </div>
                              <div className="flex items-center">
                                <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {method.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Stripe Payment Form */}
                      {selectedPaymentMethod?.type === "stripe" &&
                        showStripeForm &&
                        clientSecret && (
                          <div className="mt-6 border-t border-gray-200/50 dark:border-gray-600/50 pt-6">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
                              <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md mr-3">
                                  <Shield className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Secure Payment Details
                                </h3>
                              </div>

                              <StripeCheckoutForm
                                clientSecret={clientSecret}
                                amount={total * 100}
                                onPaymentSuccess={handleStripePaymentSuccess}
                                onPaymentError={handleStripePaymentError}
                              />
                            </div>
                          </div>
                        )}

                      <div className="pt-4 space-y-3">
                        <Button
                          onClick={goToPreviousStep}
                          variant="outline"
                          className="w-full py-3 rounded-2xl text-gray-400 cursor-pointer mb-4 hover:scale-103"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Previous Step
                        </Button>

                        <Button
                          onClick={goToNextStep}
                          disabled={!selectedPaymentMethod || stripeLoading}
                          className={`w-full cursor-pointer py-4 rounded-2xl font-semibold transition-all duration-300 ${
                            selectedPaymentMethod && !stripeLoading
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {stripeLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Initializing Payment...
                            </div>
                          ) : selectedPaymentMethod?.type === "stripe" ? (
                            <>
                              <Shield className="w-5 h-5 mr-2" />
                              Process Payment
                            </>
                          ) : (
                            <>
                              <Package className="w-5 h-5 mr-2" />
                              Review Order
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    selectedPaymentMethod && (
                      <div className="border border-purple-200 rounded-2xl p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:border-purple-700 dark:from-purple-900/20 dark:to-pink-900/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-purple-800 dark:text-purple-200">
                              {selectedPaymentMethod.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Order Review */}
            {currentStep >= 3 && selectedPaymentMethod?.type !== "stripe" && (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md mr-3">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    Order Review
                  </h2>

                  <div className="space-y-4 mb-6">
                    {cart?.items.map((item) => (
                      <div
                        key={item._id || item.productId}
                        className="flex space-x-4 border-b border-gray-200/50 dark:border-gray-600/50 pb-4 last:border-b-0 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-md">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 space-y-3">
                    <Button
                      onClick={goToPreviousStep}
                      variant="outline"
                      className="w-full py-3 rounded-2xl text-gray-400 hover:scale-103 cursor-pointer mb-4"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous Step
                    </Button>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={processingPayment}
                      className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-2xl font-semibold disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      {processingPayment ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          <span>Processing Order...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Shield className="w-5 h-5 mr-2" />
                          Place Order - {formatPrice(total)}
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="border-t border-gray-200/50 dark:border-gray-600/50 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Address Summary */}
              {selectedAddress && (
                <div className="mb-4 p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200/30 dark:border-green-700/30">
                  <div className="flex items-center text-green-800 dark:text-green-200">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Delivery Address</p>
                      <p className="text-xs text-green-600 dark:text-green-300">
                        {selectedAddress.city}, {selectedAddress.state}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Payment Method Summary */}
              {selectedPaymentMethod && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
                  <div className="flex items-center text-purple-800 dark:text-purple-200">
                    <CreditCard className="w-4 h-4 mr-2 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-xs text-purple-600 dark:text-purple-300">
                        {selectedPaymentMethod.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                <div className="flex items-start text-blue-800 dark:text-blue-200">
                  <Shield className="w-4 h-4 mr-2 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Secure Checkout</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
