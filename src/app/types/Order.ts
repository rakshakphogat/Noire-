import { Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color: string;
  size: string;
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
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

export interface IOrder extends Document {
  _id: string;
  userId: string;
  email: string;
  items: IOrderItem[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod: {
    type: string;
    name: string;
    stripePaymentIntentId?: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentStatus: "pending" | "paid" | "unpaid";
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  type: "cod" | "stripe";
  name: string;
  details?: string;
}

export interface IAddress {
  _id?: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderData {
  items: IOrderItem[];
  address: IAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: string;
}
