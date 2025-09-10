import { requireAuth } from "@/lib/middleware";
import { updateProfileSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);
    Object.assign(authResult.user, validatedData);
    if (validatedData.dateOfBirth) {
      authResult.user.dateOfBirth = new Date(validatedData.dateOfBirth);
    }
    await authResult.user.save();
    return NextResponse.json({
      success: true,
      message: "Profile Updated Successfully",
      user: authResult.user.toJSON(),
    });
  } catch (error) {
    console.log(error, "INTERNAL");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  try {
    const userData = authResult.user.toJSON();
    if (userData.dateOfBirth) {
      userData.dateOfBirth = userData.dateOfBirth.toISOString();
    }
    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error("Fetch profile error", error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}
