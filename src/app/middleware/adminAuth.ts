import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

export async function verifyAdminToken(
  token: string
): Promise<AdminUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function adminAuthMiddleware(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const admin = await verifyAdminToken(token);
  if (!admin) {
    return NextResponse.json(
      { error: "Invalid authentication token" },
      { status: 401 }
    );
  }

  return null;
}
