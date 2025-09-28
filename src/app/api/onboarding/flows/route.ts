import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import {
  ONBOARDING_FLOWS,
  getOnboardingFlowsByRole,
} from "@/lib/onboarding/steps";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const flows = getOnboardingFlowsByRole(req.user!.role);

      return NextResponse.json({
        success: true,
        flows,
      });
    } catch (error) {
      console.error("Get onboarding flows error:", error);
      return NextResponse.json(
        { error: "Failed to get onboarding flows" },
        { status: 500 }
      );
    }
  });
}
