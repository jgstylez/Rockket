import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const deals = await prisma.cRMDeal.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
      include: {
        pipeline: true,
        stage: true,
        contact: true,
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { activities: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ deals });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      value,
      currency,
      status,
      pipelineId,
      stageId,
      contactId,
      ownerId,
      expectedCloseAt,
      tenantId,
    } = body;
    if (!tenantId || !title || !pipelineId || !stageId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const deal = await prisma.cRMDeal.create({
      data: {
        title,
        value: value ?? 0,
        currency: currency ?? "USD",
        status: status ?? "open",
        pipelineId,
        stageId,
        contactId,
        ownerId,
        expectedCloseAt: expectedCloseAt ? new Date(expectedCloseAt) : null,
        tenantId,
      },
      include: { pipeline: true, stage: true, contact: true, owner: true },
    });
    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
