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

    const programs = await prisma.affiliateProgram.findMany({
      where: { tenantId },
      include: {
        _count: { select: { affiliates: true, links: true, referrals: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error("Error fetching affiliate programs:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate programs" },
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
      commissionType,
      commissionValue,
      cookieDays,
      isActive,
      tenantId,
    } = body;
    if (!tenantId || !name || !commissionType || commissionValue == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const program = await prisma.affiliateProgram.create({
      data: {
        name,
        description,
        commissionType,
        commissionValue,
        cookieDays: cookieDays ?? 30,
        isActive: isActive ?? true,
        tenantId,
      },
      include: {
        _count: { select: { affiliates: true, links: true, referrals: true } },
      },
    });

    return NextResponse.json({ program }, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate program:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate program" },
      { status: 500 }
    );
  }
}
