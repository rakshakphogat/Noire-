import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

export interface JWTPayload {
  userId: string;
  role: string;
  email: string;
}

export function generateToken(payLoad: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: "7d",
  };
  const token = jwt.sign(payLoad, JWT_SECRET, options);
  return token;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  const cookieToken = req.cookies.get("auth-token")?.value;
  return cookieToken || null;
}
