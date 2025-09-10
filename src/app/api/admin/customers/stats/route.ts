import { User } from "@/lib/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const totalCustomers = await User.countDocuments({});
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const newThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const activeCustomers = await User.countDocuments({ isActive: true });
    return NextResponse.json({
      success: true,
      stats: {
        totalCustomers,
        newThisMonth,
        activeCustomersPercentage:
          totalCustomers > 0
            ? ((activeCustomers / totalCustomers) * 100).toFixed(0)
            : "0",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
