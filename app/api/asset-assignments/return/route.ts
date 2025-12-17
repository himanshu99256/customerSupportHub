import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Mark assignment as returned and update asset status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assignmentId, condition } = body as {
      assignmentId?: number;
      condition?: "OK" | "DAMAGED";
    };

    if (!assignmentId) {
      return NextResponse.json(
        { error: "assignmentId is required" },
        { status: 400 }
      );
    }

    const assignments = (await query(
      "SELECT id, asset_id AS assetId, status FROM asset_assignments WHERE id = ?",
      [assignmentId]
    )) as any[];

    if (assignments.length === 0) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );
    }

    const assignment = assignments[0];

    if (assignment.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Assignment is not active" },
        { status: 400 }
      );
    }

    const newAssetStatus =
      condition === "DAMAGED" ? "MAINTENANCE" : "AVAILABLE";

    // Update assignment and asset in a simple transactional sequence
    await query(
      "UPDATE asset_assignments SET status = 'RETURNED', returned_at = NOW() WHERE id = ?",
      [assignmentId]
    );

    await query("UPDATE assets SET status = ? WHERE id = ?", [
      newAssetStatus,
      assignment.assetId,
    ]);

    return NextResponse.json(
      { message: "Asset marked as returned", assetStatus: newAssetStatus },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Return asset error:", error);
    return NextResponse.json(
      { error: "Failed to mark asset as returned", details: error.message },
      { status: 500 }
    );
  }
}


