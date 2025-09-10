// types/admin.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  subcategory: string;
  brand: string;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: ShippingAddress;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  status: "active" | "inactive";
}
