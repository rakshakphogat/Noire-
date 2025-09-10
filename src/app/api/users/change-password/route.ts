import { requireAuth } from "@/lib/middleware";
import { changePasswordSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const body = await req.json();
    const validatedData = changePasswordSchema.parse(body);
    const isCurrentPasswordvalid = await authResult.user.comparePassword(
      validatedData.currentPassword
    );
    if (!isCurrentPasswordvalid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }
    authResult.user.password = validatedData.newPassword;
    await authResult.user.save();
    return NextResponse.json({
      success: true,
      message: "Password changed Successfully",
    });
  } catch (error) {
    console.log("error updating  password", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 400 }
    );
  }
}
