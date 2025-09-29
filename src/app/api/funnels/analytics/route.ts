import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const funnelId = searchParams.get("funnelId");
    const tenantId = searchParams.get("tenantId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!funnelId || !tenantId) {
      return NextResponse.json(
        { error: "Funnel ID and Tenant ID are required" },
        { status: 400 }
      );
    }

    const whereClause: any = {
      funnelId,
      tenantId,
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // Get funnel events with step information
    const events = await prisma.funnelEvent.findMany({
      where: whereClause,
      include: {
        step: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate conversion metrics
    const totalViews = events.filter((e) => e.type === "view").length;
    const totalClicks = events.filter((e) => e.type === "click").length;
    const totalSubmits = events.filter((e) => e.type === "submit").length;
    const totalPurchases = events.filter((e) => e.type === "purchase").length;
    const totalRevenue = events.reduce((sum, e) => sum + (e.revenue || 0), 0);

    const conversionRate =
      totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0;
    const clickThroughRate =
      totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    // Group events by step
    const stepAnalytics = events.reduce(
      (acc, event) => {
        const stepId = event.stepId || "no-step";
        if (!acc[stepId]) {
          acc[stepId] = {
            stepId,
            stepName: event.step?.name || "No Step",
            views: 0,
            clicks: 0,
            submits: 0,
            purchases: 0,
            revenue: 0,
          };
        }

        acc[stepId][`${event.type}s`]++;
        if (event.revenue) {
          acc[stepId].revenue += event.revenue;
        }

        return acc;
      },
      {} as Record<string, any>
    );

    const analytics = {
      overview: {
        totalViews,
        totalClicks,
        totalSubmits,
        totalPurchases,
        totalRevenue,
        conversionRate: Math.round(conversionRate * 100) / 100,
        clickThroughRate: Math.round(clickThroughRate * 100) / 100,
      },
      stepAnalytics: Object.values(stepAnalytics),
      events: events.slice(0, 50), // Limit to recent 50 events
    };

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Error fetching funnel analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch funnel analytics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      funnelId,
      stepId,
      userId,
      sessionId,
      type,
      properties,
      revenue,
      tenantId,
    } = body;

    if (!funnelId || !sessionId || !type || !tenantId) {
      return NextResponse.json(
        {
          error: "Funnel ID, Session ID, Type, and Tenant ID are required",
        },
        { status: 400 }
      );
    }

    const event = await prisma.funnelEvent.create({
      data: {
        funnelId,
        stepId,
        userId,
        sessionId,
        type,
        properties: properties || {},
        revenue: revenue || 0,
        tenantId,
      },
      include: {
        step: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating funnel event:", error);
    return NextResponse.json(
      { error: "Failed to create funnel event" },
      { status: 500 }
    );
  }
}
