import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(_request: NextRequest) {
  try {
    const employees = (await query(
      "SELECT id, name, email, role FROM users WHERE role = 'EMPLOYEE' ORDER BY name ASC"
    )) as any[];

    return NextResponse.json({ employees });
  } catch (error: any) {
    console.error("Fetch employees error:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees", details: error.message },
      { status: 500 }
    );
  }
}


