import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Order } from "@/lib/models/Order";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { IOrderItem } from "@/app/types/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  let event: Stripe.Event;
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    // console.log("Webhook received:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) {
          console.error("No orderId in payment intent metadata");
          break;
        }
        const order = await Order.findById(orderId);
        if (!order) {
          console.error(`Order not found: ${orderId}`);
          break;
        }
        order.paymentStatus = "paid";
        order.status = "confirmed";
        order.stripePaymentIntentId = paymentIntent.id;
        order.updatedAt = new Date();
        await order.save();
        // console.log(`Order ${orderId} updated to paid/confirmed`);
        try {
          await sendOrderConfirmationEmail({
            orderId: order._id.toString(),
            customerEmail: order.email,
            customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
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
          // console.log(`Confirmation email sent for order ${orderId}`);
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;
        if (orderId) {
          const order = await Order.findById(orderId);
          if (order) {
            order.status = "cancelled";
            order.updatedAt = new Date();
            await order.save();
            console.log(`Order ${orderId} cancelled (payment failed)`);
          }
        }
        break;
      }

      case "payment_intent.requires_action": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment requires action: ${paymentIntent.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Error handling webhook event:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
  return NextResponse.json({ received: true }, { status: 200 });
}
