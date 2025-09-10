import { generateRandomToken, generateToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import { registerSchema } from "@/lib/validation";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const validatedData = registerSchema.parse(body);
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const user = new User({
      ...validatedData,
      emailVerificationToken: generateRandomToken(),
      dateOfBirth: validatedData.dateOfBirth
        ? new Date(validatedData.dateOfBirth)
        : undefined,
    });
    await user.save();
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
    const response = NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: user.toJSON(),
        token,
      },
      { status: 201 }
    );
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return response;
  } catch (error) {
    console.log("Error in registering", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const firstError = Object.values(error.errors)[0]?.message;
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 400 }
    );
  }
}
