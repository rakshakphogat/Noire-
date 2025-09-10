import {
  Badge,
  CheckCircle,
  Clock,
  CreditCard,
  Mail,
  Package,
  Shield,
  Star,
  Truck,
} from "lucide-react";
import React from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "@/lib/utils";

const OrderSummary = () => {
  const { cart, totalPrice, itemCount } = useCart();

  const calculateTotals = () => {
    const subtotal = cart?.subtotal || totalPrice;
    const shipping = cart?.shipping || (subtotal > 50 ? 0 : 10);
    const tax = cart?.tax || subtotal * 0.08;
    const total = cart?.total || subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  return (
    <div className="lg:col-span-1">
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-2xl shadow-2xl p-6 sticky top-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md mr-3">
            <Package className="w-3 h-3 text-white" />
          </div>
          Order Summary
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50/50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/50 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 flex items-center">
              <Package className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50/50 to-green-50/50 dark:from-gray-700/50 dark:to-green-900/50 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 flex items-center">
              <Truck className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              Shipping
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {shipping === 0 ? (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  Free
                </Badge>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50/50 to-purple-50/50 dark:from-gray-700/50 dark:to-purple-900/50 rounded-xl">
            <span className="text-gray-600 dark:text-gray-400 flex items-center">
              <CreditCard className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
              Tax
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatPrice(tax)}
            </span>
          </div>

          <div className="border-t border-gray-200/50 dark:border-gray-600/50 pt-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/50">
              <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Total
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Shipping Info */}
          {subtotal > 50 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-700 rounded-xl">
              <div className="flex items-center text-green-700 dark:text-green-300">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Free shipping unlocked!
                </span>
              </div>
            </div>
          )}

          {/* Estimated Delivery */}
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-600" />
              Estimated Delivery
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(
                Date.now() + 3 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              3-5 business days
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center text-center p-4 bg-gradient-to-r from-green-50/50 to-blue-50/50 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl border border-green-200/30 dark:border-green-700/30">
          <Shield className="w-5 h-5 text-green-600 mr-2" />
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              Secure Checkout
            </p>
            <p className="text-xs text-green-600 dark:text-green-300">
              256-bit SSL encryption
            </p>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200/30 dark:border-yellow-700/30">
          <div className="flex items-center text-yellow-800 dark:text-yellow-200">
            <Star className="w-4 h-4 mr-2 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">30-Day Money Back</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-300">
                Satisfaction guaranteed
              </p>
            </div>
          </div>
        </div>

        {/* Customer Support */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
          <div className="flex items-center text-purple-800 dark:text-purple-200">
            <Mail className="w-4 h-4 mr-2 text-purple-600" />
            <div>
              <p className="text-sm font-medium">24/7 Support</p>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                We&apos;re here to help
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
