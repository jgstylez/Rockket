import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const programId = searchParams.get("programId");
    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const affiliates = await prisma.affiliate.findMany({
      where: { tenantId, ...(programId ? { programId } : {}) },
      include: {
        _count: {
          select: { links: true, clicks: true, referrals: true, payouts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ affiliates });
  } catch (error) {
    console.error("Error fetching affiliates:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliates" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { programId, userId, name, email, status, tenantId } = body;
    if (!tenantId || !programId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = `aff_${Math.random().toString(36).slice(2, 10)}`;

    const affiliate = await prisma.affiliate.create({
      data: {
        programId,
        userId,
        name,
        email,
        status: status ?? "active",
        token,
        tenantId,
      },
      include: {
        _count: {
          select: { links: true, clicks: true, referrals: true, payouts: true },
        },
      },
    });
    return NextResponse.json({ affiliate }, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate" },
      { status: 500 }
    );
  }
}
