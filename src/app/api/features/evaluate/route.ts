import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import {
  getFeatureFlag,
  evaluateFeatureFlag,
} from "@/lib/features/feature-flags";

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { flags, context = {} } = body;

      if (!Array.isArray(flags)) {
        return NextResponse.json(
          { error: "Flags must be an array" },
          { status: 400 }
        );
      }

      const results: Record<string, any> = {};

      for (const flagName of flags) {
        const flag = await getFeatureFlag(flagName);

        if (flag) {
          const evaluation = evaluateFeatureFlag(
            flag,
            req.user!.userId,
            req.user!.tenantId,
            context
          );
          results[flagName] = evaluation;
        } else {
          results[flagName] = { enabled: false };
        }
      }

      return NextResponse.json({
        success: true,
        results,
      });
    } catch (error) {
      console.error("Evaluate feature flags error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
