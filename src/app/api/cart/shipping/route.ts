import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { CartService } from "@/lib/cart-utils";
import { setShippingSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = setShippingSchema.parse(body);
    const identifier: { userId?: string; sessionId?: string } = {};
    const token = getTokenFromRequest(req);
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        identifier.userId = payload.userId;
      }
    }
    if (!identifier.userId) {
      const sessionId = req.headers.get("x-session-id");
      if (!sessionId) {
        return NextResponse.json(
          { error: "Session id is required" },
          { status: 400 }
        );
      }
      identifier.userId = sessionId;
    }
    const cart = await CartService.setShippingMethod(
      identifier,
      validatedData.shippingMethod
    );
    return NextResponse.json({
      success: true,
      message: "Shipping method updated",
      cart: cart.toJSON(),
    });
  } catch (error) {
    console.log("Error updating shipping method", error);
    return NextResponse.json(
      { message: "Failed to update shipping method" },
      { status: 400 }
    );
  }
}
