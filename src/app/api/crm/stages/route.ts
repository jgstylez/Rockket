import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const pipelineId = searchParams.get("pipelineId");
    if (!tenantId || !pipelineId) {
      return NextResponse.json(
        { error: "Tenant ID and Pipeline ID are required" },
        { status: 400 }
      );
    }

    const stages = await prisma.cRMPipelineStage.findMany({
      where: { tenantId, pipelineId },
      include: { _count: { select: { deals: true } } },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ stages });
  } catch (error) {
    console.error("Error fetching stages:", error);
    return NextResponse.json(
      { error: "Failed to fetch stages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pipelineId, name, order, tenantId } = body;
    if (!tenantId || !pipelineId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const stage = await prisma.cRMPipelineStage.create({
      data: { pipelineId, name, order: order ?? 0, tenantId },
    });
    return NextResponse.json({ stage }, { status: 201 });
  } catch (error) {
    console.error("Error creating stage:", error);
    return NextResponse.json(
      { error: "Failed to create stage" },
      { status: 500 }
    );
  }
}
