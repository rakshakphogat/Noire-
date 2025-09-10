import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { confirmResetPasswordSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = confirmResetPasswordSchema.parse(body);
    const user = await User.findOne({
      passwordResetToken: validatedData.token,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }
    // Update user password and clear reset token
    user.password = validatedData.password;
    await user.save();
    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
