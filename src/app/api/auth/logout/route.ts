import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/middleware";
import { User } from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB();
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("auth-token", "", { path: "/", expires: new Date(0) });
    return res;
  }
  try {
    await User.findByIdAndUpdate(authResult.user._id, { isActive: false });
    const res = NextResponse.json({ success: true });
    res.cookies.set("auth-token", "", { path: "/", expires: new Date(0) });
    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
