import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Get recent assignments with asset & employee info
export async function GET(_request: NextRequest) {
  try {
    const assignments = (await query(
      `SELECT 
        aa.id,
        aa.asset_id AS assetId,
        aa.user_id AS userId,
        aa.assigned_by AS assignedById,
        aa.assigned_at AS assignedAt,
        aa.returned_at AS returnedAt,
        aa.status,
        a.name AS assetName,
        a.type AS assetType,
        a.serial_number AS serialNumber,
        a.status AS assetStatus,
        u.name AS employeeName,
        u.email AS employeeEmail,
        m.name AS managerName,
        m.email AS managerEmail
      FROM asset_assignments aa
      JOIN assets a ON aa.asset_id = a.id
      JOIN users u ON aa.user_id = u.id
      JOIN users m ON aa.assigned_by = m.id
      ORDER BY aa.assigned_at DESC
      LIMIT 50`
    )) as any[];

    return NextResponse.json({ assignments });
  } catch (error: any) {
    console.error("Fetch assignments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignments", details: error.message },
      { status: 500 }
    );
  }
}

// Assign asset to employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, userId, assignedById, managerDescription } = body as {
      assetId?: number;
      userId?: number;
      assignedById?: number;
      managerDescription?: string | null;
    };

    if (!assetId || !userId) {
      return NextResponse.json(
        { error: "assetId and userId are required" },
        { status: 400 }
      );
    }

    const effectiveAssignedById = assignedById ?? userId;

    // Ensure asset is available
    const assets = (await query(
      "SELECT id, status FROM assets WHERE id = ?",
      [assetId]
    )) as any[];

    if (assets.length === 0) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    if (assets[0].status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Asset is not available for assignment" },
        { status: 400 }
      );
    }

    // Insert assignment
    await query(
      "INSERT INTO asset_assignments (asset_id, user_id, assigned_by, status) VALUES (?, ?, ?, 'ACTIVE')",
      [assetId, userId, effectiveAssignedById]
    );

    // Update asset status and manager description
    await query(
      "UPDATE assets SET status = 'ASSIGNED', m_desc = ? WHERE id = ?",
      [managerDescription ?? null, assetId]
    );

    return NextResponse.json(
      { message: "Asset assigned successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Assign asset error:", error);
    return NextResponse.json(
      { error: "Failed to assign asset", details: error.message },
      { status: 500 }
    );
  }
}


