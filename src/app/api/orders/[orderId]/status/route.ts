import { requireAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/lib/models/Order";
import { sendOrderStatusUpdateEmail } from "@/lib/email";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const { orderId } = await params;
    const { status, trackingNumber } = await req.json();
    const order = await Order.findOneAndUpdate(
      { _id: orderId, userId: authResult.user._id },
      {
        status,
        ...(trackingNumber && { trackingNumber }),
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    // Send status update email
    await sendOrderStatusUpdateEmail(
      authResult.user.email,
      `${authResult.user.firstName} ${authResult.user.lastName}`,
      order._id.toString(),
      status,
      trackingNumber
    );
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
