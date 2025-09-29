import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const planId = searchParams.get("planId");
    const category = searchParams.get("category");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { tenantId };
    if (planId) {
      whereClause.planId = planId;
    }
    if (category) {
      whereClause.category = category;
    }

    const items = await prisma.financialPlanItem.findMany({
      where: whereClause,
      include: {
        plan: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching financial plan items:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial plan items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      planId,
      category,
      subcategory,
      name,
      description,
      amount,
      frequency,
      startDate,
      endDate,
      isRecurring,
      isVariable,
      tenantId,
    } = body;

    if (!tenantId || !planId || !category || !name || amount == null) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const item = await prisma.financialPlanItem.create({
      data: {
        planId,
        category,
        subcategory,
        name,
        description,
        amount,
        frequency: frequency ?? "monthly",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isRecurring: isRecurring ?? true,
        isVariable: isVariable ?? false,
        tenantId,
      },
      include: {
        plan: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Error creating financial plan item:", error);
    return NextResponse.json(
      { error: "Failed to create financial plan item" },
      { status: 500 }
    );
  }
}
