import mongoose, { Schema } from "mongoose";
import { IOrder } from "@/app/types/Order";

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
    },
    paymentMethod: {
      type: { type: String, required: true },
      name: { type: String, required: true },
      stripePaymentIntentId: {
        type: String,
        required: false,
      },
    },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "unpaid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
