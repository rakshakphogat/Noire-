import { requireAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/lib/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const order = await Order.findOne({
      _id: params.orderId,
      userId: authResult.user._id,
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
