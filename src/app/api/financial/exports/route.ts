import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { tenantId };
    if (status) {
      whereClause.status = status;
    }
    if (type) {
      whereClause.type = type;
    }

    const exports = await prisma.financialExport.findMany({
      where: whereClause,
      include: {
        plan: { select: { id: true, name: true } },
        scenario: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ exports });
  } catch (error) {
    console.error("Error fetching financial exports:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial exports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, scenarioId, type, format, userId, tenantId } = body;

    if (!tenantId || !type || !format) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const exportRecord = await prisma.financialExport.create({
      data: {
        planId,
        scenarioId,
        type,
        format,
        status: "pending",
        userId,
        tenantId,
      },
      include: {
        plan: { select: { id: true, name: true } },
        scenario: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // In a real implementation, you would trigger the export generation here
    // For now, we'll simulate the export process
    setTimeout(async () => {
      try {
        const fileName = `financial-export-${exportRecord.id}.${type}`;
        const fileUrl = `https://exports.example.com/${fileName}`;

        await prisma.financialExport.update({
          where: { id: exportRecord.id },
          data: {
            status: "completed",
            fileUrl,
            fileName,
            completedAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Error completing export:", error);
        await prisma.financialExport.update({
          where: { id: exportRecord.id },
          data: { status: "failed" },
        });
      }
    }, 2000); // Simulate 2-second processing time

    return NextResponse.json({ export: exportRecord }, { status: 201 });
  } catch (error) {
    console.error("Error creating financial export:", error);
    return NextResponse.json(
      { error: "Failed to create financial export" },
      { status: 500 }
    );
  }
}
