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

    const giftCards = await prisma.giftCard.findMany({
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

    return NextResponse.json({ giftCards });
  } catch (error) {
    console.error("Error fetching gift cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch gift cards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, amount, balance, isActive, expiresAt, notes, tenantId } =
      body;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const giftCard = await prisma.giftCard.create({
      data: {
        code,
        amount,
        balance: balance !== undefined ? balance : amount,
        isActive: isActive !== undefined ? isActive : true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        notes,
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

    return NextResponse.json({ giftCard }, { status: 201 });
  } catch (error) {
    console.error("Error creating gift card:", error);
    return NextResponse.json(
      { error: "Failed to create gift card" },
      { status: 500 }
    );
  }
}
