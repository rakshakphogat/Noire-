import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (error) {
      return NextResponse.redirect(
        new URL("/auth/login?error=access_denied", req.url)
      );
    }
    if (!code) {
      return NextResponse.redirect(
        new URL("/auth/login?error=no_code", req.url)
      );
    }
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${new URL(req.url).origin}/api/auth/google/callback`,
      }),
    });
    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokens);
      return NextResponse.redirect(
        new URL("/auth/login?error=token_exchange_failed", req.url)
      );
    }
    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );
    const googleUser = await userResponse.json();
    if (!userResponse.ok) {
      console.error("Failed to get user info:", googleUser);
      return NextResponse.redirect(
        new URL("/auth/login?error=user_info_failed", req.url)
      );
    }
    await connectDB();
    let user = await User.findOne({ email: googleUser.email });
    if (!user) {
      user = await User.create({
        firstName:
          googleUser.given_name || googleUser.name?.split(" ")[0] || "",
        lastName:
          googleUser.family_name ||
          googleUser.name?.split(" ").slice(1).join(" ") ||
          "",
        email: googleUser.email,
        authProvider: "google",
        isEmailVerified: googleUser.verified_email,
        password: crypto.randomBytes(32).toString("hex"),
      });
    }
    // Issue JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    const response = NextResponse.redirect(new URL("/?login=success", req.url));
    // Set cookie
    response.cookies.set("auth-token", jwtToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    // Also set a temporary cookie for client-side access
    response.cookies.set(
      "temp-auth-data",
      JSON.stringify({
        token: jwtToken,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 60,
      }
    );
    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=callback_error", req.url)
    );
  }
}
