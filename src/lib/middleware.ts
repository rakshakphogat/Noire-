import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "./db";
import { getTokenFromRequest, verifyToken } from "./auth";
import { User } from "./models/User";

export async function requireAuth(req: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(req);
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    const user = await User.findById(payload.userId);
    if (user && !user.isActive) {
      user.isActive = true;
      await user.save();
    }
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "User not found or inactive" },
        { status: 401 }
      );
    }
    return { user, payload };
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

export async function requireAdmin(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  if (authResult.user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }
  return authResult;
}
