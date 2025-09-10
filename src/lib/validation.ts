import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export const resetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const confirmResetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export const addressSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const addItemToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  color: z.string().min(1, "Please select a valid color"),
  size: z.string().min(1, "Please select valid size"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
  quantity: z
    .number()
    .int()
    .min(0, "Quantity must be 0 or more")
    .max(50, "Maximum quantity is 50"),
});

export const setShippingSchema = z.object({
  shippingMethod: z
    .enum(["standard", "express", "overnight", "pickup"])
    .refine(
      (item) => ["standard", "express", "overnight", "pickup"].includes(item),
      { message: "Invalid shipping method" }
    ),
});
