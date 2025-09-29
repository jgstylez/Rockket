import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const linkId = searchParams.get("linkId");
    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const clicks = await prisma.affiliateClick.findMany({
      where: { tenantId, ...(linkId ? { linkId } : {}) },
      include: { link: true, affiliate: true, program: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ clicks });
  } catch (error) {
    console.error("Error fetching affiliate clicks:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate clicks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      programId,
      affiliateId,
      linkId,
      sessionId,
      ip,
      userAgent,
      referer,
      tenantId,
    } = body;
    if (!tenantId || !programId || !affiliateId || !linkId || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const click = await prisma.affiliateClick.create({
      data: {
        programId,
        affiliateId,
        linkId,
        sessionId,
        ip,
        userAgent,
        referer,
        tenantId,
      },
      include: { link: true, affiliate: true, program: true },
    });
    return NextResponse.json({ click }, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate click:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate click" },
      { status: 500 }
    );
  }
}
