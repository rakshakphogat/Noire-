import { Document } from "mongoose";

export interface ICartItem {
  _id?: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
}

export interface ICart extends Document {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shippingMethod: string;
  estimatedDelivery?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartContextType {
  cart: ICart | null;
  loading: boolean;
  itemCount: number;
  totalPrice: number;
  addToCart: (
    productId: string,
    color: string,
    size: string,
    quantity?: number
  ) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setShippingMethod: (method: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  transferGuestCart: () => Promise<void>;
}
