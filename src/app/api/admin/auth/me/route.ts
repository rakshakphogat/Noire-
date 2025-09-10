import { verifyAdminToken } from "@/app/middleware/adminAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const admin = await verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ admin: admin });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 401 }
    );
  }
}
