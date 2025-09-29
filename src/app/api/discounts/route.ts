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

    const discounts = await prisma.discount.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: {
            usages: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ discounts });
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      type,
      value,
      minAmount,
      maxAmount,
      usageLimit,
      isActive,
      startsAt,
      expiresAt,
      conditions,
      tenantId,
    } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const discount = await prisma.discount.create({
      data: {
        name,
        code,
        type,
        value,
        minAmount,
        maxAmount,
        usageLimit,
        isActive: isActive !== undefined ? isActive : true,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        conditions: conditions || {},
        tenantId,
      },
      include: {
        _count: {
          select: {
            usages: true,
          },
        },
      },
    });

    return NextResponse.json({ discount }, { status: 201 });
  } catch (error) {
    console.error("Error creating discount:", error);
    return NextResponse.json(
      { error: "Failed to create discount" },
      { status: 500 }
    );
  }
}
