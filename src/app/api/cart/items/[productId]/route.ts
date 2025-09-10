import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { CartService } from "@/lib/cart-utils";
import { updateCartItemSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await req.json();
    const validatedData = updateCartItemSchema.parse(body);
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
          { message: "Session id is required" },
          { status: 400 }
        );
      }
      identifier.sessionId = sessionId;
    }
    const cart = await CartService.updateItemQuantity(
      identifier,
      productId,
      validatedData.quantity
    );
    return NextResponse.json({
      success: true,
      message: "Cart item updated",
      cart: cart.toJSON(),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "failed to update cart item" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
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
          { message: "Session id is required" },
          { status: 400 }
        );
      }
      identifier.sessionId = sessionId;
    }
    const cart = await CartService.removeItemFromCart(identifier, productId);
    return NextResponse.json({
      success: true,
      message: "item removed from cart",
      cart: cart.toJSON(),
    });
  } catch (error) {
    console.log("Error removing item", error);
    return NextResponse.json(
      { message: "Failed to remove item" },
      { status: 400 }
    );
  }
}
