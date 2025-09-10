import { CartService } from "@/lib/cart-utils";
import { requireAuth } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const body = await req.json();
    const { sessionId } = body;
    if (!sessionId) {
      return NextResponse.json(
        {
          error: "Session id is required",
        },
        { status: 400 }
      );
    }
    const cart = await CartService.transferGuestCart(
      sessionId,
      authResult.user._id
    );
    return NextResponse.json({
      success: true,
      message: cart ? "Guest cart transferred" : "no guest cart found",
      cart: cart?.toJSON() || null,
    });
  } catch (error) {
    console.log("transferring cart error", error);
    return NextResponse.json(
      { error: "failed to transfer cart" },
      { status: 500 }
    );
  }
}
