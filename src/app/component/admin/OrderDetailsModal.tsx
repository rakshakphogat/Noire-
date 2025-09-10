"use client";

import Image from "next/image";
import { Package, User, MapPin, CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IOrder } from "@/app/types/Order";

interface OrderDetailsModalProps {
  order: IOrder;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: IOrder["status"]) => void;
  onPaymentStatusUpdate: (
    orderId: string,
    newPaymentStatus: "pending" | "paid" | "failed" | "refunded"
  ) => Promise<void>;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <DialogHeader className="border-b border-gray-200/50 dark:border-gray-600/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                Order #{order._id}
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Created on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                {new Date(order.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                {order.paymentStatus.charAt(0).toUpperCase() +
                  order.paymentStatus.slice(1)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <Card className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </Label>
                <p className="text-gray-900 dark:text-white">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress?.lastName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <p className="text-gray-900 dark:text-white">{order?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </Label>
                <p className="text-gray-900 dark:text-white">
                  {order.shippingAddress.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 dark:text-white">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-gray-600/50 rounded-lg"
                  >
                    <div className="w-16 h-16 relative">
                      <Image
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₹{item.price} × {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Subtotal:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{order.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Shipping:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{order.shipping.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Tax:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{order.tax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span className="text-gray-900 dark:text-white">
                      Total:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="mb-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Method
                    </Label>
                    <p className="text-gray-900 dark:text-white">
                      {order.paymentMethod.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Status
                    </Label>
                    <div className="mt-1">
                      <Badge
                        className={getPaymentStatusColor(order.paymentStatus)}
                      >
                        {order.paymentStatus.charAt(0).toUpperCase() +
                          order.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
