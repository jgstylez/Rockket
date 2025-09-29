import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const type = searchParams.get("type");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (type) {
      where.type = type;
    }

    const reports = await prisma.analyticsReport.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        runs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Error fetching analytics reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      type,
      filters,
      metrics,
      schedule,
      tenantId,
      authorId,
    } = body;

    if (!name || !type || !tenantId || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const report = await prisma.analyticsReport.create({
      data: {
        name,
        description,
        type,
        filters: filters || {},
        metrics: metrics || [],
        schedule: schedule || {},
        tenantId,
        authorId,
        isActive: true,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Error creating analytics report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
