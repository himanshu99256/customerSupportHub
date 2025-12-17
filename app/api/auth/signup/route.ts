import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { generateToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["ADMIN", "MANAGER", "EMPLOYEE"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN, MANAGER, or EMPLOYEE" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUsers = await query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    ) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user into database
    const result = await query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    ) as any;

    const userId = result.insertId;

    // Generate JWT token
    const token = generateToken({
      userId,
      email,
      role: role as "ADMIN" | "MANAGER" | "EMPLOYEE",
    });

    // Return success response with token
    return NextResponse.json(
      {
        message: "User created successfully",
        token,
        user: {
          id: userId,
          name,
          email,
          role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

