import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const forums = await prisma.forum.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      include: {
        threads: {
          include: {
            author: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { lastReplyAt: "desc" },
          take: 5,
        },
        _count: {
          select: { threads: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ forums });
  } catch (error) {
    console.error("Error fetching forums:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, tenantId } = body;

    if (!name || !slug || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const forum = await prisma.forum.create({
      data: {
        name,
        slug,
        description,
        tenantId,
        isActive: true,
      },
    });

    return NextResponse.json({ forum }, { status: 201 });
  } catch (error) {
    console.error("Error creating forum:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
