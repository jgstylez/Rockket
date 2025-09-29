import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const planId = searchParams.get("planId");
    const type = searchParams.get("type");

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
    if (type) {
      whereClause.type = type;
    }

    const scenarios = await prisma.financialScenario.findMany({
      where: whereClause,
      include: {
        plan: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error("Error fetching financial scenarios:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial scenarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, name, description, type, adjustments, userId, tenantId } =
      body;

    if (!tenantId || !planId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate scenario results based on adjustments
    const plan = await prisma.financialPlan.findUnique({
      where: { id: planId },
      include: { items: true },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Financial plan not found" },
        { status: 404 }
      );
    }

    // Calculate results based on adjustments
    const results = calculateScenarioResults(plan.items, adjustments || {});

    const scenario = await prisma.financialScenario.create({
      data: {
        planId,
        name,
        description,
        type: type ?? "optimistic",
        adjustments: adjustments || {},
        results,
        userId,
        tenantId,
      },
      include: {
        plan: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ scenario }, { status: 201 });
  } catch (error) {
    console.error("Error creating financial scenario:", error);
    return NextResponse.json(
      { error: "Failed to create financial scenario" },
      { status: 500 }
    );
  }
}

function calculateScenarioResults(items: any[], adjustments: any) {
  const results = {
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    cashFlow: 0,
    categories: {} as any,
  };

  items.forEach((item) => {
    const adjustment = adjustments[item.category] || 0;
    const adjustedAmount = item.amount * (1 + adjustment / 100);

    if (item.category === "revenue") {
      results.totalRevenue += adjustedAmount;
    } else if (item.category === "expense") {
      results.totalExpenses += adjustedAmount;
    }

    if (!results.categories[item.category]) {
      results.categories[item.category] = 0;
    }
    results.categories[item.category] += adjustedAmount;
  });

  results.netIncome = results.totalRevenue - results.totalExpenses;
  results.cashFlow = results.netIncome; // Simplified calculation

  return results;
}
