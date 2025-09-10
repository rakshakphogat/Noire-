import { connectDB } from "./db";
import Cart from "./models/Cart";
import { ICart, ICartItem } from "../app/types/Cart";
import { Product } from "./models/Product";

export interface CartIdentifier {
  userId?: string;
  sessionId?: string;
}

export class CartService {
  static async findOrCreateCart(identifier: CartIdentifier): Promise<ICart> {
    await connectDB();
    const query = identifier.userId
      ? { userId: identifier.userId }
      : { sessionId: identifier.sessionId };
    let cart = await Cart.findOne(query);
    if (!cart) {
      cart = new Cart(identifier);
      await cart.save();
    }
    return cart;
  }

  static async addItemToCart(
    identifier: CartIdentifier,
    productId: string,
    color: string,
    size: string,
    quantity: number
  ): Promise<ICart> {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    const cart = await this.findOrCreateCart(identifier);
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (existingItemIndex > -1) {
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      const cartItem: ICartItem = {
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        quantity,
        color,
        size,
      };
      cart.items.push(cartItem);
    }
    await cart.save();
    return cart;
  }

  static async updateItemQuantity(
    identifier: CartIdentifier,
    productId: string,
    quantity: number
  ): Promise<ICart> {
    await connectDB();
    if (quantity <= 0) {
      return this.removeItemFromCart(identifier, productId);
    }
    const cart = await this.findOrCreateCart(identifier);
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex === -1) {
      throw new Error("Item not found");
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product Not Found");
    }
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return cart;
  }

  static async removeItemFromCart(
    identifier: CartIdentifier,
    productId: string
  ): Promise<ICart> {
    await connectDB();
    const cart = await this.findOrCreateCart(identifier);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();
    return cart;
  }

  static async clearCart(identifier: CartIdentifier): Promise<ICart> {
    await connectDB();
    const cart = await this.findOrCreateCart(identifier);
    cart.items = [];
    cart.shippingMethod = "";
    cart.shipping = 0;
    await cart.save();
    return cart;
  }

  static async setShippingMethod(
    identifier: CartIdentifier,
    shippingMethod: string
  ): Promise<ICart> {
    await connectDB();
    const shippingRates: { [key: string]: number } = {
      standard: 6,
      express: 13,
      overnight: 26,
      pickup: 0,
    };
    if (!shippingRates.hasOwnProperty(shippingMethod)) {
      throw new Error("invalid shipping method");
    }
    const cart = await this.findOrCreateCart(identifier);
    cart.shippingMethod = shippingMethod;
    cart.shipping = shippingRates[shippingMethod];
    const deliveryDays: { [key: string]: number } = {
      standard: 7,
      express: 3,
      overnight: 1,
      pickup: 0,
    };
    if (shippingMethod !== "pickup") {
      cart.estimatedDelivery = new Date(
        Date.now() + deliveryDays[shippingMethod] * 24 * 60 * 60 * 1000
      );
    }
    await cart.save();
    return cart;
  }

  static async transferGuestCart(
    sessionId: string,
    userId: string
  ): Promise<ICart | null> {
    await connectDB();
    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) {
      return null;
    }
    const userCart = await Cart.findOne({ userId });
    if (userCart) {
      for (const guestItem of guestCart.items) {
        const existingItemIndex = userCart.items.findIndex(
          (item: ICartItem) => item.productId === guestItem.productId
        );
        if (existingItemIndex > -1) {
          const newQuantity =
            userCart.items[existingItemIndex].quantity + guestItem.quantity;
          userCart.items[existingItemIndex].quantity = Math.min(
            newQuantity,
            guestItem.maxQuantity
          );
        } else {
          userCart.items.push(guestItem);
        }
      }
      if (guestCart.shippingMethod && !userCart.shippingMethod) {
        userCart.shippingMethod = guestCart.shippingMethod;
        userCart.shipping = guestCart.shipping;
        userCart.estimatedDelivery = guestCart.estimatedDelivery;
      }
      await userCart.save();
      await Cart.findByIdAndDelete(guestCart._id);
      return userCart;
    } else {
      guestCart.userId = userId;
      guestCart.sessionId = undefined;
      await guestCart.save();
      return guestCart;
    }
  }
}
