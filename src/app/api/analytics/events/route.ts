import { NextRequest, NextResponse } from "next/server";
import { withAuth, requireRole } from "@/lib/auth/middleware";
import { AnalyticsService } from "@/lib/analytics/events";

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  return withAuth(request, requireRole(["admin", "owner"]), async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const event = searchParams.get("event");
      const userId = searchParams.get("userId");
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const limit = parseInt(searchParams.get("limit") || "100");

      const events = await analyticsService.getEvents(req.user!.tenantId, {
        event: event || undefined,
        userId: userId || undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit,
      });

      return NextResponse.json({
        success: true,
        events,
        count: events.length,
      });
    } catch (error) {
      console.error("Get analytics events error:", error);
      return NextResponse.json(
        { error: "Failed to get analytics events" },
        { status: 500 }
      );
    }
  });
}
