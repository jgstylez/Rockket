import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const funnelId = searchParams.get("funnelId");
    const tenantId = searchParams.get("tenantId");

    if (!funnelId || !tenantId) {
      return NextResponse.json(
        { error: "Funnel ID and Tenant ID are required" },
        { status: 400 }
      );
    }

    const steps = await prisma.funnelStep.findMany({
      where: {
        funnelId,
        tenantId,
      },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ steps });
  } catch (error) {
    console.error("Error fetching funnel steps:", error);
    return NextResponse.json(
      { error: "Failed to fetch funnel steps" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { funnelId, name, type, order, config, tenantId } = body;

    if (!funnelId || !tenantId) {
      return NextResponse.json(
        { error: "Funnel ID and Tenant ID are required" },
        { status: 400 }
      );
    }

    const step = await prisma.funnelStep.create({
      data: {
        funnelId,
        name,
        type,
        order: order || 0,
        config: config || {},
        tenantId,
      },
      include: {
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    return NextResponse.json({ step }, { status: 201 });
  } catch (error) {
    console.error("Error creating funnel step:", error);
    return NextResponse.json(
      { error: "Failed to create funnel step" },
      { status: 500 }
    );
  }
}
