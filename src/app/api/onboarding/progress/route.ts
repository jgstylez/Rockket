import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { OnboardingProgressService } from "@/lib/onboarding/progress";

const progressService = new OnboardingProgressService();

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const progress = await progressService.getUserProgress(
        req.user!.userId,
        req.user!.tenantId
      );

      return NextResponse.json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error("Get onboarding progress error:", error);
      return NextResponse.json(
        { error: "Failed to get onboarding progress" },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { flowId, currentStep } = body;

      if (!flowId || !currentStep) {
        return NextResponse.json(
          { error: "Flow ID and current step are required" },
          { status: 400 }
        );
      }

      const progress = await progressService.createUserProgress(
        req.user!.userId,
        req.user!.tenantId,
        flowId,
        currentStep
      );

      return NextResponse.json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error("Create onboarding progress error:", error);
      return NextResponse.json(
        { error: "Failed to create onboarding progress" },
        { status: 500 }
      );
    }
  });
}
