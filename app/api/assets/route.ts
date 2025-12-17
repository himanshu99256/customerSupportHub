import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(_request: NextRequest) {
  try {
    const assets = (await query(
      "SELECT id, name, type, serial_number AS serialNumber, status, created_at AS createdAt, updated_at AS updatedAt FROM assets ORDER BY created_at DESC"
    )) as any[];

    return NextResponse.json({ assets });
  } catch (error: any) {
    console.error("Fetch assets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assets", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, serialNumber } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Name and type are required" },
        { status: 400 }
      );
    }

    const result = (await query(
      "INSERT INTO assets (name, type, serial_number) VALUES (?, ?, ?)",
      [name, type, serialNumber || null]
    )) as any;

    const assetId = result.insertId;

    const [asset] = (await query(
      "SELECT id, name, type, serial_number AS serialNumber, status, created_at AS createdAt, updated_at AS updatedAt FROM assets WHERE id = ?",
      [assetId]
    )) as any[];

    return NextResponse.json(
      {
        message: "Asset created successfully",
        asset,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create asset error:", error);
    return NextResponse.json(
      { error: "Failed to create asset", details: error.message },
      { status: 500 }
    );
  }
}


