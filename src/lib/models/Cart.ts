import mongoose, { Schema } from "mongoose";
import { ICartItem, ICart } from "@/app/types/Cart";

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    shippingMethod: String,
    estimatedDelivery: Date,
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1, sessionId: 1 });

CartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce((sum, item) => {
    const itemPrice = item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  this.tax = this.subtotal * 0.08;
  this.total = this.subtotal + this.tax + this.shipping;
  next();
});

export default mongoose.models.Cart ||
  mongoose.model<ICart>("Cart", CartSchema);
