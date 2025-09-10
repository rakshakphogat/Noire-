import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/middleware";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const { amount, currency = "usd", metadata = {} } = await req.json();
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata: {
        userId: String(authResult.user._id),
        userEmail: String(authResult.user.email),
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
