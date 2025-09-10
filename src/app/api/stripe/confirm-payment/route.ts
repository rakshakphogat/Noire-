import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { requireAuth } from "@/lib/middleware";
import { Order } from "@/lib/models/Order";

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const { paymentIntentId, orderId } = await req.json();
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === "succeeded") {
      // Update the order status
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status: "confirmed",
          paymentStatus: "paid",
          "paymentMethod.stripePaymentIntentId": paymentIntentId,
        },
        { new: true }
      );
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        order,
        paymentStatus: paymentIntent.status,
      });
    } else {
      return NextResponse.json(
        { error: "Payment not successful", status: paymentIntent.status },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
