import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IAddress } from "@/app/types/Order";

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  profileImage?: string;

  // Address management
  addresses: IAddress[];
  authProvider: "local" | "google";

  // User preferences
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
    language: string;
    currency: string;
  };

  // Account status
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;

  // Security
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;

  // Social login
  googleId?: string;
  facebookId?: string;

  // User role and permissions
  role: "customer" | "admin" | "moderator";
  permissions?: string[];

  // Order history reference (you might want to keep this for quick access)
  orderCount: number;
  totalSpent: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtual methods
  fullName: string;
  isLocked: boolean;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Address subdocument schema
const AddressSchema = new Schema<IAddress>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
      maxlength: [200, "Address cannot exceed 200 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [50, "City cannot exceed 50 characters"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      minlength: [2, "State must be at least 2 characters"],
      maxlength: [50, "State cannot exceed 50 characters"],
    },
    postalCode: {
      type: String,
      required: [true, "Postal code is required"],
      trim: true,
      minlength: [2, "Postal code must be at least 2 characters"],
      maxlength: [20, "Postal code cannot exceed 20 characters"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      minlength: [2, "Country must be at least 2 characters"],
      maxlength: [50, "Country cannot exceed 50 characters"],
      default: "India",
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password must be at least 5 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return !v || /^[\+]?[1-9][\d]{0,15}$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (v: Date) {
          return !v || v < new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other", "prefer_not_to_say"],
        message:
          "Gender must be one of: male, female, other, prefer_not_to_say",
      },
    },
    profileImage: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: "Please enter a valid image URL",
      },
    },

    // Addresses array
    addresses: [AddressSchema],

    // Account verification status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Security fields
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,

    // Social login IDs
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },

    // Role and permissions
    role: {
      type: String,
      enum: {
        values: ["customer", "admin", "moderator"],
        message: "Role must be one of: customer, admin, moderator",
      },
      default: "customer",
    },
    permissions: [
      {
        type: String,
        enum: [
          "read_products",
          "write_products",
          "read_users",
          "write_users",
          "read_orders",
          "write_orders",
          "read_analytics",
          "manage_system",
        ],
      },
    ],

    // Order statistics
    orderCount: {
      type: Number,
      default: 0,
      min: [0, "Order count cannot be negative"],
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: [0, "Total spent cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ "addresses.isDefault": 1 });

// Virtual for full name
UserSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for checking if account is locked
UserSchema.virtual("isLocked").get(function (this: IUser) {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware to ensure only one default address
UserSchema.pre("save", function (next) {
  if (this.isModified("addresses")) {
    const defaultAddresses = this.addresses.filter((addr) => addr.isDefault);
    // If more than one default address, keep only the first one
    if (defaultAddresses.length > 1) {
      this.addresses.forEach((addr, index) => {
        if (index > 0 && addr.isDefault) {
          addr.isDefault = false;
        }
      });
    }
  }
  next();
});

UserSchema.methods.addAddress = function (addressData: Omit<IAddress, "_id">) {
  // If this is set as default, remove default from other addresses
  if (addressData.isDefault) {
    this.addresses.forEach((addr: IAddress) => {
      addr.isDefault = false;
    });
  }
  // If no addresses exist and this isn't explicitly set to not default, make it default
  if (this.addresses.length === 0 && addressData.isDefault !== false) {
    addressData.isDefault = true;
  }
  this.addresses.push(addressData);
  return this.save();
};

UserSchema.methods.updateAddress = function (
  addressId: string,
  updateData: Partial<IAddress>
) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error("Address not found");
  }
  // If setting this as default, remove default from others
  if (updateData.isDefault) {
    this.addresses.forEach((addr: IAddress) => {
      if (addr._id?.toString() !== addressId) {
        addr.isDefault = false;
      }
    });
  }
  Object.assign(address, updateData);
  return this.save();
};

UserSchema.methods.removeAddress = function (addressId: string) {
  const address = this.addresses.id(addressId);
  if (!address) {
    throw new Error("Address not found");
  }
  const wasDefault = address.isDefault;
  address.deleteOne();
  // If removed address was default and there are other addresses, make the first one default
  if (wasDefault && this.addresses.length > 0) {
    this.addresses[0].isDefault = true;
  }
  return this.save();
};

UserSchema.methods.getDefaultAddress = function (): IAddress | null {
  return this.addresses.find((addr: IAddress) => addr.isDefault) || null;
};

UserSchema.methods.addToWishlist = function (productId: string) {
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
    return this.save();
  }
  return Promise.resolve(this);
};

UserSchema.methods.incrementOrderStats = function (orderAmount: number) {
  this.orderCount += 1;
  this.totalSpent += orderAmount;
  return this.save();
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.log(error);
    console.error("Password comparison error:", error);
    return false;
  }
};

UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true });
};

UserSchema.statics.findByRole = function (role: string) {
  return this.find({ role });
};

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
