import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { OnboardingProgressService } from "@/lib/onboarding/progress";

const progressService = new OnboardingProgressService();

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { action, stepId } = body;

      if (!action || !stepId) {
        return NextResponse.json(
          { error: "Action and step ID are required" },
          { status: 400 }
        );
      }

      let progress;
      switch (action) {
        case "complete":
          progress = await progressService.completeStep(
            req.user!.userId,
            req.user!.tenantId,
            stepId
          );
          break;
        case "skip":
          progress = await progressService.skipStep(
            req.user!.userId,
            req.user!.tenantId,
            stepId
          );
          break;
        case "set-current":
          progress = await progressService.setCurrentStep(
            req.user!.userId,
            req.user!.tenantId,
            stepId
          );
          break;
        default:
          return NextResponse.json(
            { error: "Invalid action" },
            { status: 400 }
          );
      }

      if (!progress) {
        return NextResponse.json(
          { error: "Failed to update progress" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        progress,
      });
    } catch (error) {
      console.error("Update onboarding step error:", error);
      return NextResponse.json(
        { error: "Failed to update onboarding step" },
        { status: 500 }
      );
    }
  });
}
