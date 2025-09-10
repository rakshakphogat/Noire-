import { generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { loginSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const validatedData = loginSchema.parse(body);
    const user = await User.findOne({ email: validatedData.email }).select(
      "+password"
    );
    if (!user) {
      return NextResponse.json({ error: "Invalid data" }, { status: 401 });
    }
    if (user.authProvider === "google") {
      return NextResponse.json(
        { error: "Please login using Google" },
        { status: 400 }
      );
    }
    const isPasswordValid = await user.comparePassword(validatedData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
    user.isActive = true;
    user.lastLogin = new Date();
    await user.save();
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: user.toJSON(),
      token,
      isActive: user.isActive,
    });
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
