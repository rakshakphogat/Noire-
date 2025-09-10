import { requireAuth } from "@/lib/middleware";
import { IAddress } from "@/app/types/Order";
import { addressSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { ZodError } from "zod";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  return NextResponse.json({
    success: true,
    addresses: authResult.user.addresses,
  });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const body = await req.json();
    const validatedData = addressSchema.parse(body);
    if (validatedData.isDefault) {
      authResult.user.addresses.forEach((add: IAddress) => {
        add.isDefault = false;
      });
    }
    authResult.user.addresses.push(validatedData);
    await authResult.user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Address added Successfully",
        addresses: authResult.user.addresses,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in adding address", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const firstError = Object.values(error.errors)[0]?.message;
      return NextResponse.json({ error: firstError }, { status: 400 });
    }
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
