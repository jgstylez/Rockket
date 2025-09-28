import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { AnalyticsService, ANALYTICS_EVENTS } from "@/lib/analytics/events";

const analyticsService = new AnalyticsService();

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { event, properties = {}, sessionId } = body;

      if (!event) {
        return NextResponse.json(
          { error: "Event name is required" },
          { status: 400 }
        );
      }

      await analyticsService.trackEvent(
        event,
        properties,
        req.user!.userId,
        req.user!.tenantId,
        sessionId
      );

      return NextResponse.json({
        success: true,
        message: "Event tracked successfully",
      });
    } catch (error) {
      console.error("Analytics tracking error:", error);
      return NextResponse.json(
        { error: "Failed to track event" },
        { status: 500 }
      );
    }
  });
}
