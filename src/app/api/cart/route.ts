import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { CartService } from "@/lib/cart-utils";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const identifier: { userId?: string; sessionId?: string } = {};
    const token = getTokenFromRequest(req);
    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        identifier.userId = payload.userId;
      }
    }
    if (!identifier.userId) {
      const sessionId = req.headers.get("x-session-id") || uuidv4();
      identifier.sessionId = sessionId;
      const cart = await CartService.findOrCreateCart(identifier);
      const response = NextResponse.json({
        success: true,
        cart: cart.toJSON(),
        sessionId,
      });
      response.headers.set("x-session-id", sessionId);
      return response;
    }
    const cart = await CartService.findOrCreateCart(identifier);
    return NextResponse.json({
      success: true,
      cart: cart.toJSON(),
    });
  } catch (error) {
    console.log("Getting cart error", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
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
          { error: "Session ID required for guest users" },
          { status: 400 }
        );
      }
      identifier.sessionId = sessionId;
    }
    const cart = await CartService.clearCart(identifier);
    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
      cart: cart.toJSON(),
    });
  } catch (error) {
    console.log("Clear cart error", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
