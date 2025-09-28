import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRole } from "@/lib/auth/middleware";
import { AnalyticsService } from "@/lib/analytics/events";

const analyticsService = new AnalyticsService();

export async function GET(request: NextRequest) {
  return withAuthAndRole(request, ["admin", "owner"], async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");

      const metrics = await analyticsService.getEventMetrics(
        req.user!.tenantId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined
      );

      return NextResponse.json({
        success: true,
        metrics,
      });
    } catch (error) {
      console.error("Get analytics metrics error:", error);
      return NextResponse.json(
        { error: "Failed to get analytics metrics" },
        { status: 500 }
      );
    }
  });
}
