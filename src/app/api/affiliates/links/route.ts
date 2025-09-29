import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const affiliateId = searchParams.get("affiliateId");
    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const links = await prisma.affiliateLink.findMany({
      where: { tenantId, ...(affiliateId ? { affiliateId } : {}) },
      include: {
        _count: { select: { clicks: true, referrals: true } },
        affiliate: true,
        program: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ links });
  } catch (error) {
    console.error("Error fetching affiliate links:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programId, affiliateId, code, url, isActive, tenantId } = body;
    if (!tenantId || !programId || !affiliateId || !code) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const link = await prisma.affiliateLink.create({
      data: {
        programId,
        affiliateId,
        code,
        url,
        isActive: isActive ?? true,
        tenantId,
      },
      include: {
        _count: { select: { clicks: true, referrals: true } },
        affiliate: true,
        program: true,
      },
    });
    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate link:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate link" },
      { status: 500 }
    );
  }
}
