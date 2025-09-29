import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

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
    if (type) {
      whereClause.type = type;
    }

    const plans = await prisma.financialPlan.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
            items: true,
            scenarios: true,
            exports: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching financial plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial plans" },
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
      type,
      status,
      currency,
      startDate,
      endDate,
      isTemplate,
      userId,
      tenantId,
    } = body;

    if (!tenantId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = await prisma.financialPlan.create({
      data: {
        name,
        description,
        type: type ?? "business",
        status: status ?? "draft",
        currency: currency ?? "USD",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isTemplate: isTemplate ?? false,
        userId,
        tenantId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: {
          select: {
            items: true,
            scenarios: true,
            exports: true,
          },
        },
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Error creating financial plan:", error);
    return NextResponse.json(
      { error: "Failed to create financial plan" },
      { status: 500 }
    );
  }
}
