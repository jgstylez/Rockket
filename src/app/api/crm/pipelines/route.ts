import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const pipelines = await prisma.cRMPipeline.findMany({
      where: { tenantId },
      include: {
        stages: { orderBy: { order: "asc" } },
        _count: { select: { deals: true, stages: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ pipelines });
  } catch (error) {
    console.error("Error fetching pipelines:", error);
    return NextResponse.json(
      { error: "Failed to fetch pipelines" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, isDefault, stages, tenantId } = body;
    if (!tenantId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pipeline = await prisma.cRMPipeline.create({
      data: {
        name,
        isDefault: !!isDefault,
        tenantId,
        stages: stages?.length
          ? {
              create: stages.map((s: any, idx: number) => ({
                name: s.name,
                order: s.order ?? idx,
                tenantId,
              })),
            }
          : undefined,
      },
      include: { stages: true },
    });
    return NextResponse.json({ pipeline }, { status: 201 });
  } catch (error) {
    console.error("Error creating pipeline:", error);
    return NextResponse.json(
      { error: "Failed to create pipeline" },
      { status: 500 }
    );
  }
}
