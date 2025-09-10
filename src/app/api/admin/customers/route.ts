import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  await connectDB();
  const customers = await User.find({ role: "customer" }).lean();
  const customerData = await Promise.all(
    customers.map(async (customer) => {
      const orderStats = await Order.aggregate([
        { $match: { userId: String(customer._id) } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$total" },
          },
        },
      ]);
      const stats = orderStats[0] || { totalOrders: 0, totalSpent: 0 };
      return {
        id: String(customer._id),
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone || "-",
        location: customer.addresses?.[0]
          ? `${customer.addresses[0].city}, ${customer.addresses[0].country}`
          : "N/A",
        joinDate: customer.createdAt.toISOString().split("T")[0],
        totalOrders: stats.totalOrders,
        totalSpent: `$${stats.totalSpent.toFixed(2)}`,
        status: customer.isActive ? "active" : "inactive",
        avatar: `${customer.firstName[0]}${customer.lastName[0]}`,
      };
    })
  );

  return NextResponse.json(customerData);
}
