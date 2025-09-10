"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import { ICart } from "../types/Cart";
import { CartContextType } from "../types/Cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

const getSessionId = (): string => {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("cart-session-id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("cart-session-id", sessionId);
  }
  return sessionId;
};

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const sessionId = getSessionId();
  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  return headers;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ICart | null>(null);
  const [loading, setLoading] = useState(true);

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = cart?.total || 0;

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart", {
        method: "GET",
        headers: getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.cart);
        if (data.sessionId && !localStorage.getItem("auth-token")) {
          localStorage.setItem("cart-session-id", data.sessionId);
        }
      }
    } catch (error) {
      console.log("Failed to fetch cart", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productId: string,
    color: string,
    size: string,
    quantity: number = 1
  ) => {
    try {
      const isItemInCart = cart?.items?.some(
        (item) =>
          item.productId === productId &&
          item.color === color &&
          item.size === size
      );

      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ productId, color, size, quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);

        if (quantity === 0) {
          toast.success("Item removed from cart");
        } else if (!isItemInCart) {
          toast.success("Item added to cart");
        } else {
          toast.success("Quantity updated");
        }
      } else {
        throw new Error(data.error || "Failed to update quantity");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
        if (quantity === 0) {
          toast.success("Item removed from cart");
        } else {
          toast.success("Quantity updated");
        }
      } else {
        throw new Error("Failed to update quantity");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
        toast.success("Item removed from cart");
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      toast.error("Failed to remove item");
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart);
        toast.success("Cart cleared");
      } else {
        throw new Error("failed to clear cart");
      }
    } catch (error) {
      toast.error("Failed to clear cart");
      throw error;
    }
  };

  const setShippingMethod = async (method: string) => {
    try {
      const response = await fetch("/api/cart/shipping", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ shippingMethod: method }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
        toast.success("Shipping method updated");
      } else {
        throw new Error("Failed to update shipping method");
      }
    } catch (error) {
      toast.error("Failed to update shipping method");
      throw error;
    }
  };

  const transferGuestCart = async () => {
    try {
      const sessionId = localStorage.getItem("cart-session-id");
      if (!sessionId) return;

      const response = await fetch("/api/cart/transfer", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      if (response.ok && data.cart) {
        setCart(data.cart);
        localStorage.removeItem("cart-session-id");
        toast.success("Cart transferred successfully");
      }
    } catch (error) {
      console.error("Failed to transfer cart");
      throw error;
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const value: CartContextType = {
    cart,
    loading,
    itemCount,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    setShippingMethod,
    refreshCart,
    transferGuestCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
