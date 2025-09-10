import { connectDB } from "@/lib/db";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const totalProducts = await Product.countDocuments();
    // const totalValue = await Product.aggregate([
    //   { $group: { _id: null, total: { $sum: "$price" } } },
    // ]);
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({
      status: "completed",
    });
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;
    // const featuredCount = await Product.countDocuments({ isFeatured: true });
    const totalCustomers = await User.countDocuments();
    const stats = {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      pendingOrders,
      completedOrders,
    };
    return NextResponse.json(stats);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
