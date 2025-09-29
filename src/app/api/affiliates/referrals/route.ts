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

    const referrals = await prisma.affiliateReferral.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
      include: { link: true, affiliate: true, program: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ referrals });
  } catch (error) {
    console.error("Error fetching affiliate referrals:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliate referrals" },
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
      orderId,
      amount,
      currency,
      status,
      tenantId,
    } = body;
    if (!tenantId || !programId || !affiliateId || !linkId || amount == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate commission
    const program = await prisma.affiliateProgram.findUnique({
      where: { id: programId },
    });
    if (!program) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }
    let commissionAmount = 0;
    if (program.commissionType === "percentage") {
      commissionAmount = (amount * program.commissionValue) / 100;
    } else {
      commissionAmount = program.commissionValue;
    }

    const referral = await prisma.affiliateReferral.create({
      data: {
        programId,
        affiliateId,
        linkId,
        orderId,
        amount,
        currency: currency ?? "USD",
        commissionAmount,
        status: status ?? "pending",
        tenantId,
      },
      include: { link: true, affiliate: true, program: true },
    });
    return NextResponse.json({ referral }, { status: 201 });
  } catch (error) {
    console.error("Error creating affiliate referral:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate referral" },
      { status: 500 }
    );
  }
}
