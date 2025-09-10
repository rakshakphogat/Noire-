"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  category: string;
  subcategory: string;
  brand: string;
  stock: number;
  images: File[];
  sizes: string[];
  colors: string[];
  status: string;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onProductAdded,
}: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    discountPrice: 0,
    category: "",
    subcategory: "",
    brand: "",
    stock: 0,
    images: [],
    sizes: [],
    colors: [],
    status: "active",
  });

  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const categories = [
    "Men's Clothing",
    "Women's Clothing",
    "Kids' Clothing",
    "Accessories",
    "Footwear",
    "Bags",
  ];

  const subcategories = {
    "Men's Clothing": [
      "Shirts",
      "T-Shirts",
      "Jeans",
      "Trousers",
      "Jackets",
      "Suits",
    ],
    "Women's Clothing": [
      "Dresses",
      "Tops",
      "Jeans",
      "Skirts",
      "Jackets",
      "Kurtis",
    ],
    "Kids' Clothing": ["Boys", "Girls", "Baby", "Toddler"],
    Accessories: ["Watches", "Jewelry", "Belts", "Wallets", "Sunglasses"],
    Footwear: [
      "Men's Shoes",
      "Women's Shoes",
      "Kids' Shoes",
      "Sneakers",
      "Sandals",
    ],
    Bags: ["Handbags", "Backpacks", "Travel Bags", "Laptop Bags"],
  };

  const handleInputChange = <K extends keyof ProductData>(
    field: K,
    value: ProductData[K]
  ) => {
    setProductData({ ...productData, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setProductData({
        ...productData,
        images: [...productData.images, ...files],
      });
      // Create previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = productData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setProductData({ ...productData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const addSize = () => {
    if (newSize && !productData.sizes.includes(newSize)) {
      setProductData({
        ...productData,
        sizes: [...productData.sizes, newSize],
      });
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setProductData({
      ...productData,
      sizes: productData.sizes.filter((s) => s !== size),
    });
  };

  const addColor = () => {
    if (newColor && !productData.colors.includes(newColor)) {
      setProductData({
        ...productData,
        colors: [...productData.colors, newColor],
      });
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setProductData({
      ...productData,
      colors: productData.colors.filter((c) => c !== color),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      // Append product data
      Object.entries(productData).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((file: File) => {
            formData.append("images", file);
          });
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onProductAdded();
        onClose();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.message || "Error creating product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      price: 0,
      discountPrice: 0,
      category: "",
      subcategory: "",
      brand: "",
      stock: 0,
      images: [],
      sizes: [],
      colors: [],
      status: "active",
    });
    setImagePreviews([]);
    setNewSize("");
    setNewColor("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={productData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    className="bg-white/80 dark:bg-gray-600/80"
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={productData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                    required
                    className="bg-white/80 dark:bg-gray-600/80"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={productData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/80 dark:bg-gray-600/80"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory *</Label>
                  <select
                    id="subcategory"
                    value={productData.subcategory}
                    onChange={(e) =>
                      handleInputChange("subcategory", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/80 dark:bg-gray-600/80"
                  >
                    <option value="">Select Subcategory</option>
                    {productData.category &&
                      subcategories[
                        productData.category as keyof typeof subcategories
                      ]?.map((subcat) => (
                        <option key={subcat} value={subcat}>
                          {subcat}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={productData.price}
                    onChange={(e) =>
                      handleInputChange("price", Number(e.target.value))
                    }
                    required
                    min="0"
                    className="bg-white/80 dark:bg-gray-600/80"
                  />
                </div>
                <div>
                  <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    value={productData.discountPrice}
                    onChange={(e) =>
                      handleInputChange("discountPrice", Number(e.target.value))
                    }
                    min="0"
                    className="bg-white/80 dark:bg-gray-600/80"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productData.stock}
                    onChange={(e) =>
                      handleInputChange("stock", Number(e.target.value))
                    }
                    required
                    min="0"
                    className="bg-white/80 dark:bg-gray-600/80"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={productData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white/80 dark:bg-gray-600/80"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  required
                  rows={4}
                  className="bg-white/80 dark:bg-gray-600/80"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Product Images
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="images">Upload Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="bg-white/80 dark:bg-gray-600/80"
                  />
                </div>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sizes and Colors */}
          <Card className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Variations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sizes */}
                <div>
                  <Label>Available Sizes</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="Enter size (e.g., S, M, L, XL)"
                      className="bg-white/80 dark:bg-gray-600/80"
                    />
                    <Button type="button" onClick={addSize} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {productData.sizes.map((size) => (
                      <div
                        key={size}
                        className="flex items-center bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-md"
                      >
                        <span className="text-sm">{size}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSize(size)}
                          className="ml-1 h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <Label>Available Colors</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Enter color (e.g., Red, Blue, Black)"
                      className="bg-white/80 dark:bg-gray-600/80"
                    />
                    <Button type="button" onClick={addColor} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {productData.colors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center bg-pink-100 dark:bg-pink-900/30 px-2 py-1 rounded-md"
                      >
                        <span className="text-sm">{color}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColor(color)}
                          className="ml-1 h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
