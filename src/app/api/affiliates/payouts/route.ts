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

    const payouts = await prisma.affiliatePayout.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
      include: { affiliate: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ payouts });
  } catch (error) {
    console.error("Error fetching affiliate payouts:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate payouts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      affiliateId,
      amount,
      currency,
      status,
      method,
      metadata,
      paidAt,
      tenantId,
      userId,
    } = body;
    if (!tenantId || !affiliateId || !userId || amount == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First verify that the affiliate exists and belongs to the tenant
    const affiliate = await prisma.affiliate.findFirst({
      where: { id: affiliateId, tenantId },
    });
    if (!affiliate) {
      return NextResponse.json(
        { error: "Affiliate not found" },
        { status: 404 }
      );
    }

    // Then verify that the user exists and belongs to the tenant
    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const payout = await prisma.affiliatePayout.create({
      data: {
        affiliateId,
        userId,
        amount,
        currency: currency ?? "USD",
        status: status ?? "pending",
        method: method ?? "manual",
        metadata: metadata ?? {},
        paidAt: paidAt ? new Date(paidAt) : null,
        tenantId,
      },
      include: { affiliate: true, user: true },
    });
    return NextResponse.json({ payout }, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate payout:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate payout" },
      { status: 500 }
    );
  }
}
