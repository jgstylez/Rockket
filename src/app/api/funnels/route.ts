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

    const funnels = await prisma.funnel.findMany({
      where: { tenantId },
      include: {
        steps: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ funnels });
  } catch (error) {
    console.error("Error fetching funnels:", error);
    return NextResponse.json(
      { error: "Failed to fetch funnels" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, goalType, metadata, tenantId, authorId } = body;

    if (!tenantId || !authorId) {
      return NextResponse.json(
        { error: "Tenant ID and Author ID are required" },
        { status: 400 }
      );
    }

    const funnel = await prisma.funnel.create({
      data: {
        name,
        slug,
        goalType,
        metadata: metadata || {},
        tenantId,
        authorId,
      },
      include: {
        steps: true,
        _count: {
          select: {
            events: true,
          },
        },
      },
    });

    return NextResponse.json({ funnel }, { status: 201 });
  } catch (error) {
    console.error("Error creating funnel:", error);
    return NextResponse.json(
      { error: "Failed to create funnel" },
      { status: 500 }
    );
  }
}
