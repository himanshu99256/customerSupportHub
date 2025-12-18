import { sign, verify as jwtVerify, type SignOptions, type Secret } from "jsonwebtoken";
import type ms from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_change_this_in_production";
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_EXPIRES_IN: ms.StringValue =
  (process.env.JWT_EXPIRES_IN as ms.StringValue) || "7d";

export interface JWTPayload {
  userId: number;
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  const secret: Secret = JWT_SECRET as Secret;
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return sign(payload as object, secret, options);
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret: Secret = JWT_SECRET as Secret;
    const decoded = jwtVerify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

