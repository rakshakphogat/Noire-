import { NextRequest, NextResponse } from "next/server";

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
  rating: number;
  reviewCount: number;
  status: "active" | "inactive" | "draft";
  createdAt: string;
  updatedAt: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    description: "Ultra-soft premium cotton t-shirt with modern fit",
    price: 1299,
    discountPrice: 999,
    category: "Men's Clothing",
    subcategory: "T-Shirts",
    brand: "Noiré",
    stock: 45,
    images: ["/api/placeholder/400/400"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy"],
    rating: 4.5,
    reviewCount: 127,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Designer Denim Jeans",
    description: "Premium denim jeans with perfect fit and comfort",
    price: 3499,
    category: "Men's Clothing",
    subcategory: "Jeans",
    brand: "Noiré",
    stock: 23,
    images: ["/api/placeholder/400/400"],
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue", "Black", "Dark Blue"],
    rating: 4.3,
    reviewCount: 89,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Elegant Silk Dress",
    description: "Beautiful silk dress perfect for special occasions",
    price: 5999,
    discountPrice: 4799,
    category: "Women's Clothing",
    subcategory: "Dresses",
    brand: "Noiré",
    stock: 8,
    images: ["/api/placeholder/400/400"],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red", "Black", "Navy"],
    rating: 4.8,
    reviewCount: 156,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    return NextResponse.json(products);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    products[productIndex] = {
      ...products[productIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({
      message: "Product updated successfully",
      product: products[productIndex],
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    products.splice(productIndex, 1);
    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
