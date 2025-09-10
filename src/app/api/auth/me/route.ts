import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { IUser, User } from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    await connectDB();
    const user = await User.findById(decoded.userId).lean<IUser>();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    return NextResponse.json({
      user: {
        id: user?._id?.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone || null,
        isEmailVerified: user.isEmailVerified,
        authProvider: user.authProvider,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
