import { requireAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/lib/models/Order"; // You'll need to create this model
import { sendOrderConfirmationEmail } from "@/lib/email";
import { IOrderItem } from "@/app/types/Order";

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const orderData = await req.json();
    const paymentStatus =
      orderData.paymentMethod.type === "cod" ? "pending" : "unpaid";
    // Create new order
    const order = new Order({
      email: authResult.user.email,
      userId: authResult.user._id,
      items: orderData.items,
      shippingAddress: orderData.address,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      paymentStatus: paymentStatus,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      status: "pending",
      color: orderData.color,
      size: orderData.size,
      createdAt: new Date(),
    });
    await order.save();
    if (orderData.paymentMethod.type === "cod") {
      order.status = "confirmed";
      await order.save();
      try {
        await sendOrderConfirmationEmail({
          orderId: order._id.toString(),
          customerEmail: authResult.user.email,
          customerName: `${authResult.user.firstName} ${authResult.user.lastName}`,
          items: order.items.map((item: IOrderItem) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          })),
          total: order.total,
          shippingAddress: order.shippingAddress,
        });
      } catch (error) {
        console.log("Error sending mail", error);
      }
    }
    return NextResponse.json(
      {
        success: true,
        orderId: order._id,
        message: "Order placed successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const orders = await Order.find({ userId: authResult.user._id }).sort({
      createdAt: -1,
    });
    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
