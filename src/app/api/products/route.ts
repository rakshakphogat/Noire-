import { connectDB } from "@/lib/db";
import { Product } from "@/lib/models/Product";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create Product", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products", error },
      { status: 500 }
    );
  }
}
