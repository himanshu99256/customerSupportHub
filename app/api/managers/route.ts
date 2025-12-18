import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(_request: NextRequest) {
  try {
    const managers = (await query(
      `SELECT 
        id, 
        name, 
        email, 
        role,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM users 
      WHERE role = 'MANAGER' 
      ORDER BY name ASC`
    )) as any[];

    return NextResponse.json({ managers });
  } catch (error: any) {
    console.error("Fetch managers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch managers", details: error.message },
      { status: 500 }
    );
  }
}

