import { Order } from "@/lib/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const recentOrders = await Order.find({});
    return NextResponse.json(recentOrders);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}
