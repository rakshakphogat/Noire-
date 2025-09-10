"use client";

import { useState, useEffect } from "react";
import { Package, Star, Plus, X, Upload, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AdminLayout from "@/app/component/admin/AdminLayout";
import { useAdminContext } from "@/app/context/AdminContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Product interface as provided
export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  type: string;
  sizes: string[];
  colors: string[];
  images: string[];
  isFeatured: boolean;
}

interface ProductFormData {
  name: string;
  price: number;
  category: string;
  type: string;
  sizes: string[];
  colors: string[];
  images: string[];
  isFeatured: boolean;
}

export default function AdminProductsPage() {
  const { isAuthenticated, loading: authLoading, admin } = useAdminContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    category: "",
    type: "",
    sizes: [],
    colors: [],
    images: [],
    isFeatured: false,
  });

  // Input states for adding sizes, colors, and images
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
      return;
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");

      if (response.ok) {
        const productsData = await response.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }));
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const removeImage = (image: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      category: "",
      type: "",
      sizes: [],
      colors: [],
      images: [],
      isFeatured: false,
    });
    setNewSize("");
    setNewColor("");
    setNewImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.type.trim() ||
      formData.price <= 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setFormLoading(true);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newProduct = await response.json();
        setProducts((prev) => [newProduct, ...prev]);
        resetForm();
        setShowAddForm(false);
        alert("Product added successfully!");
      } else {
        const error = await response.json();
        alert(`Error adding product: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Verifying access...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated || !admin) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading products...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 mt-10 mx-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
              Products Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage your store products ({products.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showAddForm ? "Cancel" : "Add Product"}
            </Button>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-400 ">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange(
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        placeholder="e.g., Clothing, Electronics"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Input
                        id="type"
                        value={formData.type}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                        placeholder="e.g., T-Shirt, Laptop"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.isFeatured}
                        onCheckedChange={(checked) =>
                          handleInputChange("isFeatured", checked)
                        }
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>

                  {/* Arrays: Sizes, Colors, Images */}
                  <div className="space-y-4">
                    {/* Sizes */}
                    <div className="space-y-2">
                      <Label>Sizes</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newSize}
                          onChange={(e) => setNewSize(e.target.value)}
                          placeholder="Enter size"
                          onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addSize())
                          }
                        />
                        <Button type="button" onClick={addSize} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.sizes.map((size, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {size}
                            <button
                              type="button"
                              onClick={() => removeSize(size)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-2">
                      <Label>Colors</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newColor}
                          onChange={(e) => setNewColor(e.target.value)}
                          placeholder="Enter color"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addColor())
                          }
                        />
                        <Button type="button" onClick={addColor} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.colors.map((color, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Images */}
                    <div className="space-y-2">
                      <Label>Product Images</Label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder="Enter image URL"
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addImage())
                          }
                        />
                        <Button type="button" onClick={addImage} size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.images.map((image, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded"
                          >
                            <Image
                              src={image}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover rounded"
                            />
                            <span className="flex-1 text-sm truncate">
                              {image}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(image)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setShowAddForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {formLoading ? "Adding Product..." : "Add Product"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-sm">
                <Package className="h-4 w-4 text-blue-500" />
                Total Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {products.length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                All products in catalog
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-sm">
                <Star className="h-4 w-4 text-purple-500" />
                Featured Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {products.filter((p) => p.isFeatured).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Currently featured
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white text-sm">
                <Package className="h-4 w-4 text-green-500" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {new Set(products.map((p) => p.category)).size}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Unique categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-white/20 dark:border-gray-700/30 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-gray-900 dark:text-white text-lg">
              All Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      {product.images && product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="object-cover rounded-lg border"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                            {product.name}
                          </h3>
                          {product.isFeatured && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                            >
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                          {product.category} • {product.type}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{product.sizes.length} sizes</span>
                          <span>{product.colors.length} colors</span>
                          <span>{product.images.length} images</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="font-bold text-lg text-gray-900 dark:text-white mr-5">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-sm">
                    Get started by adding your first product.
                  </p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
