import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  subcategory: string;
  brand: string;
  stock: number;
  images: string[];
  sizes: string[];
  colors: string[];
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  status: "active" | "inactive" | "draft";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    description:
      "High-quality cotton t-shirt with comfortable fit and modern design.",
    price: 29.99,
    discountPrice: 24.99,
    category: "clothing",
    subcategory: "shirts",
    brand: "StyleCo",
    stock: 150,
    images: ["/products/tshirt1.jpg", "/products/tshirt1-2.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["black", "white", "navy", "gray"],
    sku: "TSH-001",
    weight: 0.2,
    dimensions: {
      length: 25,
      width: 20,
      height: 1,
    },
    tags: ["cotton", "casual", "comfortable"],
    status: "active",
    featured: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Denim Jeans Classic Fit",
    description: "Classic fit denim jeans made from premium denim fabric.",
    price: 79.99,
    category: "clothing",
    subcategory: "pants",
    brand: "DenimCo",
    stock: 85,
    images: ["/products/jeans1.jpg", "/products/jeans1-2.jpg"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["dark-blue", "light-blue", "black"],
    sku: "JNS-001",
    weight: 0.8,
    dimensions: {
      length: 42,
      width: 16,
      height: 2,
    },
    tags: ["denim", "casual", "classic"],
    status: "active",
    featured: false,
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-18T11:15:00Z",
  },
  {
    id: "3",
    name: "Running Shoes Pro",
    description:
      "Professional running shoes with advanced cushioning technology.",
    price: 129.99,
    discountPrice: 99.99,
    category: "footwear",
    subcategory: "athletic",
    brand: "SportTech",
    stock: 45,
    images: [
      "/products/shoes1.jpg",
      "/products/shoes1-2.jpg",
      "/products/shoes1-3.jpg",
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["black", "white", "red", "blue"],
    sku: "SHO-001",
    weight: 0.6,
    dimensions: {
      length: 32,
      width: 12,
      height: 10,
    },
    tags: ["running", "athletic", "cushioned"],
    status: "active",
    featured: true,
    createdAt: "2024-01-12T12:00:00Z",
    updatedAt: "2024-01-22T16:45:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    let filteredProducts = [...mockProducts];
    // Apply filters
    if (category && category !== "all") {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category
      );
    }
    if (status && status !== "all") {
      filteredProducts = filteredProducts.filter((p) => p.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower)
      );
    }
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      discountPrice: formData.get("discountPrice")
        ? parseFloat(formData.get("discountPrice") as string)
        : undefined,
      category: formData.get("category") as string,
      subcategory: formData.get("subcategory") as string,
      brand: formData.get("brand") as string,
      stock: parseInt(formData.get("stock") as string),
      images: [],
      sizes: JSON.parse((formData.get("sizes") as string) || "[]"),
      colors: JSON.parse((formData.get("colors") as string) || "[]"),
      sku: formData.get("sku") as string,
      weight: formData.get("weight")
        ? parseFloat(formData.get("weight") as string)
        : undefined,
      dimensions: formData.get("dimensions")
        ? JSON.parse(formData.get("dimensions") as string)
        : undefined,
      tags: JSON.parse((formData.get("tags") as string) || "[]"),
      status:
        (formData.get("status") as "active" | "inactive" | "draft") || "draft",
      featured: formData.get("featured") === "true",
    };
    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    const imageUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Generate unique filename
        const filename = `${Date.now()}-${i}-${file.name}`;
        const filepath = path.join(
          process.cwd(),
          "public/uploads/products",
          filename
        );
        // Save file
        await writeFile(filepath, buffer);
        imageUrls.push(`/uploads/products/${filename}`);
      }
    }
    // Create new product
    const newProduct: Product = {
      ...productData,
      id: (mockProducts.length + 1).toString(),
      images: imageUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(newProduct);
    return NextResponse.json(
      {
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const formData = await request.formData();
    const existingProductIndex = mockProducts.findIndex(
      (p) => p.id === productId
    );
    if (existingProductIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const existingProduct = mockProducts[existingProductIndex];
    // Extract updated product data
    const updatedData: Partial<Product> = {
      name: (formData.get("name") as string) || existingProduct.name,
      description:
        (formData.get("description") as string) || existingProduct.description,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : existingProduct.price,
      discountPrice: formData.get("discountPrice")
        ? parseFloat(formData.get("discountPrice") as string)
        : existingProduct.discountPrice,
      category:
        (formData.get("category") as string) || existingProduct.category,
      subcategory:
        (formData.get("subcategory") as string) || existingProduct.subcategory,
      brand: (formData.get("brand") as string) || existingProduct.brand,
      stock: formData.get("stock")
        ? parseInt(formData.get("stock") as string)
        : existingProduct.stock,
      sizes: formData.get("sizes")
        ? JSON.parse(formData.get("sizes") as string)
        : existingProduct.sizes,
      colors: formData.get("colors")
        ? JSON.parse(formData.get("colors") as string)
        : existingProduct.colors,
      sku: (formData.get("sku") as string) || existingProduct.sku,
      weight: formData.get("weight")
        ? parseFloat(formData.get("weight") as string)
        : existingProduct.weight,
      dimensions: formData.get("dimensions")
        ? JSON.parse(formData.get("dimensions") as string)
        : existingProduct.dimensions,
      tags: formData.get("tags")
        ? JSON.parse(formData.get("tags") as string)
        : existingProduct.tags,
      status:
        (formData.get("status") as "active" | "inactive" | "draft") ||
        existingProduct.status,
      featured: formData.get("featured")
        ? formData.get("featured") === "true"
        : existingProduct.featured,
      updatedAt: new Date().toISOString(),
    };
    // Handle new image uploads
    const imageFiles = formData.getAll("newImages") as File[];
    const newImageUrls: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${i}-${file.name}`;
        const filepath = path.join(
          process.cwd(),
          "public/uploads/products",
          filename
        );
        await writeFile(filepath, buffer);
        newImageUrls.push(`/uploads/products/${filename}`);
      }
    }
    // Combine existing images with new ones (if any)
    const keepExistingImages = formData.get("keepExistingImages") === "true";
    updatedData.images = keepExistingImages
      ? [...existingProduct.images, ...newImageUrls]
      : newImageUrls.length > 0
      ? newImageUrls
      : existingProduct.images;
    // Update product
    const updatedProduct = { ...existingProduct, ...updatedData };
    mockProducts[existingProductIndex] = updatedProduct;
    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const productIndex = mockProducts.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // Remove product from mock database
    mockProducts.splice(productIndex, 1);
    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
