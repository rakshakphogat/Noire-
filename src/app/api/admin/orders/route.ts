import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { NextRequest, NextResponse } from "next/server";
import { IOrder } from "@/app/types/Order";
import { FilterQuery } from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const filter: FilterQuery<IOrder> = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (paymentStatus && paymentStatus !== "all") {
      filter.paymentStatus = paymentStatus;
    }
    if (search) {
      filter.$or = [
        { _id: { $regex: search, $options: "i" } },
        // Search inside shipping name
        { "shippingAddress.firstName": { $regex: search, $options: "i" } },
        { "shippingAddress.lastName": { $regex: search, $options: "i" } },
        // Search by email or phone if available in shipping
        { "shippingAddress.phone": { $regex: search, $options: "i" } },
      ];
    }
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IOrder[]>();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
