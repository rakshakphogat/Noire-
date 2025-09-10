import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { resetPasswordSchema } from "@/lib/validation";
import { generateRandomToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const validatedData = resetPasswordSchema.parse(body);
    const user = await User.findOne({
      email: validatedData.email,
    });
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "If an account with this email exists, you will receive a password reset link.",
      });
    }
    // Generate reset token
    const resetToken = generateRandomToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();
    const emailSent = await sendPasswordResetEmail(
      validatedData.email,
      resetToken
    );
    if (!emailSent) {
      console.error(
        "Failed to send password reset email to:",
        validatedData.email
      );
    }
    return NextResponse.json({
      success: true,
      message:
        "If an account with this email exists, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
