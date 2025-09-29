import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const metric = searchParams.get("metric");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    if (metric) {
      where.source = metric;
    }

    // Get revenue metrics
    const revenueMetrics = await prisma.revenueMetric.findMany({
      where,
      orderBy: { date: "asc" },
    });

    // Get user engagement metrics
    const engagementMetrics = await prisma.userEngagement.findMany({
      where: {
        tenantId,
        ...(startDate && endDate
          ? {
              timestamp: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            }
          : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    // Calculate aggregated metrics
    const totalRevenue = revenueMetrics.reduce(
      (sum, metric) => sum + metric.revenue,
      0
    );
    const monthlyRevenue = revenueMetrics
      .filter(
        (m) =>
          new Date(m.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      )
      .reduce((sum, metric) => sum + metric.revenue, 0);

    const uniqueUsers = new Set(engagementMetrics.map((m) => m.userId)).size;
    const totalEvents = engagementMetrics.length;

    // Group by event type
    const eventCounts = engagementMetrics.reduce(
      (acc, metric) => {
        acc[metric.event] = (acc[metric.event] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        metrics: revenueMetrics,
      },
      engagement: {
        uniqueUsers,
        totalEvents,
        eventCounts,
        metrics: engagementMetrics,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics metrics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, tenantId } = body;

    if (!type || !data || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type === "revenue") {
      const { date, revenue, currency, source } = data;

      const metric = await prisma.revenueMetric.create({
        data: {
          date: new Date(date),
          revenue,
          currency: currency || "USD",
          source: source || "subscription",
          tenantId,
        },
      });

      return NextResponse.json({ metric }, { status: 201 });
    }

    if (type === "engagement") {
      const { userId, event, properties } = data;

      const engagement = await prisma.userEngagement.create({
        data: {
          userId,
          tenantId,
          event,
          properties: properties || {},
          timestamp: new Date(),
        },
      });

      return NextResponse.json({ engagement }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid metric type" }, { status: 400 });
  } catch (error) {
    console.error("Error creating analytics metric:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
