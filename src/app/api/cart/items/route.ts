import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { CartService } from "@/lib/cart-utils";
import { addItemToCartSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = addItemToCartSchema.parse(body);
    const identifier: { userId?: string; sessionId?: string } = {};
    const token = getTokenFromRequest(req);
    if (token) {
      const payload = verifyToken(token);
      console.log(payload);
      if (payload) {
        identifier.userId = payload.userId;
      }
    }
    if (!identifier.userId) {
      const sessionId = req.headers.get("x-session-id");
      if (!sessionId) {
        return NextResponse.json(
          {
            error: "Session Id is required",
          },
          { status: 400 }
        );
      }
      identifier.sessionId = sessionId;
    }
    const cart = await CartService.addItemToCart(
      identifier,
      validatedData.productId,
      validatedData.color,
      validatedData.size,
      validatedData.quantity
    );
    return NextResponse.json(
      { success: true, message: "Item added to cart", cart: cart.toJSON() },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error adding to cart", error);
    return NextResponse.json(
      { message: "Failed to add item" },
      { status: 400 }
    );
  }
}
