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
        a.status AS assetStatus,
        a.m_desc AS managerDescription,
        a.e_desc AS employeeDescription,
        m.name AS managerName,
        m.email AS managerEmail
      FROM asset_assignments aa
      JOIN assets a ON aa.asset_id = a.id
      LEFT JOIN users m ON aa.assigned_by = m.id
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, status, description } = body as {
      assetId?: number;
      status?: string;
      description?: string;
    };

    if (!assetId) {
      return NextResponse.json(
        { error: "assetId is required" },
        { status: 400 }
      );
    }

    const trimmedDescription = (description || "").trim();
    const normalizedStatus = (status || "").trim();

    const combined =
      trimmedDescription || normalizedStatus
        ? `Status: ${normalizedStatus || "N/A"}\n${trimmedDescription}`.trim()
        : null;

    await query("UPDATE assets SET e_desc = ? WHERE id = ?", [
      combined,
      assetId,
    ]);

    return NextResponse.json(
      { message: "Employee notes updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update my assignment notes error:", error);
    return NextResponse.json(
      { error: "Failed to update notes", details: error.message },
      { status: 500 }
    );
  }
}

