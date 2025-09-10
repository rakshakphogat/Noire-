import { Schema } from "mongoose";
import mongoose from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
    price: {
      type: Number,
      min: 0,
      required: [true, "price is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
      enum: ["Men", "Women", "Kids"],
    },
    type: {
      type: String,
      required: [true, "category is required"],
      enum: ["Tops", "Bottoms", "Outerwear"],
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
    },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
