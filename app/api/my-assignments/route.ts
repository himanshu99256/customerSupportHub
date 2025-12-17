import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const assignments = (await query(
      `SELECT 
        aa.id,
        aa.asset_id AS assetId,
        aa.user_id AS userId,
        aa.assigned_at AS assignedAt,
        aa.returned_at AS returnedAt,
        aa.status,
        a.name AS assetName,
        a.type AS assetType,
        a.serial_number AS serialNumber,
        a.status AS assetStatus
      FROM asset_assignments aa
      JOIN assets a ON aa.asset_id = a.id
      WHERE aa.user_id = ?
      ORDER BY aa.assigned_at DESC`,
      [userId]
    )) as any[];

    return NextResponse.json({ assignments });
  } catch (error: any) {
    console.error("Fetch my assignments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments", details: error.message },
      { status: 500 }
    );
  }
}


