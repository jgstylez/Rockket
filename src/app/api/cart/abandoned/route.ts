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

    const whereClause: any = { tenantId };
    if (status) {
      whereClause.status = status;
    }

    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: whereClause,
      include: {
        emails: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            emails: true,
          },
        },
      },
      orderBy: { lastActivity: "desc" },
    });

    return NextResponse.json({ abandonedCarts });
  } catch (error) {
    console.error("Error fetching abandoned carts:", error);
    return NextResponse.json(
      { error: "Failed to fetch abandoned carts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, email, items, total, currency, tenantId } = body;

    if (!sessionId || !tenantId) {
      return NextResponse.json(
        { error: "Session ID and Tenant ID are required" },
        { status: 400 }
      );
    }

    // Check if cart already exists
    const existingCart = await prisma.abandonedCart.findUnique({
      where: {
        tenantId_sessionId: {
          tenantId,
          sessionId,
        },
      },
    });

    if (existingCart) {
      // Update existing cart
      const updatedCart = await prisma.abandonedCart.update({
        where: { id: existingCart.id },
        data: {
          userId,
          email,
          items,
          total,
          currency,
          lastActivity: new Date(),
        },
        include: {
          emails: true,
          _count: {
            select: {
              emails: true,
            },
          },
        },
      });

      return NextResponse.json({ abandonedCart: updatedCart });
    }

    // Create new abandoned cart
    const abandonedCart = await prisma.abandonedCart.create({
      data: {
        sessionId,
        userId,
        email,
        items,
        total,
        currency,
        tenantId,
      },
      include: {
        emails: true,
        _count: {
          select: {
            emails: true,
          },
        },
      },
    });

    return NextResponse.json({ abandonedCart }, { status: 201 });
  } catch (error) {
    console.error("Error creating abandoned cart:", error);
    return NextResponse.json(
      { error: "Failed to create abandoned cart" },
      { status: 500 }
    );
  }
}
